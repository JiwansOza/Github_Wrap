'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
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
    const [imageLoaded, setImageLoaded] = useState(false);

    // Default to Story Mode (9:16) - Optimized for modern sharing (IG, TikTok, X, LinkedIn Mobile)
    const baseUrl = getOgUrl(typeof window !== 'undefined' ? window.location.origin : '', stats, theme);
    const currentImageUrl = `${baseUrl}&size=story`;

    useEffect(() => {
        if (!showStory && imageLoaded) {
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
    }, [showStory, imageLoaded]);

    const handleShare = async () => {
        // Haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My GitHub Wrapped 2025',
                    text: `Check out my GitHub Wrapped! 🚀\n${stats.totalCommits} Commits, ${stats.totalPublicRepos} Repos.`,
                    url: window.location.href, // Sharing the page link is more reliable than sharing the image blob directly across all platforms
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback for desktop: Copy link
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDownload = async () => {
        // Haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);

        try {
            const response = await fetch(currentImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `github-wrapped-${stats.username}-2025.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed", error);
            window.open(currentImageUrl, '_blank');
        }
    };

    if (showStory) {
        return <StoryMode stats={stats} onComplete={() => setShowStory(false)} />;
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white selection:bg-purple-500/30 font-sans pb-48 flex flex-col justify-between animate-in fade-in duration-700">
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

                    {/* Image Preview Area */}
                    <div className="w-full relative group flex justify-center">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-green-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>

                        {/* Fixed 9:16 Aspect Ratio */}
                        <div className="relative bg-[#0d1117] rounded-3xl overflow-hidden shadow-2xl w-full max-w-[340px] aspect-[9/16]">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                                </div>
                            )}
                            <img
                                src={currentImageUrl}
                                alt={`GitHub Wrapped for ${stats.username}`}
                                className={`w-full h-full object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                loading="eager"
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>
                    </div>

                </main>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className={`fixed bottom-0 left-0 w-full z-50 px-4 py-4 pb-8 bg-[#0d1117]/90 backdrop-blur-xl border-t border-white/10 transition-transform duration-700 ${imageLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="container mx-auto max-w-sm flex flex-col gap-3">
                    <div className="flex gap-3 h-14">
                        {/* Primary: Save Image */}
                        <button
                            onClick={handleDownload}
                            className="flex-[2] flex items-center justify-center gap-2 bg-white text-black font-bold text-lg rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-lg shadow-white/10"
                        >
                            <Download size={22} className="stroke-[2.5]" />
                            <span>Save Image</span>
                        </button>

                        {/* Secondary: Share */}
                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white font-medium text-lg rounded-2xl border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
                        >
                            <Share2 size={22} />
                            <span>Share</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                           
                        </p>
                    </div>
                </div>
            </div>

            {/* Hidden Footer (Signature built into image, but keeping text for accessibility if needed) */}
            <div className="h-0 overflow-hidden">
                Built by Jiwans Oza
            </div>
        </div>
    );
}
