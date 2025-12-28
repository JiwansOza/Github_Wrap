'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TiltCard from './tilt-card';
import ShareButtons from './share-buttons';
import StoryMode from './story-mode';
import confetti from 'canvas-confetti';

// Helper to construct OG URL dynamically
function getOgUrl(baseUrl: string, stats: any, theme: string) {
    const params = new URLSearchParams({
        username: stats.username || 'User',
        avatar: stats.avatarUrl || '',
        commits: (stats.totalCommits || 0).toString(),
        repos: (stats.totalPublicRepos || 0).toString(),
        days: (stats.daysActive || 0).toString(),
        streak: (stats.longestStreak || 0).toString(),
        currentStreak: (stats.currentStreak || 0).toString(),
        lang: stats.topLanguage || 'Code',
        month: stats.mostActiveMonth || 'Year',
        prs: (stats.totalPRs || 0).toString(),
        stars: (stats.totalStars || 0).toString(),
        style: stats.codingStyle || 'Developer',
        theme: theme,
        roast: stats.roast || 'No roast available.',
        repo: stats.topRepo?.name || '',
        repoStars: (stats.topRepo?.stars || 0).toString(),
        followers: (stats.followers || 0).toString(),
        peakDay: stats.mostActiveDay || 'Wednesday',
        created: stats.createdAt || new Date().toISOString(),
        starred: (stats.totalStarred || 0).toString(),
        activity: JSON.stringify(stats.activityByPeriod || {}),
        languages: JSON.stringify(stats.languages || []),
        velocity: (stats.busiestDay?.count || 0).toString(),
        polyglot: (stats.polyglotScore || 0).toString(),
    });
    return `/api/og?${params.toString()}`;
}

export default function ClientPage({ stats }: { stats: any }) {
    const [theme] = useState('cyberpunk');
    const [showStory, setShowStory] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false); // New state
    const ogImageUrl = getOgUrl(typeof window !== 'undefined' ? window.location.origin : '', stats, theme);
    const storyImageUrl = ogImageUrl + '&size=story';

    useEffect(() => {
        if (!showStory && imageLoaded) { // Check both conditions
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#39d353', '#a371f7', '#ffffff']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#39d353', '#a371f7', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [showStory, imageLoaded]); // Add imageLoaded dependency

    if (showStory) {
        return <StoryMode stats={stats} onComplete={() => setShowStory(false)} />;
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white selection:bg-purple-500/30 font-sans pb-10 flex flex-col justify-between animate-in fade-in duration-700">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-green-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6 max-w-2xl w-full flex-1 flex flex-col">

                {/* Navigation */}
                <header className="flex justify-between items-center mb-6">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-medium text-sm">Create New</span>
                    </Link>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center w-full space-y-8">

                    <div className="text-center space-y-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs font-medium`}>
                            <span className="text-purple-300">🎉 Your 2025 Review is Ready</span>
                        </div>
                    </div>

                    {/* The Card - Mobile Optimized */}
                    <div className="w-full relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-green-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
                        <TiltCard>
                            {/* Responsive Image: w-full, height-auto to maintain aspect ratio */}
                            <div className="relative w-full aspect-[4/5] flex items-center justify-center bg-[#0d1117] rounded-3xl overflow-hidden shadow-2xl">
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <img
                                    src={ogImageUrl}
                                    alt={`GitHub Wrapped for ${stats.username}`}
                                    className={`w-full h-full object-contain transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    loading="eager"
                                    onLoad={() => setImageLoaded(true)}
                                />
                            </div>
                        </TiltCard>
                    </div>

                    {/* Action Buttons */}
                    <div className={`w-full space-y-4 transition-all duration-700 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <ShareButtons
                            username={stats.username}
                            ogImageUrl={ogImageUrl}
                            commitCount={stats.totalCommits}
                            repoCount={stats.totalPublicRepos}
                        />

                        <a
                            href={storyImageUrl}
                            target="_blank"
                            download="github-wrapped-story.png"
                            className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-sm font-medium transition-all"
                        >
                            📸 Download for Instagram Story (9:16)
                        </a>
                    </div>
                </main>
            </div>

            <footer className="relative z-10 text-center text-gray-500 text-xs py-4">
                Built by <a href="https://jiwans-oza.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Jiwans Oza</a>
            </footer>
        </div>
    );
}
