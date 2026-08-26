'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  Send, 
  Smartphone,
  Globe
} from 'lucide-react';
import { SocialPost } from '@/types';

interface ShareModalProps {
  post: SocialPost;
  onClose: () => void;
}

export default function ShareModal({ post, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const postUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?post=${post.id}#post-${post.id}`
    : `https://gymgear.vn/?post=${post.id}`;

  const shareText = `Xem bài đánh giá thiết bị gym của ${post.author.name} trên GymGear VN: "${post.content.slice(0, 100)}..."`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = postUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `GymGear Review - ${post.author.name}`,
          text: shareText,
          url: postUrl,
        });
        onClose();
      } catch (_) {}
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-400',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'Zalo',
      icon: <MessageCircle className="w-5 h-5 text-sky-400" />,
      bg: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30 text-sky-400',
      url: `https://zalo.me/share?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bg: 'bg-slate-700/20 hover:bg-slate-700/40 border-slate-600 text-slate-200',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5 text-cyan-400" />,
      bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
      url: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" />

      {/* Modal Content */}
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Chia Sẻ Bài Viết</h3>
              <p className="text-xs text-slate-400">Lan toả kinh nghiệm và review thiết bị gym</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Preview Snippet */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
          <img
            src={post.author.avatar || '/default-avatar.svg'}
            alt={post.author.name}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{post.author.name}</p>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>

        {/* Social Share Grid */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2.5">Chia sẻ qua mạng xã hội</label>
          <div className="grid grid-cols-4 gap-2.5">
            {shareLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(onClose, 500)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all cursor-pointer ${item.bg}`}
              >
                {item.icon}
                <span className="text-[11px] font-semibold">{item.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Native Web Share Button (if supported) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>Mở Bảng Chia Sẻ Thiết Bị (iOS / Android)</span>
          </button>
        )}

        {/* Copy Link Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">Hoặc sao chép liên kết</label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={postUrl}
              className="bg-transparent text-xs text-slate-300 flex-1 focus:outline-none truncate font-mono select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
