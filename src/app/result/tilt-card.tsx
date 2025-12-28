'use client';

import { useRef, useState, MouseEvent, useCallback } from 'react';

export default function TiltCard({ children }: { children: React.ReactNode }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;

        const centerX = box.width / 2;
        const centerY = box.height / 2;

        const rotateX = (y - centerY) / 20; // Divide by 20 to constrain tilt
        const rotateY = (centerX - x) / 20;

        setRotate({ x: rotateX, y: rotateY });
    }, []);

    const onMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
        setOpacity(0);
    };

    const onMouseEnter = () => {
        setOpacity(1);
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}
            className="relative transition-all duration-200 ease-out cursor-pointer"
        >
            <div
                style={{
                    transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                    transition: 'all 0.1s ease',
                }}
                className="rounded-[1.5rem] overflow-hidden shadow-2xl bg-[#161b22] relative"
            >
                {children}

                {/* Gloss/Reflect Effect */}
                <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    style={{
                        background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.3) 45%, rgba(255, 255, 255, 0.0) 50%)`,
                        transform: `translateX(${rotate.y * 5}%) translateY(${rotate.x * 5}%)`,
                        opacity: opacity,
                        transition: 'opacity 0.3s ease'
                    }}
                />
            </div>
        </div>
    );
}
