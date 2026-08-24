'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SocialPost, Equipment, PostComment } from '@/types';
import {
  Star, Heart, MessageSquare, Share2, Bookmark,
  CalendarCheck, Crown, ShieldCheck, UserCheck, Send, LogIn, Loader2, Pin, Trash2, Pencil, RotateCcw, X,
  CornerDownRight, ChevronDown, ChevronUp, Reply
} from 'lucide-react';
import { toggleLike, addComment, fetchCommentsByPost, deletePost, hardDeletePost, restorePost, toggleBookmark, toggleCommentLike } from '@/lib/supabaseDB';
import Link from 'next/link';
import AuthorPreview from './AuthorPreview';

interface PostCardProps {
  post: SocialPost;
  onViewEquipment: (equipment: Equipment) => void;
  onBookEquipment: (equipment: Equipment) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (post: SocialPost) => void;
  onBookmark?: (postId: string, bookmarked: boolean) => void;
  inTrash?: boolean;
  onRestore?: (postId: string) => void;
  onHardDelete?: (postId: string) => void;
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

// ── Comment Modal (TikTok & Facebook-style nested comments popup) ───────────
interface CommentModalProps {
  post: SocialPost;
  commentList: PostComment[];
  commentsLoading: boolean;
  commentsCount: number;
  newCommentText: string;
  commentSubmitting: boolean;
  liked: boolean;
  likesCount: number;
  likeLoading: boolean;
  onClose: () => void;
  onLike: () => void;
  onCommentChange: (v: string) => void;
  onCommentSubmit: (e: React.FormEvent, parentId?: string | null, replyToUser?: string | null) => void;
  currentUserAvatar?: string;
  currentUserName?: string;
  isGuest: boolean;
  requestAuth: (tab?: 'login' | 'register') => void;
  onViewEquipment: (equipment: Equipment) => void;
  onBookEquipment: (equipment: Equipment) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  post, commentList, commentsLoading, commentsCount, newCommentText, commentSubmitting,
  liked, likesCount, likeLoading, onClose, onLike, onCommentChange, onCommentSubmit,
  currentUserAvatar, currentUserName, isGuest, requestAuth, onViewEquipment, onBookEquipment
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    authorName: string;
    rootCommentId: string;
  } | null>(null);

  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Focus input on open
    setTimeout(() => inputRef.current?.focus(), 100);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggleReplies = (rootId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(rootId)) next.delete(rootId);
      else next.add(rootId);
      return next;
    });
  };

  const handleStartReply = (commentId: string, authorName: string, rootCommentId: string) => {
    if (isGuest) {
      requestAuth('login');
      return;
    }
    setReplyingTo({ commentId, authorName, rootCommentId });
    // Tự động mở rộng nhánh câu trả lời
    setExpandedReplies((prev) => new Set(prev).add(rootCommentId));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleToggleLikeComment = (cId: string, initialCount: number, initialLiked?: boolean) => {
    if (isGuest) {
      requestAuth('login');
      return;
    }
    const currentStatus = likedComments[cId] !== undefined ? likedComments[cId] : !!initialLiked;
    const currentCount = commentLikeCounts[cId] !== undefined ? commentLikeCounts[cId] : initialCount;
    const nextStatus = !currentStatus;

    setLikedComments((prev) => ({ ...prev, [cId]: nextStatus }));
    setCommentLikeCounts((prev) => ({ ...prev, [cId]: Math.max(0, currentCount + (nextStatus ? 1 : -1)) }));
    toggleCommentLike(cId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommentSubmit(e, replyingTo?.rootCommentId, replyingTo?.authorName);
    setReplyingTo(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <Link href={`/user/${post.author.id}`} onClick={onClose}>
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className={`w-10 h-10 rounded-full object-cover border-2 cursor-pointer ${
                  post.author.role === 'premium' ? 'border-amber-400' :
                  post.author.role === 'admin' ? 'border-red-500' : 'border-slate-700'
                }`}
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <AuthorPreview userId={post.author.id} onNavigate={onClose} initialName={post.author.name} initialAvatar={post.author.avatar} />
                <RoleBadge role={post.author.role} />
              </div>
              <p className="text-[11px] text-slate-400">{post.createdAt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body: Post Content + Images + Comments */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Post Caption */}
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{post.content}</p>

          {/* Attached Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Review ${i + 1}`}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80'; }}
                  className="w-full aspect-square object-cover rounded-2xl border border-slate-800"
                />
              ))}
            </div>
          )}

          {/* Tagged Equipment Card */}
          {post.taggedEquipment && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors cursor-pointer"
              onClick={() => { onViewEquipment(post.taggedEquipment!); onClose(); }}
            >
              <img src={post.taggedEquipment.thumbnail} className="w-14 h-14 rounded-lg object-cover border border-slate-800 shrink-0" alt="" />
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Thiết bị được review:</span>
                <h5 className="text-xs font-bold text-white line-clamp-1">{post.taggedEquipment.name}</h5>
                <span className="text-[11px] text-amber-400 font-semibold">{post.taggedEquipment.priceRange}</span>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{likesCount} lượt thích</span>
            </div>
            <div>{commentsCount} bình luận</div>
          </div>

          {/* Social Action Bar (Like / Comment / Share) */}
          <div className="flex items-center justify-between py-2 border-y border-slate-800/80 text-xs text-slate-400">
            <button
              onClick={onLike}
              disabled={likeLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                liked ? 'text-rose-500 font-bold bg-rose-500/10' : 'hover:text-rose-400 hover:bg-slate-800'
              } disabled:opacity-60`}
            >
              {likeLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              ) : (
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
              )}
              <span>{liked ? 'Đã thích' : 'Thích'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 text-amber-400 font-semibold bg-amber-500/10 rounded-lg">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Bình luận</span>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `Bài viết của ${post.author.name}`, text: post.content, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép link!');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>Chia sẻ</span>
            </button>
          </div>

          {/* ── Nested Comments List (TikTok / Facebook UI) ─────────────── */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tất cả bình luận ({commentsCount})
              </h4>
              <span className="text-[11px] text-slate-500">Phù hợp nhất</span>
            </div>

            {commentsLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Đang tải bình luận...</span>
              </div>
            ) : commentList.length > 0 ? (
              commentList.map((c) => {
                const isCommentLiked = likedComments[c.id] !== undefined ? likedComments[c.id] : !!c.isLiked;
                const commentLikes = commentLikeCounts[c.id] !== undefined ? commentLikeCounts[c.id] : (c.likesCount || 0);
                const hasReplies = c.replies && c.replies.length > 0;
                const isExpanded = expandedReplies.has(c.id);

                return (
                  <div key={c.id} className="space-y-2 group">
                    {/* Root Comment Item */}
                    <div className="flex gap-3">
                      <Link href={`/user/${c.author.id}`} onClick={onClose}>
                        <img
                          src={c.author.avatar}
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 cursor-pointer border border-slate-700 hover:border-amber-400 transition"
                          alt=""
                        />
                      </Link>

                      <div className="flex-1 space-y-1.5">
                        {/* Bubble */}
                        <div className="bg-slate-950/90 rounded-2xl p-3 text-xs space-y-1 border border-slate-800/70 inline-block w-full">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <AuthorPreview userId={c.author.id} onNavigate={onClose} initialName={c.author.name} initialAvatar={c.author.avatar} />
                              <RoleBadge role={c.author.role} />
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0">{c.createdAt}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed break-words">{c.content}</p>
                        </div>

                        {/* Action buttons (Like & Reply) */}
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pl-2">
                          <button
                            onClick={() => handleToggleLikeComment(c.id, c.likesCount, c.isLiked)}
                            className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                              isCommentLiked ? 'text-rose-500' : 'hover:text-rose-400'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${isCommentLiked ? 'fill-rose-500' : ''}`} />
                            <span>{commentLikes > 0 ? commentLikes : 'Thích'}</span>
                          </button>

                          <button
                            onClick={() => handleStartReply(c.id, c.author.name, c.id)}
                            className="flex items-center gap-1 font-semibold hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Reply className="w-3 h-3" />
                            <span>Trả lời</span>
                          </button>
                        </div>

                        {/* Button toggle replies (TikTok / Facebook style) */}
                        {hasReplies && (
                          <div className="pt-1 pl-2">
                            <button
                              onClick={() => toggleReplies(c.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group/btn"
                            >
                              <span className="w-6 h-[1px] bg-amber-500/50 group-hover/btn:w-8 transition-all" />
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                  <span>Ẩn {c.replies!.length} câu trả lời</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                  <span>Xem {c.replies!.length} câu trả lời</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* ── Nested Replies Thread ── */}
                        {hasReplies && isExpanded && (
                          <div className="border-l-2 border-slate-800/80 ml-3 pl-3.5 space-y-3 pt-2">
                            {c.replies!.map((reply) => {
                              const isReplyLiked = likedComments[reply.id] !== undefined ? likedComments[reply.id] : !!reply.isLiked;
                              const replyLikes = commentLikeCounts[reply.id] !== undefined ? commentLikeCounts[reply.id] : (reply.likesCount || 0);

                              return (
                                <div key={reply.id} className="flex gap-2.5">
                                  <Link href={`/user/${reply.author.id}`} onClick={onClose}>
                                    <img
                                      src={reply.author.avatar}
                                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 cursor-pointer border border-slate-700"
                                      alt=""
                                    />
                                  </Link>

                                  <div className="flex-1 space-y-1">
                                    {/* Reply Bubble */}
                                    <div className="bg-slate-950/70 rounded-2xl p-2.5 text-xs space-y-1 border border-slate-800/50 inline-block w-full">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                          <AuthorPreview userId={reply.author.id} onNavigate={onClose} initialName={reply.author.name} initialAvatar={reply.author.avatar} />
                                          <RoleBadge role={reply.author.role} />
                                        </div>
                                        <span className="text-[10px] text-slate-500 shrink-0">{reply.createdAt}</span>
                                      </div>
                                      <p className="text-slate-200 leading-relaxed break-words">
                                        {reply.replyToUser && (
                                          <span className="text-amber-400 font-semibold mr-1.5 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                            @{reply.replyToUser}
                                          </span>
                                        )}
                                        {reply.content}
                                      </p>
                                    </div>

                                    {/* Reply Actions */}
                                    <div className="flex items-center gap-4 text-[10px] text-slate-400 pl-2">
                                      <button
                                        onClick={() => handleToggleLikeComment(reply.id, reply.likesCount, reply.isLiked)}
                                        className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                                          isReplyLiked ? 'text-rose-500' : 'hover:text-rose-400'
                                        }`}
                                      >
                                        <Heart className={`w-2.5 h-2.5 ${isReplyLiked ? 'fill-rose-500' : ''}`} />
                                        <span>{replyLikes > 0 ? replyLikes : 'Thích'}</span>
                                      </button>

                                      <button
                                        onClick={() => handleStartReply(reply.id, reply.author.name, c.id)}
                                        className="flex items-center gap-1 font-semibold hover:text-amber-400 transition-colors cursor-pointer"
                                      >
                                        <Reply className="w-2.5 h-2.5" />
                                        <span>Trả lời</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[11px] text-slate-500 italic text-center py-6">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            )}
          </div>
        </div>

        {/* Comment input — sticky bottom */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 rounded-b-3xl space-y-2">
          {/* Active Reply Banner */}
          {replyingTo && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400">
              <div className="flex items-center gap-1.5 truncate">
                <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Đang trả lời <strong className="text-white">@{replyingTo.authorName}</strong>
                </span>
              </div>
              <button
                onClick={handleCancelReply}
                className="p-1 hover:bg-amber-500/20 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                title="Hủy trả lời"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isGuest ? (
            <button
              onClick={() => requestAuth('login')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors font-semibold cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" /> Đăng nhập để bình luận
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <img src={currentUserAvatar} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" />
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  replyingTo
                    ? `Trả lời @${replyingTo.authorName}...`
                    : `Bình luận với tư cách ${currentUserName}...`
                }
                value={newCommentText}
                onChange={(e) => onCommentChange(e.target.value)}
                className="flex-1 bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim() || commentSubmitting}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                {commentSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ── PostCard ──────────────────────────────────────────────────────────────────
export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onViewEquipment, 
  onBookEquipment, 
  onDelete,
  onEdit,
  onBookmark,
  inTrash = false,
  onRestore,
  onHardDelete
}) => {
  const { isGuest, currentUser, requestAuth, isAdmin } = useAuth();

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentList, setCommentList] = useState<PostComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [sharesCount, setSharesCount] = useState(post.sharesCount || 0);
  const [reposted, setReposted] = useState(post.isReposted || false);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setLiked(Boolean(post.isLiked));
    setLikesCount(post.likesCount || 0);
    setCommentList(post.comments || []);
    setCommentsCount(post.commentsCount || 0);
    setBookmarked(Boolean(post.isBookmarked));
    setSharesCount(post.sharesCount || 0);
    setReposted(Boolean(post.isReposted));
  }, [post.id, post.isLiked, post.likesCount, post.comments, post.commentsCount, post.isBookmarked]);

  const handleToggleLike = async () => {
    if (inTrash) return;
    if (isGuest) { requestAuth('login'); return; }
    if (likeLoading) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((prev) => wasLiked ? prev - 1 : prev + 1);
    setLikeLoading(true);
    try {
      const result = await toggleLike(post.id, currentUser.id);
      setLiked(result.liked);
      setLikesCount(result.newCount);
    } catch {
      setLiked(wasLiked);
      setLikesCount((prev) => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleToggleComments = async () => {
    if (inTrash) return;
    if (!commentsLoaded) {
      setCommentsOpen(true);
      setCommentsLoading(true);
      const data = await fetchCommentsByPost(post.id);
      if (data) {
        setCommentList(data);
        setCommentsLoaded(true);
        setCommentsLoading(false);
      }
    } else {
      setCommentsOpen(true);
    }
  };

  const handleAddComment = async (
    e: React.FormEvent, 
    parentId?: string | null, 
    replyToUser?: string | null
  ) => {
    e.preventDefault();
    if (isGuest) { requestAuth('login'); return; }
    if (!newCommentText.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    const result = await addComment(post.id, currentUser.id, newCommentText.trim(), parentId, replyToUser);
    if (result) {
      if (parentId) {
        // Nối vào danh sách replies của comment cha
        setCommentList((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return { ...c, replies: [...(c.replies || []), result] };
            }
            return c;
          })
        );
      } else {
        // Comment gốc
        setCommentList((prev) => [...prev, result]);
      }
      setCommentsCount((prev) => prev + 1);
      setNewCommentText('');
    }
    setCommentSubmitting(false);
  };

  const handleBookmark = async () => {
    if (isGuest) { requestAuth('login'); return; }
    const prevState = bookmarked;
    setBookmarked(!bookmarked); // optimistic
    const result = await toggleBookmark(post.id);
    if (result.error) {
      setBookmarked(prevState); // rollback
      if (result.error === 'not_authenticated') {
        requestAuth('login');
      } else {
        alert('Không thể lưu bài viết. Vui lòng chạy file SUPABASE_SETUP.sql trong Supabase Dashboard và thử lại.');
      }
      return;
    }
    setBookmarked(result.bookmarked);
    if (onBookmark) onBookmark(post.id, result.bookmarked);
  };

  const handleDelete = async () => {
    if (window.confirm(inTrash ? 'Bạn có chắc chắn muốn xoá VĨNH VIỄN bài viết này? Hành động này không thể khôi phục.' : 'Bạn có chắc chắn muốn xoá bài viết này không?')) {
      setIsDeleting(true);
      const success = inTrash ? await hardDeletePost(post.id) : await deletePost(post.id);
      setIsDeleting(false);
      if (success) {
        if (inTrash && onHardDelete) onHardDelete(post.id);
        else if (!inTrash && onDelete) onDelete(post.id);
      } else {
        alert('Xoá bài viết thất bại! Vui lòng thử lại sau.');
      }
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    const success = await restorePost(post.id);
    setIsDeleting(false);
    if (success) {
      if (onRestore) onRestore(post.id);
    } else {
      alert('Khôi phục bài viết thất bại! Vui lòng thử lại sau.');
    }
  };

  const handleShare = () => {
    // Toggle repost via API
    (async () => {
      if (isGuest) { requestAuth('login'); return; }
      try {
        const res = await fetch('/api/repost', { method: 'POST', body: JSON.stringify({ postId: post.id }), headers: { 'Content-Type': 'application/json' } });
        const j = await res.json();
        if (j && typeof j.reposted !== 'undefined') {
          setReposted(Boolean(j.reposted));
          setSharesCount(j.count || (sharesCount + (j.reposted ? 1 : -1)));
        } else {
          // fallback to copy link
          if (navigator.share) {
            navigator.share({ title: `Bài viết của ${post.author.name}`, text: post.content, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã sao chép link!');
          }
        }
      } catch (e) {
        console.error(e);
        if (navigator.share) {
          navigator.share({ title: `Bài viết của ${post.author.name}`, text: post.content, url: window.location.href });
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Đã sao chép link!');
        }
      }
    })();
  };

  const isOwner = currentUser && currentUser.id === post.author.id;
  const canDelete = isOwner || isAdmin;
  const canEdit = (isOwner || isAdmin) && !inTrash;

  return (
    <>
      <div id={`post-${post.id}`} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-lg hover:border-slate-700/80 transition-all h-fit">

        {/* ── Post header ────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link href={`/user/${post.author.id}`} className="shrink-0">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 cursor-pointer hover:ring-2 hover:ring-amber-500/50 transition-all ${
                  post.author.role === 'premium' ? 'border-amber-400' :
                  post.author.role === 'admin' ? 'border-red-500' : 'border-slate-700'
                }`}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <AuthorPreview userId={post.author.id} initialName={post.author.name} initialAvatar={post.author.avatar} />
                <RoleBadge role={post.author.role} />
              </div>
              <div className="flex items-center gap-2 text-[11px] mt-0.5 text-slate-400 truncate">
                <span className="font-medium truncate">{post.author.roleTitle || 'Thành viên'}</span>
                <span className="text-slate-600 shrink-0">•</span>
                <span className="shrink-0">{post.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {post.isPinned && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold" title="Ghim bởi Tác giả">
                <Pin className="w-3 h-3 fill-orange-400" /> Ghim
              </div>
            )}
            {post.rating && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{post.rating.toFixed(1)}</span>
              </div>
            )}
            {canEdit && (
              <button
                onClick={() => onEdit && onEdit(post)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Chỉnh sửa bài viết"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {canDelete && !inTrash && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors disabled:opacity-50 cursor-pointer"
                title="Xoá bài viết"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* ── Post content ────────────────────────────────────────────────── */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">{post.content}</p>

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
                className="w-full aspect-square object-cover rounded-2xl border border-slate-800"
              />
            ))}
          </div>
        )}

        {/* ── Tagged equipment card ────────────────────────────────────────── */}
        {post.taggedEquipment && (
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition-colors overflow-hidden">
            <div className="flex flex-col gap-2.5">
              <div
                className="flex items-center gap-2.5 cursor-pointer group min-w-0"
                onClick={() => onViewEquipment(post.taggedEquipment!)}
              >
                <img
                  src={post.taggedEquipment.thumbnail}
                  alt={post.taggedEquipment.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block truncate">
                    Máy được review:
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 truncate transition-colors">
                    {post.taggedEquipment.name}
                  </h5>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    Giá: <span className="text-amber-400 font-semibold">{post.taggedEquipment.priceRange}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onBookEquipment(post.taggedEquipment!)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Đặt Lịch Thử Máy (Free)
              </button>
            </div>
          </div>
        )}

        {/* ── Social actions / Trash actions ───────────────────────────────── */}
        {inTrash ? (
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2 text-xs">
            <button
              onClick={handleRestore}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Khôi phục
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <button
                onClick={handleToggleLike}
                disabled={likeLoading}
                className={`flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${liked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'} disabled:opacity-70`}
              >
                {likeLoading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500' : ''}`} />}
                <span className="text-[11px] sm:text-xs">{likesCount}</span>
              </button>

              <button
                onClick={handleToggleComments}
                className="flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400/80" />
                <span className="text-[11px] sm:text-xs">{commentsCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400/80" />
                <span className="text-[11px] sm:text-xs">{sharesCount || 0}</span>
              </button>
            </div>

            <button
              onClick={handleBookmark}
              className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${bookmarked ? 'text-amber-400 bg-amber-500/10' : 'hover:text-amber-400'}`}
              title={bookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* ── Comment Popup Modal ───────────────────────────────────────────── */}
      {commentsOpen && !inTrash && (
        <CommentModal
          post={post}
          commentList={commentList}
          commentsLoading={commentsLoading}
          commentsCount={commentsCount}
          newCommentText={newCommentText}
          commentSubmitting={commentSubmitting}
          liked={liked}
          likesCount={likesCount}
          likeLoading={likeLoading}
          onClose={() => setCommentsOpen(false)}
          onLike={handleToggleLike}
          onCommentChange={setNewCommentText}
          onCommentSubmit={handleAddComment}
          currentUserAvatar={!isGuest ? currentUser.avatar : undefined}
          currentUserName={!isGuest ? currentUser.name : undefined}
          isGuest={isGuest}
          requestAuth={requestAuth}
          onViewEquipment={onViewEquipment}
          onBookEquipment={onBookEquipment}
        />
      )}
    </>
  );
};
