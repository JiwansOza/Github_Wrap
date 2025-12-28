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
        const followers = searchParams.get('followers') || '0';
        const peakDay = searchParams.get('peakDay') || 'DAY';
        const velocity = searchParams.get('velocity') || '0';
        const polyglot = searchParams.get('polyglot') || '0';

        let languages: any[] = [];
        let activity: any = { morning: 0, daytime: 0, evening: 0, night: 0 };
        try {
            const langParam = searchParams.get('languages');
            if (langParam) languages = JSON.parse(langParam);
            const actParam = searchParams.get('activity');
            if (actParam) activity = JSON.parse(actParam);
        } catch (e) {
            console.error('Failed to parse data', e);
        }

        // Calculate max activity for bar scaling
        const maxActivity = Math.max(activity.morning, activity.daytime, activity.evening, activity.night) || 1;

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

        const size = searchParams.get('size');
        const options: any = {
            width: 1080,
            height: size === 'story' ? 1920 : 1350,
        };

        // Helper for safe flex containers
        const flexCol = { display: 'flex', flexDirection: 'column' } as const;
        const flexRow = { display: 'flex', flexDirection: 'row' } as const;

        // Helper to map GitHub language names to Devicon URLs
        const getIcon = (lang: string) => {
            const map: any = {
                'JavaScript': 'javascript', 'TypeScript': 'typescript', 'Python': 'python',
                'Java': 'java', 'C++': 'cplusplus', 'C': 'c', 'C#': 'csharp',
                'Go': 'go', 'Rust': 'rust', 'PHP': 'php', 'Ruby': 'ruby',
                'Swift': 'swift', 'Kotlin': 'kotlin', 'Dart': 'dart',
                'HTML': 'html5', 'CSS': 'css3', 'Shell': 'bash', 'Dockerfile': 'docker',
                'Vue': 'vuejs', 'React': 'react', 'Svelte': 'svelte', 'Angular': 'angularjs'
            };
            const key = map[lang] || lang.toLowerCase();
            return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
        };

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
                        {/* Header with Avatar and Member Since */}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {avatar && <img src={avatar} width="100" height="100" style={{ borderRadius: '50%', border: '4px solid #fff', marginRight: '24px' }} />}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', fontSize: 60, fontWeight: 'bold', lineHeight: 1.1, color: t.textMain }}>@{username}</div>
                                    <div style={{ display: 'flex', fontSize: 20, color: t.textSub, marginTop: '4px' }}>Your GitHub activity at a glance</div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: 24, color: t.textSub, marginTop: '8px' }}>
                                        Since {new Date(searchParams.get('created') || Date.now()).getFullYear()} <span style={{ margin: '0 10px' }}>•</span> {followers} Followers
                                    </div>
                                </div>
                            </div>

                            {/* Roast Badge */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{
                                    display: 'flex',
                                    padding: '10px 24px',
                                    borderRadius: '100px',
                                    backgroundColor: 'rgba(57, 211, 83, 0.1)',
                                    border: `1px solid ${t.accent1}`,
                                    color: t.accent1,
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    marginBottom: '8px'
                                }}>
                                    {style}
                                </div>
                                <div style={{ display: 'flex', fontSize: 14, color: t.textSub }}>
                                    {style.includes('Night') ? 'Most commits late at night' :
                                        style.includes('Morning') || style.includes('Early') ? 'Most commits before 10 AM' :
                                            style.includes('Weekend') ? 'Most active on Sat/Sun' :
                                                style.includes('Burner') ? 'Burning the midnight oil' :
                                                    'Consistent daily activity'}
                                </div>
                            </div>
                        </div>

                        {/* Roast Section */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '24px',
                            padding: '24px',
                            marginBottom: '20px',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', fontSize: 20, color: t.accent2, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>AI Analysis</div>
                                    <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>{searchParams.get('starred') || '0'} Stars Given</div>
                                </div>
                                <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Based on your repositories & activity</div>
                            </div>
                            <div style={{ display: 'flex', fontSize: 40, fontStyle: 'italic', color: t.textMain, lineHeight: 1.3 }}>"{roast}"</div>
                        </div>

                        {/* Main Stats Row - Grouped */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderRadius: '24px',
                            padding: '24px',
                            marginBottom: '24px',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', fontSize: 80, fontWeight: 'bold', lineHeight: 1, color: t.textMain }}>
                                    {commits}
                                </div>
                                <div style={{ display: 'flex', fontSize: 24, color: t.textSub, marginTop: '8px' }}>
                                    Total Commits
                                </div>
                            </div>
                            <div style={{ display: 'flex', width: '1px', height: '80px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', fontSize: 80, fontWeight: 'bold', lineHeight: 1, color: t.accent1 }}>
                                    {days}
                                </div>
                                <div style={{ display: 'flex', fontSize: 24, color: t.textSub, marginTop: '8px' }}>
                                    Days Active
                                </div>
                            </div>
                        </div>

                        {/* Secondary Stats Grid */}
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px', gap: '20px' }}>
                            {/* Pulse Graph (Daily Rhythm) */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1.2, backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', fontSize: 20, color: t.accent2, marginBottom: '4px' }}>DAILY RHYTHM</div>
                                <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 'auto' }}>
                                    Most active: {
                                        activity.morning > activity.daytime && activity.morning > activity.evening && activity.morning > activity.night ? 'Morning' :
                                            activity.daytime > activity.evening && activity.daytime > activity.night ? 'Daytime' :
                                                activity.evening > activity.night ? 'Evening' : 'Night'
                                    }
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '60px', width: '100%', gap: '8px' }}>
                                    {[
                                        { label: 'M', val: activity.morning, color: '#fcd34d' }, // Morning
                                        { label: 'D', val: activity.daytime, color: '#39d353' }, // Day
                                        { label: 'E', val: activity.evening, color: '#a371f7' }, // Evening
                                        { label: 'N', val: activity.night, color: '#38bdf8' }    // Night
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                                            <div style={{
                                                display: 'flex',
                                                width: '100%',
                                                height: `${Math.max((item.val / maxActivity) * 100, 10)}%`,
                                                backgroundColor: item.color,
                                                borderRadius: '4px 4px 0 0',
                                                opacity: 0.8
                                            }} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '8px', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                                    <span>Mor</span><span>Day</span><span>Eve</span><span>Nig</span>
                                </div>
                            </div>




                            {/* Peak Day (Replaces Velocity for this request) */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 0.8, backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', fontSize: 20, color: t.accent1, marginBottom: '8px' }}>MOST ACTIVE DAY</div>
                                <div style={{ display: 'flex', fontSize: 40, fontWeight: 'bold', color: t.textMain, lineHeight: 1, textTransform: 'uppercase' }}>{peakDay.slice(0, 3)}</div>
                                <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>You commit the most on {peakDay}s.</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1.5, backgroundColor: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', fontSize: 20, color: t.textSub }}>TOP LANGUAGES</div>
                                    <div style={{ display: 'flex', fontSize: 16, color: t.accent2, fontWeight: 'bold' }}>Polyglot: {polyglot}</div>
                                </div>
                                <div style={{ display: 'flex', width: '100%', height: '16px', borderRadius: '100px', overflow: 'hidden', marginBottom: '16px' }}>
                                    {languages.map((l, i) => (
                                        <div key={i} style={{ display: 'flex', height: '100%', width: `${l.percent}%`, backgroundColor: l.color }} />
                                    ))}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {languages.slice(0, 5).map((l, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '100px' }}>
                                            <img
                                                src={getIcon(l.name)}
                                                width="32"
                                                height="32"
                                                style={{ marginRight: '10px' }}
                                            />
                                            <div style={{ display: 'flex', fontSize: 20, fontWeight: 'bold', color: t.textMain }}>{Math.round(l.percent)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Project Spotlight Footer (Enhanced) */}
                        {repo && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                padding: '24px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', fontSize: 18, color: t.accent1, marginBottom: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Top Project</div>
                                        <div style={{ display: 'flex', fontSize: 40, fontWeight: 'bold', color: t.textMain }}>{repo}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ display: 'flex', fontSize: 40, color: '#eab308' }}>★</div>
                                        <div style={{ display: 'flex', fontSize: 40, fontWeight: 'bold', color: t.textMain }}>{repoStars}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', fontSize: 24, color: t.textSub, lineHeight: 1.4 }}>
                                    Built with <span style={{ color: t.textMain, fontWeight: 'bold', marginLeft: '6px' }}>{topLang}</span>.
                                </div>
                            </div>
                        )}

                    </div>
                    {/* Credits */}
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '30px' }}>
                        <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Built by @jiwansOza · GitHub Wrapped
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
