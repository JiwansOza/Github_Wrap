import { Octokit } from "octokit";
import { graphql } from "@octokit/graphql";
import { startOfYear, endOfYear } from "date-fns";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.warn("GITHUB_TOKEN is not defined in environment variables. Rate limits will be strict.");
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const graphqlClient = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

export interface WrappedStats {
  username: string;
  avatarUrl: string;
  totalCommits: number;
  totalPublicRepos: number;
  daysActive: number;
  longestStreak: number;
  currentStreak: number;
  mostActiveMonth: string;
  topLanguage: string;
  languages: Array<{ name: string; percent: number; color: string }>;
  codingStyle: string;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  roast: string;
  topRepo: { name: string; stars: number; description: string };
}

export async function getGitHubStats(username: string): Promise<WrappedStats | null> {
  try {
    // 1. Fetch User Profile & Public Repos (REST)
    const { data: user } = await octokit.rest.users.getByUsername({ username });

    // 2. Fetch Contributions (GraphQL)
    // We need the contribution calendar for the current year (2025). 
    // Since 2025 is future/current, we might need 2024 if 2025 is empty? 
    // The prompt says "GITHUB WRAPPED 2025". Assumes we are IN 2025 or generating for it.
    // If we are testing this in 2024/2025, we should use the current year or specific year.
    // Let's dynamic the year.

    // Actually, for "Wrapped", it usually implies the *past* year or current year if near end.
    // Let's hardcode 2025 as per prompt, but fall back to "current year" logic if needed.
    // Prompt says "GitHub Wrapped 2025". I will assume data is for 2025.

    const year = 2025;
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const contributionsQuery = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              name
              description
              stargazers {
                totalCount
              }
              languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                  color
                }
              }
            }
          }
        }
      }
    `;

    const data: any = await graphqlClient(contributionsQuery, {
      username,
      from,
      to,
    });

    const contributionCollection = data.user.contributionsCollection;
    const contributionCalendar = contributionCollection.contributionCalendar;
    const repos = data.user.repositories.nodes;

    // --- Calculate Stats ---

    // Total Commits/Contributions
    const totalCommits = contributionCalendar.totalContributions;
    const totalPRs = contributionCollection.totalPullRequestContributions;
    const totalIssues = contributionCollection.totalIssueContributions;

    // Total Stars
    let totalStars = 0;
    repos.forEach((repo: any) => {
      totalStars += repo.stargazers.totalCount;
    });

    // Days Active & Streak
    let daysActive = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    const monthsActivity: { [key: string]: number } = {};

    contributionCalendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        if (day.contributionCount > 0) {
          daysActive++;
          currentStreak++;

          // Monthly Activity
          const month = new Date(day.date).toLocaleString('default', { month: 'long' });
          monthsActivity[month] = (monthsActivity[month] || 0) + day.contributionCount;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 0;
        }
      });
    });
    // Final check for streak if active at end of year
    longestStreak = Math.max(longestStreak, currentStreak);

    // Most Active Month
    let mostActiveMonth = "January";
    let maxMonthActivity = 0;
    for (const [month, count] of Object.entries(monthsActivity)) {
      if (count > maxMonthActivity) {
        maxMonthActivity = count;
        mostActiveMonth = month;
      }
    }

    // Top Languages Calculation
    const languageMap: { [key: string]: { count: number; color: string } } = {};
    let totalRepoLanguages = 0;

    repos.forEach((repo: any) => {
      if (repo.languages.nodes.length > 0) {
        const langNode = repo.languages.nodes[0];
        const langName = langNode.name;
        const langColor = langNode.color;

        if (!languageMap[langName]) {
          languageMap[langName] = { count: 0, color: langColor };
        }
        languageMap[langName].count += 1;
        totalRepoLanguages++;
      }
    });

    const languages = Object.entries(languageMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        color: data.color || '#ccc',
        percent: totalRepoLanguages > 0 ? (data.count / totalRepoLanguages) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5

    const topLanguage = languages.length > 0 ? languages[0].name : "N/A";

    // Coding Style / Persona Logic
    let morning = 0; // 5-11
    let daytime = 0; // 11-17
    let evening = 0; // 17-23
    let night = 0;   // 23-5
    let weekend = 0;

    // Use a default empty array if commitContributionsByRepository is missing
    const commitRepos = contributionCollection.commitContributionsByRepository || [];
    let totalTimeSamples = 0;

    commitRepos.forEach((repoData: any) => {
      repoData.contributions.forEach((contrib: any) => {
        const date = new Date(contrib.occurredAt);
        const hour = date.getHours();
        const day = date.getDay(); // 0 is Sunday, 6 is Saturday

        if (day === 0 || day === 6) weekend++;

        if (hour >= 5 && hour < 12) morning++;
        else if (hour >= 12 && hour < 17) daytime++;
        else if (hour >= 17 && hour < 23) evening++;
        else night++;

        totalTimeSamples++;
      });
    });

    let codingStyle = "Balanced ⚖️";
    if (totalTimeSamples > 0) {
      const isWeekendWarrior = weekend / totalTimeSamples > 0.4;

      if (isWeekendWarrior) {
        codingStyle = "Weekend Warrior ⚔️";
      } else {
        const maxPeriod = Math.max(morning, daytime, evening, night);
        if (maxPeriod === night) codingStyle = "Night Owl 🦉";
        else if (maxPeriod === morning) codingStyle = "Early Bird 🌅";
        else if (maxPeriod === daytime) codingStyle = "9-to-5er 🏢";
        else if (maxPeriod === evening) codingStyle = "Burner Oil 🔥"; // Late evening
      }
    }

    // Top Repo (Project Spotlight)
    let topRepo = { name: "N/A", stars: 0, description: "No top project found." };
    if (repos.length > 0) {
      // Already sorted by pushed_at in query, but we want stars for "Top Project"
      const sortedByStars = [...repos].sort((a: any, b: any) => b.stargazers.totalCount - a.stargazers.totalCount);
      const best = sortedByStars[0];
      topRepo = {
        name: best.name,
        stars: best.stargazers.totalCount,
        description: best.description || "No description provided." // We didn't fetch description in query, need to check
      };
    }

    // Roast Generator Logic
    let roast = "You write code like a focused machine.";
    if (totalCommits < 10) roast = "Lurker detected. Do you even git push?";
    else if (totalCommits > 1000) roast = "Go touch grass. Seriously.";
    else if (languages.length > 6) roast = "Jack of all trades, master of none.";
    else if (topLanguage === "JavaScript" || topLanguage === "TypeScript") roast = "Another frontend dev chasing the hype train.";
    else if (topLanguage === "Rust") roast = "We get it, you rewrite everything in Rust.";
    else if (topLanguage === "Python") roast = "Indentation error: whitespace on line 42.";
    else if (topLanguage === "Java") roast = "Standard Enterprise Grade boilerplate generator.";
    else if (longestStreak > 30) roast = "Consistency is key, but so is sleep.";
    else if (codingStyle.includes("Weekend")) roast = "Weekend Warrior: Coding only when paid to do so? Oh wait, it's free.";

    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      totalCommits,
      totalPublicRepos: user.public_repos,
      daysActive,
      longestStreak,
      currentStreak,
      mostActiveMonth,
      topLanguage,
      languages,
      codingStyle,
      totalPRs,
      totalIssues,
      totalStars,
      roast,
      topRepo,
    };

  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return null;
  }
}
