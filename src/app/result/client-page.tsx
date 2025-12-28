import confetti from 'canvas-confetti';
import { useEffect } from 'react';
// ... other imports

// ... getOgUrl helper

export default function ClientPage({ stats }: { stats: any }) {
    // ...
    const [showStory, setShowStory] = useState(true);
    const ogImageUrl = getOgUrl(typeof window !== 'undefined' ? window.location.origin : '', stats, theme);
    const storyImageUrl = ogImageUrl + '&size=story';

    useEffect(() => {
        if (!showStory) {
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
    }, [showStory]);

    if (showStory) {
        return <StoryMode stats={stats} onComplete={() => setShowStory(false)} />;
    }

    // ... render ...

    {/* Action Buttons */ }
    <div className="w-full space-y-4">
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
                </main >
            </div >

        <footer className="relative z-10 text-center text-gray-500 text-xs py-4">
            Built by <a href="https://jiwans-oza.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Jiwans Oza</a>
        </footer>
        </div >
    );
}
