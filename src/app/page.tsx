"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, Zap, Share2, Code } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    router.push(`/result?username=${username}`);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center bg-[#0d1117] text-white overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-4 backdrop-blur-md">
          <span>✨ 2025 Edition is Here</span>
        </div>

        <div className="bg-white/5 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(163,113,247,0.2)] border border-white/10 backdrop-blur-md">
          <Github size={48} className="text-white" />
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
          GitHub <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39d353] via-[#26a641] to-[#0e4429] drop-shadow-[0_0_30px_rgba(57,211,83,0.3)]">
            Wrapped
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover your coding personality, visualize your impact, and share your 2025 year in code.
        </p>

        <div className="pt-8 w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 group">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                <Github size={20} />
              </div>
              <input
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter GitHub Username..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#161b22] border border-gray-700/50 focus:border-[#a371f7] focus:ring-2 focus:ring-[#a371f7]/20 transition-all outline-none text-white placeholder-gray-600 text-lg shadow-xl"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#39d353] to-[#2ea043] text-white font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(57,211,83,0.3)] flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(57,211,83,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : <>Generate My Wrapped <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>

      {/* Features / Social Proof */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left relative z-20">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <div className="text-purple-400 mb-6 bg-purple-500/10 w-fit p-3 rounded-xl"><Zap size={32} /></div>
          <h3 className="text-xl font-bold mb-3">Instant Analysis</h3>
          <p className="text-gray-400 leading-relaxed">We fetch your stats in real-time using GitHub's powerful GraphQL API. No login or permissions required.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <div className="text-green-400 mb-6 bg-green-500/10 w-fit p-3 rounded-xl"><Share2 size={32} /></div>
          <h3 className="text-xl font-bold mb-3">Share Everywhere</h3>
          <p className="text-gray-400 leading-relaxed">optimized for Twitter, LinkedIn, and Instagram. Get a beautiful, generated card to show off your streak.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <div className="text-blue-400 mb-6 bg-blue-500/10 w-fit p-3 rounded-xl"><Code size={32} /></div>
          <h3 className="text-xl font-bold mb-3">Coding Persona</h3>
          <p className="text-gray-400 leading-relaxed">Are you a Night Owl or an Early Bird? We analyze your commit timestamps to find your true coding style.</p>
        </div>
      </div>

      <footer className="mt-20 text-gray-500 text-sm relative z-20">
        <p>Built for Developers • Open Source</p>
      </footer>

    </div>
  );
}
