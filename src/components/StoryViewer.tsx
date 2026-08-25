'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Story, toggleStoryLike, getStoryLikes, getStoryViewers, recordStoryView, StoryViewerInfo } from '@/lib/supabaseDB';
import { useAuth } from '@/context/AuthContext';
import { X, Trash2, ChevronLeft, ChevronRight, Heart, Eye, Crown, ShieldCheck, UserCheck, User, Users, Lock } from 'lucide-react';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  currentUserId: string;
  onClose: () => void;
  onDelete: (storyId: string) => Promise<void>;
  onStoryViewed?: (storyId: string) => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  rotation: number;
  scale: number;
}

const STORY_DURATION = 5000; // 5 giây mỗi story

export default function StoryViewer({
  stories,
  initialIndex,
  currentUserId,
  onClose,
  onDelete,
  onStoryViewed,
}: StoryViewerProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [likesStateMap, setLikesStateMap] = useState<Record<string, { count: number; userIds: string[] }>>({});
  const [viewersList, setViewersList] = useState<StoryViewerInfo[]>([]);
  const [isViewerListOpen, setIsViewerListOpen] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const lastTapRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  const current = stories[currentIndex];
  const effectiveUserId = currentUserId || currentUser.id || 'current_user';

  // Load real likes data per story
  useEffect(() => {
    const map: Record<string, { count: number; userIds: string[] }> = {};
    stories.forEach((s) => {
      const likesInfo = getStoryLikes(s.id);
      map[s.id] = {
        count: likesInfo.count,
        userIds: likesInfo.userIds,
      };
    });
    setLikesStateMap(map);
  }, [stories]);

  // Load & record story view
  useEffect(() => {
    if (current) {
      onStoryViewed?.(current.id);

      // Record current viewer if authenticated / guest
      if (currentUser?.id || effectiveUserId) {
        recordStoryView(current.id, {
          id: effectiveUserId,
          name: currentUser?.name || 'Thành viên',
          avatar: currentUser?.avatar || '/default-avatar.svg',
          role: currentUser?.role || 'user',
        });
      }

      // Load viewers for this story
      const viewers = getStoryViewers(current.id);
      setViewersList(viewers);
    }
  }, [current?.id, effectiveUserId, currentUser, onStoryViewed]);

  const goNext = useCallback(() => {
    if (isViewerListOpen) return;
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, isViewerListOpen, onClose]);

  const goPrev = () => {
    if (isViewerListOpen) return;
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      progressRef.current = 0;
    }
  };

  // Progress bar timer
  useEffect(() => {
    if (paused || isViewerListOpen) return;
    const step = 100 / (STORY_DURATION / 50);
    intervalRef.current = setInterval(() => {
      progressRef.current += step;
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        clearInterval(intervalRef.current!);
        goNext();
      }
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, paused, isViewerListOpen, goNext]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isViewerListOpen) {
          setIsViewerListOpen(false);
          setPaused(false);
        } else {
          onClose();
        }
      }
      if (!isViewerListOpen) {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, onClose, isViewerListOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const spawnFloatingHearts = () => {
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 60,
      rotation: (Math.random() - 0.5) * 45,
      scale: 0.8 + Math.random() * 0.5,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1200);
  };

  const handleToggleLike = async (forceLikeOnly = false) => {
    if (!current) return;
    const storyId = current.id;
    const currentLikesInfo = likesStateMap[storyId] || getStoryLikes(storyId);
    const isCurrentlyLiked = currentLikesInfo.userIds.includes(effectiveUserId);

    if (forceLikeOnly && isCurrentlyLiked) {
      spawnFloatingHearts();
      setShowBigHeart(true);
      setTimeout(() => setShowBigHeart(false), 800);
      return;
    }

    const result = await toggleStoryLike(current, {
      id: effectiveUserId,
      name: currentUser?.name || 'Thành viên',
      avatar: currentUser?.avatar || '/default-avatar.svg',
    });

    setLikesStateMap((prev) => ({
      ...prev,
      [storyId]: {
        count: result.likesCount,
        userIds: result.userIds,
      },
    }));

    if (result.liked) {
      spawnFloatingHearts();
      setShowBigHeart(true);
      setTimeout(() => setShowBigHeart(false), 800);
    }
  };

  // Double tap handler on image
  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      handleToggleLike(true);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const handleDelete = async () => {
    if (!current) return;
    setDeleting(true);
    await onDelete(current.id);
    setDeleting(false);
  };

  const handleNavigateToUser = (targetUserId: string) => {
    onClose();
    if (currentUser?.id && targetUserId === currentUser.id) {
      router.push('/profile');
    } else {
      router.push(`/user/${targetUserId}`);
    }
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    if (m < 1) return 'Vừa xong';
    if (h < 1) return `${m} phút trước`;
    return `${h} giờ trước`;
  };

  if (!current) return null;

  const isOwner = current.authorId === currentUserId || current.authorId === 'current_user' || (currentUser?.name && current.authorName === currentUser.name && currentUser.name !== 'Ẩn danh');
  const currentLikesInfo = likesStateMap[current.id] || getStoryLikes(current.id);
  const isLiked = currentLikesInfo.userIds.includes(effectiveUserId);
  const likesCount = currentLikesInfo.count;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center select-none backdrop-blur-sm"
      onMouseDown={() => { if (!isViewerListOpen) setPaused(true); }}
      onMouseUp={() => { if (!isViewerListOpen) setPaused(false); }}
      onTouchStart={() => { if (!isViewerListOpen) setPaused(true); }}
      onTouchEnd={() => { if (!isViewerListOpen) setPaused(false); }}
    >
      {/* Story container */}
      <div className="relative w-full max-w-sm h-full max-h-[85vh] sm:max-h-[90vh] sm:rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800/80 flex flex-col justify-between">
        
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-none"
                style={{
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top bar: avatar + name + close */}
        <div className="absolute top-5 left-0 right-0 z-20 flex items-center justify-between px-4">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (current.authorId) handleNavigateToUser(current.authorId);
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src={current.authorAvatar || '/default-avatar.svg'}
              alt={current.authorName}
              className="w-9 h-9 rounded-full border-2 border-amber-400 object-cover shadow-md group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-white text-sm font-bold drop-shadow block leading-tight group-hover:text-amber-400 transition-colors">{current.authorName}</span>
              <span className="text-white/70 text-[10px] block font-mono">{timeAgo(current.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={deleting}
                className="p-2 rounded-full bg-black/50 hover:bg-rose-500 text-white transition-colors cursor-pointer border border-white/10"
                title="Xóa Story này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story image + double tap trigger */}
        <div
          onClick={handleImageTap}
          className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
        >
          <img
            src={current.imageUrl}
            alt="Story"
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />

          {/* Big pulsing heart on double tap (Instagram style) */}
          {showBigHeart && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
              <div className="p-5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 animate-pulse shadow-2xl">
                <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-2xl animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Tap zones for prev/next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-0 top-16 bottom-20 w-1/4 z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Story trước"
        >
          <div className="p-1.5 rounded-full bg-black/40 text-white border border-white/10">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-0 top-16 bottom-20 w-1/4 z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Story tiếp theo"
        >
          <div className="p-1.5 rounded-full bg-black/40 text-white border border-white/10">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* Bottom Interactive Area */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2">
          {/* Caption */}
          {current.caption && (
            <p className="text-white text-xs sm:text-sm font-medium drop-shadow leading-relaxed px-1">
              {current.caption}
            </p>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            
            {/* Viewers stack button for Story Owner */}
            {isOwner ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsViewerListOpen(true);
                  setPaused(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-amber-400 hover:bg-black/80 transition-all cursor-pointer group shadow-lg"
                title="Xem danh sách người đã xem story"
              >
                {/* Mini Overlapping Avatar Stack */}
                <div className="flex -space-x-2 overflow-hidden items-center">
                  {viewersList.slice(0, 3).map((v, i) => (
                    <img
                      key={v.userId || i}
                      src={v.avatar || '/default-avatar.svg'}
                      alt={v.name}
                      className="inline-block w-5 h-5 rounded-full ring-1.5 ring-slate-950 object-cover"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-white group-hover:text-amber-400 font-semibold">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono font-bold">{viewersList.length}</span>
                  <span className="hidden sm:inline text-[10px] text-white/70">người xem</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono">
                <span>Chạm 2 lần để thả tim</span>
              </div>
            )}

            {/* Heart button container with floating particles */}
            <div className="relative">
              {/* Floating Hearts Array */}
              {floatingHearts.map((heart) => (
                <div
                  key={heart.id}
                  className="absolute bottom-6 pointer-events-none animate-floatUpStory text-rose-500 text-lg z-40"
                  style={
                    {
                      left: `calc(50% + ${heart.x}px)`,
                      '--rot': `${heart.rotation}deg`,
                      transform: `scale(${heart.scale})`,
                    } as React.CSSProperties
                  }
                >
                  ❤️
                </div>
              ))}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLike();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg active:scale-95 ${
                  isLiked
                    ? 'bg-rose-500/25 text-rose-400 border border-rose-500/60 shadow-rose-500/20'
                    : 'bg-white/15 text-white hover:text-rose-400 hover:bg-white/25 border border-white/20'
                }`}
                title={isLiked ? 'Đã thả tim (Bấm để hủy)' : 'Thả tim Story này'}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white hover:text-rose-400'
                  }`}
                />
                {likesCount > 0 && (
                  <span className="text-xs font-bold font-mono text-white">
                    {likesCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── POPUP MODAL: DANH SÁCH NGƯỜI ĐÃ XEM STORY (Instagram Style) ── */}
        {isViewerListOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-in slide-in-from-bottom duration-200"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Người đã xem Story ({viewersList.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsViewerListOpen(false);
                  setPaused(false);
                }}
                className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Privacy Subtitle */}
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/50 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Chỉ bạn mới có thể nhìn thấy danh sách người đã xem story này.</span>
            </div>

            {/* Viewers Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 sidebar-scroll">
              {viewersList.length > 0 ? (
                viewersList.map((viewer) => {
                  const hasLiked = currentLikesInfo.userIds.includes(viewer.userId) || viewer.liked;
                  return (
                    <div
                      key={viewer.userId}
                      onClick={() => handleNavigateToUser(viewer.userId)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-900/90 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={viewer.avatar || '/default-avatar.svg'}
                            alt={viewer.name}
                            className={`w-10 h-10 rounded-full object-cover border-2 ${
                              viewer.role === 'premium'
                                ? 'border-amber-400'
                                : viewer.role === 'admin'
                                ? 'border-red-500'
                                : 'border-slate-700'
                            }`}
                          />
                          {hasLiked && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] border border-slate-950 shadow">
                              ❤️
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                              {viewer.name}
                            </p>
                            {viewer.role === 'premium' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                VIP
                              </span>
                            )}
                            {viewer.role === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                                Quản Trị
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Đã xem {timeAgo(viewer.viewedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Right indicator button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToUser(viewer.userId);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 group-hover:text-amber-400 bg-slate-900 border border-slate-800 group-hover:border-amber-500/40 rounded-xl transition"
                      >
                        Trang cá nhân
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-xs text-slate-500">
                  Chưa có ai xem story này.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 text-center">
              <button
                onClick={() => {
                  setIsViewerListOpen(false);
                  setPaused(false);
                }}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl hover:from-amber-400 hover:to-orange-400 transition"
              >
                Tiếp tục xem Story
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
