'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface StoryModeProps {
    stats: any;
    onComplete: () => void;
}

export default function StoryMode({ stats, onComplete }: StoryModeProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        // Slide 1: Intro
        {
            bg: "bg-gradient-to-br from-indigo-900 to-black",
            content: (
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="text-6xl mb-4"
                    >
                        👀
                    </motion.div>
                    <h2 className="text-3xl font-bold">2025 flew by...</h2>
                    <p className="text-xl text-gray-300">Let's see what you built.</p>
                </div>
            )
        },
        // Slide 2: Commits
        {
            bg: "bg-[#0d1117]",
            content: (
                <div className="text-center space-y-4">
                    <div className="text-emerald-400 text-lg font-bold uppercase tracking-widest">Productivity</div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-8xl font-black text-white"
                    >
                        {stats.totalCommits}
                    </motion.div>
                    <p className="text-2xl text-gray-400">Total Commits</p>
                </div>
            )
        },
        // Slide 3: Active Days
        {
            bg: "bg-[#161b22]",
            content: (
                <div className="text-center space-y-6">
                    <div className="text-blue-400 text-lg font-bold uppercase tracking-widest">Consistency</div>
                    <div className="text-7xl font-bold text-white">
                        {stats.daysActive} <span className="text-3xl text-gray-500">days</span>
                    </div>
                    <p className="text-xl text-gray-300">You showed up.</p>

                    <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-sm text-gray-400 uppercase mb-2">Longest Streak</div>
                        <div className="text-4xl font-mono text-orange-400">🔥 {stats.longestStreak} days</div>
                    </div>
                </div>
            )
        },
        // Slide 4: Top Language
        {
            bg: "bg-black",
            content: (
                <div className="text-center space-y-6">
                    <div className="text-purple-400 text-lg font-bold uppercase tracking-widest">Your Main Tool</div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block px-8 py-4 rounded-full bg-white/10 text-4xl font-bold border border-white/20"
                    >
                        {stats.topLanguage}
                    </motion.div>
                    <p className="text-gray-400">It's clearly your favorite.</p>
                </div>
            )
        },
        // Slide 5: The Roast (Personality)
        {
            bg: "bg-gradient-to-br from-red-900 via-black to-black",
            content: (
                <div className="text-center max-w-md mx-auto space-y-8 px-4">
                    <div className="text-red-500 text-lg font-bold uppercase tracking-widest">The Vibe Check</div>

                    <h3 className="text-3xl font-bold text-white">
                        "{stats.codingStyle}"
                    </h3>

                    <div className="relative">
                        <span className="text-6xl absolute -top-4 -left-2 opacity-20">"</span>
                        <p className="text-2xl font-light italic text-gray-300 leading-relaxed">
                            {stats.roast}
                        </p>
                        <span className="text-6xl absolute -bottom-8 -right-2 opacity-20">"</span>
                    </div>
                </div>
            )
        }
    ];

    // Auto-advance
    useEffect(() => {
        const timer = setTimeout(() => {
            handleNext();
        }, 3500); // 3.5s per slide
        return () => clearTimeout(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 w-full p-2 z-20 flex gap-2">
                {slides.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: idx === currentIndex ? "100%" : idx < currentIndex ? "100%" : "0%" }}
                            transition={{ duration: idx === currentIndex ? 3.5 : 0, ease: "linear" }}
                            className="h-full bg-white"
                        />
                    </div>
                ))}
            </div>

            {/* Skip Button */}
            <button
                onClick={onComplete}
                className="absolute top-6 right-4 z-20 p-2 text-white/50 hover:text-white"
            >
                <X size={24} />
            </button>

            {/* Content Area */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className={`flex-1 flex items-center justify-center ${slides[currentIndex].bg}`}
                    onClick={handleNext}
                >
                    {slides[currentIndex].content}
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 w-full text-center text-xs text-white/30 uppercase tracking-widest pointer-events-none">
                Tap to continue
            </div>
        </div>
    );
}
