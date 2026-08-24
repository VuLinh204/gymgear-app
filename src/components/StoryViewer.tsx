'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Story } from '@/lib/supabaseDB';
import { X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  currentUserId: string;
  onClose: () => void;
  onDelete: (storyId: string) => Promise<void>;
}

const STORY_DURATION = 5000; // 5 giây mỗi story

export default function StoryViewer({ stories, initialIndex, currentUserId, onClose, onDelete }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  const current = stories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(i => i + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setProgress(0);
      progressRef.current = 0;
    }
  };

  // Progress bar timer
  useEffect(() => {
    if (paused) return;
    const step = 100 / (STORY_DURATION / 50);
    intervalRef.current = setInterval(() => {
      progressRef.current += step;
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        clearInterval(intervalRef.current!);
        goNext();
      }
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentIndex, paused, goNext]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDelete = async () => {
    if (!current) return;
    setDeleting(true);
    await onDelete(current.id);
    setDeleting(false);
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

  const isOwner = current.authorId === currentUserId;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Story container */}
      <div className="relative w-full max-w-sm h-full max-h-[85vh] sm:max-h-[90vh] sm:rounded-2xl overflow-hidden bg-black shadow-2xl">

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top bar: avatar + name + close */}
        <div className="absolute top-5 left-0 right-0 z-20 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src={current.authorAvatar}
              alt={current.authorName}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <div>
              <span className="text-white text-sm font-bold drop-shadow">{current.authorName}</span>
              <span className="text-white/60 text-[10px] block">{timeAgo(current.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 rounded-full bg-black/40 hover:bg-red-500/80 text-white transition-colors"
                title="Xóa Story này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story image */}
        <img
          src={current.imageUrl}
          alt="Story"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />

        {/* Caption */}
        {current.caption && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <p className="text-white text-sm font-medium drop-shadow">{current.caption}</p>
          </div>
        )}

        {/* Tap zones for prev/next */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Story trước"
        >
          <div className="p-1 rounded-full bg-black/30">
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10 flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Story tiếp theo"
        >
          <div className="p-1 rounded-full bg-black/30">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
