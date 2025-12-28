'use client';

import { Download, Share2, Link as LinkIcon, Twitter, Linkedin, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
    username: string;
    ogImageUrl: string;
    repoCount: number;
    commitCount: number;
}

export default function ShareButtons({ username, ogImageUrl, repoCount, commitCount }: ShareButtonsProps) {
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setShareUrl(window.location.href);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(ogImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `github-wrapped-${username}-2025.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed, opening in new tab", error);
            window.open(ogImageUrl, '_blank');
        }
    };

    const shareText = `Check out my 2025 GitHub Wrapped! 🚀\n\n${commitCount} Commits\n${repoCount} Public Repos\n\nGenerate yours:`;

    // Only generate URLs if shareUrl is available (client-side)
    const twitterUrl = shareUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=GitHubWrapped,2025,Developer` : '#';
    const linkedinUrl = shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` : '#';

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-row gap-3 justify-between w-full">
                <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold text-sm sm:text-lg rounded-xl hover:bg-gray-200 hover:scale-105 transition-all shadow-lg"
                >
                    <Download size={20} className="sm:w-6 sm:h-6" />
                    <span>Save Image</span>
                </button>

                <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium text-sm sm:text-lg rounded-xl transition-all"
                >
                    <LinkIcon size={20} className="sm:w-6 sm:h-6" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>

            {shareUrl && (
                <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
                    <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-lg font-bold transition-all hover:scale-105"
                    >
                        <Twitter size={20} className="fill-current" />
                        <span>Share on X</span>
                    </a>
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-bold transition-all hover:scale-105"
                    >
                        <Linkedin size={20} />
                        <span>LinkedIn</span>
                    </a>
                </div>
            )}
        </div>
    );
}
