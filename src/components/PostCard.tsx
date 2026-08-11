'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SocialPost, Equipment, PostComment } from '@/types';
import {
  Star, Heart, MessageSquare, Share2, Bookmark,
  CalendarCheck, Crown, ShieldCheck, UserCheck, Send, LogIn
} from 'lucide-react';

interface PostCardProps {
  post: SocialPost;
  onViewEquipment: (equipment: Equipment) => void;
  onBookEquipment: (equipment: Equipment) => void;
}

const RoleBadge = ({ role }: { role: string }) => {
  if (role === 'premium') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
      <Crown className="w-3 h-3 fill-amber-400 text-amber-400" /> VIP
    </span>
  );
  if (role === 'admin') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
      <ShieldCheck className="w-3 h-3 text-red-400" /> ADMIN
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
      <UserCheck className="w-3 h-3 text-blue-400" /> THÀNH VIÊN
    </span>
  );
};

export const PostCard: React.FC<PostCardProps> = ({ post, onViewEquipment, onBookEquipment }) => {
  const { isGuest, currentUser, requestAuth } = useAuth();

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentList, setCommentList] = useState<PostComment[]>(post.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);

  const handleToggleLike = () => {
    if (isGuest) { requestAuth('login'); return; }
    setLiked((prev) => !prev);
    setLikesCount((prev) => liked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) { requestAuth('login'); return; }
    if (!newCommentText.trim()) return;

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      author: currentUser,
      content: newCommentText.trim(),
      createdAt: 'Vừa xong',
      likesCount: 0,
    };
    setCommentList((prev) => [...prev, newComment]);
    setNewCommentText('');
  };

  const handleBookmark = () => {
    if (isGuest) { requestAuth('login'); return; }
    setBookmarked((prev) => !prev);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg hover:border-slate-700/80 transition-all">

      {/* ── Author header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className={`w-11 h-11 rounded-full object-cover border-2 ${
              post.author.role === 'premium' ? 'border-amber-400' :
              post.author.role === 'admin' ? 'border-red-500' : 'border-slate-700'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer transition-colors">
                {post.author.name}
              </h4>
              <RoleBadge role={post.author.role} />
            </div>
            <div className="flex items-center gap-2 text-[11px] mt-0.5 text-slate-400">
              <span className="font-medium">{post.author.roleTitle || 'Thành viên'}</span>
              <span className="text-slate-600">•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {post.rating && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{post.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* ── Post content ────────────────────────────────────────────────── */}
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{post.content}</p>

      {/* ── Images grid ─────────────────────────────────────────────────── */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Review ${i + 1}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80';
              }}
              className="w-full h-40 object-cover rounded-xl border border-slate-800"
            />
          ))}
        </div>
      )}

      {/* ── Tagged equipment card ────────────────────────────────────────── */}
      {post.taggedEquipment && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onViewEquipment(post.taggedEquipment!)}
            >
              <img
                src={post.taggedEquipment.thumbnail}
                alt={post.taggedEquipment.name}
                className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
              />
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Thiết bị được review:
                </span>
                <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 line-clamp-1 transition-colors">
                  {post.taggedEquipment.name}
                </h5>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Giá: <span className="text-amber-400 font-semibold">{post.taggedEquipment.priceRange}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onBookEquipment(post.taggedEquipment!)}
              className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" /> Book Thử Máy (Free)
            </button>
          </div>
        </div>
      )}

      {/* ── Social actions ───────────────────────────────────────────────── */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-5">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setCommentsOpen(!commentsOpen)}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-amber-400/80" />
            <span>{commentList.length}</span>
          </button>

          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
            <Share2 className="w-4 h-4 text-blue-400/80" />
            <span>{post.sharesCount}</span>
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-lg transition-colors ${bookmarked ? 'text-amber-400 bg-amber-500/10' : 'hover:text-amber-400'}`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* ── Comments section ─────────────────────────────────────────────── */}
      {commentsOpen && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
          {commentList.length > 0 ? (
            <div className="space-y-2 text-xs">
              {commentList.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={c.author.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                      <span className="font-bold text-white text-[11px]">{c.author.name}</span>
                      <RoleBadge role={c.author.role} />
                    </div>
                    <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                  </div>
                  <p className="text-slate-300 pl-8">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic text-center py-1">
              Chưa có bình luận. Hãy là người đầu tiên!
            </p>
          )}

          {/* Comment input */}
          {isGuest ? (
            <button
              onClick={() => requestAuth('login')}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" /> Đăng nhập để bình luận
            </button>
          ) : (
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <img src={currentUser.avatar} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" />
              <input
                type="text"
                placeholder={`Bình luận với tư cách ${currentUser.name}...`}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
