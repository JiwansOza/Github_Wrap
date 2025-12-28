import { Github } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white">
            <div className="relative">
                {/* Pulsing Glow */}
                <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full animate-pulse"></div>

                {/* Icon */}
                <div className="relative w-24 h-24 bg-[#161b22] border-2 border-green-500/50 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(57,211,83,0.3)]">
                    <Github className="w-12 h-12 text-green-400" />
                </div>
            </div>

            <div className="mt-8 text-center space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-500 animate-pulse">
                    Crunching the Numbers...
                </h2>
                <div className="flex flex-col gap-1 text-gray-500 text-sm">
                    <p>Analyzing commits</p>
                    <p className="delay-100">Fetching contribution graph</p>
                    <p className="delay-200">Generating your persona</p>
                </div>
            </div>
        </div>
    );
}
