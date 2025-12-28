'use client';

import { useState } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TiltCard from './tilt-card';
import ShareButtons from './share-buttons';

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
    });
    return `/api/og?${params.toString()}`;
}

export default function ClientPage({ stats }: { stats: any }) {
    const [theme, setTheme] = useState('cyberpunk');
    const ogImageUrl = getOgUrl(typeof window !== 'undefined' ? window.location.origin : '', stats, theme);

    const themes = [
        { id: 'cyberpunk', name: 'Cyberpunk', rounded: 'from-green-400 to-purple-500' },
        { id: 'sunset', name: 'Sunset', rounded: 'from-amber-500 to-pink-500' },
        { id: 'midnight', name: 'Midnight', rounded: 'from-sky-500 to-indigo-500' },
        { id: 'minimal', name: 'Minimal', rounded: 'from-gray-100 to-gray-500' },
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-white selection:bg-purple-500/30 font-sans pb-20">
            {/* Background Glows (Dynamic based on Theme?) - keeping generic for now or we can switch them too */}
            <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">

                {/* Navigation */}
                <header className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium">Create New</span>
                    </Link>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

                    {/* Left Column: Phone/Poster Preview */}
                    <div className="w-full max-w-md mx-auto lg:mx-0 relative space-y-6">

                        <div className="relative group">
                            {/* Tilt Effect Background */}
                            <div className={`absolute -inset-1 bg-gradient-to-tr ${themes.find(t => t.id === theme)?.rounded} rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse`}></div>
                            <TiltCard>
                                <img
                                    src={ogImageUrl}
                                    alt={`GitHub Wrapped for ${stats.username}`}
                                    className="w-full h-full object-contain animate-in fade-in zoom-in duration-700 pointer-events-none"
                                />
                            </TiltCard>
                        </div>

                        {/* Theme Switcher */}
                        <div className="flex justify-center gap-3 p-2 bg-white/5 rounded-2xl backdrop-blur-md">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.rounded} ${theme === t.id ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'} transition-all`}
                                    title={t.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Actions & Summary */}
                    <div className="w-full max-w-xl text-center lg:text-left space-y-8">

                        <div className="space-y-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 text-sm font-medium`}>
                                <span className="text-purple-300">🎉 Your 2025 Review is Ready</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                                <span className="block text-white">GitHub</span>
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themes.find(t => t.id === theme)?.rounded}`}>Wrapped</span>
                            </h1>

                            {/* Roast Section */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group hover:bg-white/10 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Flame size={48} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-center lg:justify-start gap-2">
                                    <Flame size={16} className="text-orange-500" /> AI Analysis
                                </h3>
                                <p className="text-xl md:text-2xl font-medium text-gray-200 italic">
                                    "{stats.roast}"
                                </p>
                            </div>

                        </div>

                        {/* Project Spotlight */}
                        {stats.topRepo && stats.topRepo.stars > 0 && (
                            <div className="text-left bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Crown size={80} />
                                </div>
                                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                    <Crown size={20} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Project Spotlight</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{stats.topRepo.name}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{stats.topRepo.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                        <span>{stats.topRepo.stars}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <span>Top Project</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Language Distribution Bar */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Top Languages</h3>
                            <div className="flex h-4 w-full rounded-full overflow-hidden bg-white/5">
                                {stats.languages.map((lang: any) => (
                                    <div
                                        key={lang.name}
                                        style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                                        className="h-full transition-all duration-500 hover:opacity-80"
                                        title={`${lang.name}: ${lang.percent.toFixed(1)}%`}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                                {stats.languages.slice(0, 3).map((lang: any) => (
                                    <div key={lang.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                                        <span className="text-gray-300">{lang.name} <span className="text-gray-500">{Math.round(lang.percent)}%</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mini Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Stars</div>
                                <div className="text-2xl font-bold text-yellow-400">{stats.totalStars}</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Coding Style</div>
                                <div className="text-base font-bold text-white truncate px-2">{stats.codingStyle}</div>
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="pt-4">
                            <ShareButtons
                                username={stats.username}
                                ogImageUrl={ogImageUrl}
                                commitCount={stats.totalCommits}
                                repoCount={stats.totalPublicRepos}
                            />
                        </div>
                    </div>
                </main>

                <footer className="mt-12 text-center text-gray-500 text-sm">
                    Generated with Vercel OG • Built for Developers
                </footer>
            </div>
        </div>
    );
}
