import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');
        const avatar = searchParams.get('avatar');
        const commits = searchParams.get('commits') || '0';
        const days = searchParams.get('days') || '0';
        const streak = searchParams.get('streak') || '0';
        const currentStreak = searchParams.get('currentStreak') || '0';
        const topLang = searchParams.get('lang') || 'N/A';
        const month = searchParams.get('month') || 'N/A';
        const prs = searchParams.get('prs') || '0';
        const style = searchParams.get('style') || 'Night Owl 🌙';
        const roast = searchParams.get('roast') || 'You code like a machine.';
        const repo = searchParams.get('repo') || '';
        const repoStars = searchParams.get('repoStars') || '0';

        let languages: any[] = [];
        try {
            const langParam = searchParams.get('languages');
            if (langParam) languages = JSON.parse(langParam);
        } catch (e) {
            console.error('Failed to parse languages', e);
        }

        // Static Theme (Cyberpunk/Dark)
        const t = {
            bg: '#0d1117',
            bgGradient: 'radial-gradient(circle at 50% 0%, #1f2937 0%, #0d1117 70%)',
            cardBg: 'rgba(22, 27, 34, 0.6)',
            accent1: '#39d353', // Green
            accent2: '#a371f7', // Purple
            textMain: '#ffffff',
            textSub: '#8b949e',
            orb1: 'rgba(57, 211, 83, 0.15)',
            orb2: 'rgba(163, 113, 247, 0.15)',
        };

        if (!username) {
            return new Response('Missing username', { status: 400 });
        }

        const options: any = {
            width: 1080,
            height: 1350,
        };

        // Helper for safe flex containers
        const flexCol = { display: 'flex', flexDirection: 'column' } as const;
        const flexRow = { display: 'flex', flexDirection: 'row' } as const;

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: t.bg,
                        backgroundImage: t.bgGradient,
                        color: t.textMain,
                        fontFamily: 'sans-serif',
                        position: 'relative',
                    }}
                >
                    {/* Background Orbs */}
                    <div style={{ display: 'flex', position: 'absolute', top: '-15%', left: '-15%', width: '900px', height: '900px', background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)`, opacity: 0.6 }}></div>
                    <div style={{ display: 'flex', position: 'absolute', bottom: '-15%', right: '-15%', width: '900px', height: '900px', background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`, opacity: 0.6 }}></div>

                    {/* Card Container */}
                    <div style={{
                        display: 'flex', // STRICT FLEX
                        flexDirection: 'column', // STRICT FLEX
                        width: '940px',
                        height: '1180px',
                        backgroundColor: t.cardBg,
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '48px',
                        padding: '60px',
                        boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)',
                    }}>
                        {/* Header with Avatar */}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {avatar && <img src={avatar} width="100" height="100" style={{ borderRadius: '50%', border: '4px solid #fff', marginRight: '24px' }} />}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', fontSize: 60, fontWeight: 'bold', lineHeight: 1.1, color: t.textMain }}>@{username}</div>
                                    <div style={{ display: 'flex', fontSize: 24, color: t.textSub }}>Wrapped 2025</div>
                                </div>
                            </div>

                            {/* Roast Badge */}
                            <div style={{
                                display: 'flex',
                                padding: '10px 24px',
                                borderRadius: '100px',
                                backgroundColor: 'rgba(57, 211, 83, 0.1)',
                                border: `1px solid ${t.accent1}`,
                                color: t.accent1,
                                fontSize: 24,
                                fontWeight: 'bold',
                            }}>
                                {style}
                            </div>
                        </div>

                        {/* Roast Section (Viral) */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '24px',
                            padding: '40px',
                            marginBottom: '40px',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <div style={{ display: 'flex', fontSize: 20, color: t.accent2, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '16px' }}>AI Analysis</div>
                            <div style={{ display: 'flex', fontSize: 40, fontStyle: 'italic', color: t.textMain, lineHeight: 1.3 }}>"{roast}"</div>
                        </div>

                        {/* Main Stats Row */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', fontSize: 110, fontWeight: 'bold', lineHeight: 1, color: t.textMain }}>
                                    {commits}
                                </div>
                                <div style={{ display: 'flex', fontSize: 32, color: t.textSub, marginTop: '8px' }}>
                                    Total Commits
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', fontSize: 110, fontWeight: 'bold', lineHeight: 1, color: t.accent1 }}>
                                    {days}
                                </div>
                                <div style={{ display: 'flex', fontSize: 32, color: t.textSub, marginTop: '8px' }}>
                                    Days Active
                                </div>
                            </div>
                        </div>

                        {/* Secondary Stats Grid */}
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '40px', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', fontSize: 20, color: t.accent2, marginBottom: '8px' }}>LONGEST STREAK</div>
                                <div style={{ display: 'flex', fontSize: 56, fontWeight: 'bold', color: t.textMain }}>{streak}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', fontSize: 20, color: t.accent1, marginBottom: '8px' }}>PRs MERGED</div>
                                <div style={{ display: 'flex', fontSize: 56, fontWeight: 'bold', color: t.textMain }}>{prs}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1.5, backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', fontSize: 20, color: t.textSub, marginBottom: '16px' }}>TOP LANGUAGES</div>
                                {/* Visualize Bar */}
                                <div style={{ display: 'flex', width: '100%', height: '16px', borderRadius: '100px', overflow: 'hidden', marginBottom: '12px' }}>
                                    {languages.map((l, i) => (
                                        <div key={i} style={{ display: 'flex', height: '100%', width: `${l.percent}%`, backgroundColor: l.color }} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {languages.slice(0, 3).map((l, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: t.textSub }}>
                                            <div style={{ display: 'flex', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: l.color, marginRight: '8px' }} />
                                            {l.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Project Spotlight Footer */}
                        {repo && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: '30px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', fontSize: 18, color: t.accent1, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Project Spotlight</div>
                                    <div style={{ display: 'flex', fontSize: 36, fontWeight: 'bold', color: t.textMain }}>{repo}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', fontSize: 48, color: '#eab308' }}>★</div>
                                    <div style={{ display: 'flex', fontSize: 48, fontWeight: 'bold', color: t.textMain }}>{repoStars}</div>
                                </div>
                            </div>
                        )}
                        {/* Credits */}
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 'auto', paddingTop: '24px' }}>
                            <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                Built by @JiwansOza
                            </div>
                        </div>
                    </div>
                </div>
            ),
            options
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image: ${e.message}`, {
            status: 500,
        });
    }
}
