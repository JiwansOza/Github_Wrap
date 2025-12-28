import { getGitHubStats } from "@/lib/github";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import ClientPage from "./client-page";
import { Metadata } from "next";

export const runtime = 'edge';

type Props = {
    searchParams: Promise<{ username: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { username } = await searchParams;
    if (!username) return { title: "GitHub Wrapped 2025" };

    const stats = await getGitHubStats(username);
    if (!stats) return { title: "User Not Found - GitHub Wrapped 2025" };

    // Construct the OG Image URL with all dynamic params
    const params = new URLSearchParams({
        username: stats.username,
        avatar: stats.avatarUrl,
        commits: stats.totalCommits.toString(),
        repos: stats.totalPublicRepos.toString(),
        days: stats.daysActive.toString(),
        streak: stats.longestStreak.toString(),
        currentStreak: (stats.currentStreak || 0).toString(),
        lang: stats.topLanguage || 'Code',
        month: stats.mostActiveMonth || 'Year',
        prs: (stats.totalPRs || 0).toString(),
        stars: (stats.totalStars || 0).toString(),
        style: stats.codingStyle || 'Developer',
        theme: 'cyberpunk', // Hardcoded default for consistency
        roast: stats.roast || 'No roast available.',
        repo: stats.topRepo?.name || '',
        repoStars: (stats.topRepo?.stars || 0).toString(),
        languages: JSON.stringify(stats.languages || []),
    });

    // Use absolute URL if possible, otherwise relative (Next.js handles relative if metadataBase is set)
    // We assume the API route is at /api/og
    const ogImageUrl = `/api/og?${params.toString()}`;

    return {
        title: `GitHub Wrapped 2025: @${stats.username}`,
        description: `Check out my GitHub 2025 stats: ${stats.totalCommits} commits, ${stats.longestStreak} day streak, and my coding personality is "${stats.codingStyle}".`,
        openGraph: {
            title: `GitHub Wrapped 2025: @${stats.username}`,
            description: `Check out my GitHub 2025 stats: ${stats.totalCommits} commits, ${stats.longestStreak} day streak, and my coding personality is "${stats.codingStyle}".`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1080,
                    height: 1350,
                    alt: `GitHub Wrapped 2025 for ${stats.username}`,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `GitHub Wrapped 2025: @${stats.username}`,
            description: `Check out my GitHub 2025 stats!: ${stats.totalCommits} commits, ${stats.longestStreak} day streak!`,
            images: [ogImageUrl],
            creator: '@JiwansOza',
        },
    };
}

export default async function ResultPage({
    searchParams,
}: {
    searchParams: Promise<{ username: string }>;
}) {
    const { username } = await searchParams;

    if (!username) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white p-6">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-red-400">Missing Username</h2>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full">
                        <ArrowLeft size={20} /> Return Home
                    </Link>
                </div>
            </div>
        );
    }

    const stats = await getGitHubStats(username);

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white p-6">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <Github size={32} />
                    </div>
                    <h2 className="text-3xl font-bold">User Not Found</h2>
                    <p className="text-gray-400">We couldn't fetch data for @{username}.</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold">
                        <ArrowLeft size={20} /> Try Another User
                    </Link>
                </div>
            </div>
        );
    }

    // Pass everything to the client component for interactivity
    return <ClientPage stats={stats} />;
}
