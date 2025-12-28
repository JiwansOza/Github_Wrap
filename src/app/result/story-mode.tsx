'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, RotateCcw } from 'lucide-react';

interface StoryModeProps {
    stats: any;
    onComplete: () => void;
}

export default function StoryMode({ stats, onComplete }: StoryModeProps) {
    const [index, setIndex] = useState(0);
    const [exitX, setExitX] = useState(0);

    const slides = [
        // Card 1: Intro
        {
            color: "from-purple-600 to-blue-600",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="text-8xl mb-6">👀</div>
                    <h2 className="text-4xl font-black mb-4">Ready to swipe?</h2>
                    <p className="text-xl opacity-90">Your 2025 year in code is waiting.</p>
                </div>
            )
        },
        // Card 2: Commits
        {
            color: "from-emerald-500 to-teal-700",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <h3 className="text-2xl uppercase tracking-widest opacity-80 mb-8">Work Ethic</h3>
                    <div className="text-8xl font-black mb-2">{stats.totalCommits}</div>
                    <div className="text-3xl font-bold opacity-90">Total Commits</div>
                </div>
            )
        },
        // Card 3: Active Days
        {
            color: "from-orange-500 to-red-600",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <h3 className="text-2xl uppercase tracking-widest opacity-80 mb-8">Consistency</h3>
                    <div className="text-8xl font-black mb-2">{stats.daysActive}</div>
                    <div className="text-3xl font-bold opacity-90">Days Active</div>
                    <div className="mt-8 bg-black/20 px-6 py-3 rounded-xl backdrop-blur-md">
                        <div className="text-sm uppercase opacity-70">Longest Streak</div>
                        <div className="text-3xl font-mono">🔥 {stats.longestStreak}</div>
                    </div>
                </div>
            )
        },
        // Card 4: Top Language
        {
            color: "from-blue-600 to-indigo-800",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <h3 className="text-2xl uppercase tracking-widest opacity-80 mb-8">Main Character</h3>
                    <div className="text-6xl font-black mb-6 px-8 py-4 bg-white/10 rounded-3xl border border-white/20">
                        {stats.topLanguage}
                    </div>
                    <p className="text-xl opacity-80">You typed this... a lot.</p>
                </div>
            )
        },
        // Card 5: Community & Rhythm (New)
        {
            color: "from-fuchsia-600 to-purple-900",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8">
                    <div>
                        <h3 className="text-xl uppercase tracking-widest opacity-70 mb-2">Community</h3>
                        <div className="text-7xl font-black">{stats.followers}</div>
                        <div className="text-lg opacity-80">Followers</div>
                    </div>

                    <div className="w-full h-px bg-white/20" />

                    <div>
                        <h3 className="text-lg uppercase tracking-widest opacity-70 mb-2">Peak Productivity</h3>
                        <div className="text-4xl font-bold text-yellow-300">{stats.mostActiveDay}s</div>
                        <div className="text-sm opacity-80 mt-1">are your power days</div>
                    </div>
                </div>
            )
        },
        // Card 6: The Roast
        {
            color: "from-pink-600 to-rose-900",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <h3 className="text-2xl uppercase tracking-widest opacity-80 mb-8">Vibe Check</h3>
                    <div className="text-4xl font-black mb-8">"{stats.codingStyle}"</div>
                    <div className="text-xl italic opacity-90 leading-relaxed max-w-xs">
                        {stats.roast}
                    </div>
                </div>
            )
        },
        // Card 6: Reveal
        {
            color: "from-gray-800 to-black",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="text-8xl mb-6">🎁</div>
                    <h2 className="text-3xl font-bold mb-4">Your Card is Ready</h2>
                    <p className="text-lg opacity-70">Swipe one last time to reveal.</p>
                </div>
            )
        }
    ];

    const currentSlide = slides[index];

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x > 100) {
            setExitX(200);
            setTimeout(() => nextCard(), 200);
        } else if (info.offset.x < -100) {
            setExitX(-200);
            setTimeout(() => nextCard(), 200);
        }
    };

    const nextCard = () => {
        if (index === slides.length - 1) {
            onComplete();
        } else {
            setIndex(index + 1);
            setExitX(0);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Background blur/tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90 z-0" />

            <div className="relative z-10 w-full max-w-md h-[70vh] flex items-center justify-center">
                <AnimatePresence mode='wait'>
                    <Card
                        key={index}
                        data={currentSlide}
                        onDragEnd={handleDragEnd}
                        index={index}
                        total={slides.length}
                    />
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 z-20 flex flex-col items-center gap-4">
                <p className="text-white/40 uppercase tracking-widest text-sm animate-pulse">
                    Swipe Left or Right
                </p>
                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <div key={i} className={`h-2 w-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/20'}`} />
                    ))}
                </div>
            </div>

            <button
                onClick={onComplete}
                className="absolute top-6 right-6 z-30 p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20 transition-all"
            >
                <X size={24} />
            </button>
        </div>
    );
}

function Card({ data, onDragEnd, index, total }: any) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            className={`absolute w-[90%] md:w-96 aspect-[3/4] rounded-3xl shadow-2xl bg-gradient-to-br ${data.color} text-white cursor-grab active:cursor-grabbing border border-white/10`}
        >
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-3xl pointer-events-none" />

            {data.content}

            <div className="absolute top-4 left-6 text-xs font-bold opacity-50 border border-white/30 px-2 py-1 rounded-full">
                {index + 1} / {total}
            </div>
        </motion.div>
    );
}
