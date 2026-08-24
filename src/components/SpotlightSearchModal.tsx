'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Dumbbell, 
  Newspaper, 
  User, 
  Sparkles, 
  Command, 
  ArrowRight, 
  Clock, 
  Trophy, 
  Scale, 
  CalendarCheck, 
  MessageCircle,
  Sun,
  Moon,
  Flame,
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Equipment, SocialPost } from '@/types';
import { MOCK_EQUIPMENTS } from '@/data/mockData';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SocialPost[];
  onSelectEquipment: (equipment: Equipment) => void;
  onSelectPost?: (post: SocialPost) => void;
  onOpenPRTracker: () => void;
  onOpenCompare: () => void;
  onOpenBooking: () => void;
  onOpenStoryModal?: () => void;
  onToggleTheme?: () => void;
}

// Hàm chuẩn hóa loại bỏ dấu tiếng Việt để tìm kiếm thông minh
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

const RECENT_SEARCHES_KEY = 'gymgear_recent_searches';

const TRENDING_SEARCHES = [
  '#LegDay',
  'Máy Impulse PT300H',
  'Đạp đùi DHZ Fusion',
  'Smith Machine',
  'Lịch tập Push-Pull-Legs',
  'Chiết khấu VIP',
];

export default function SpotlightSearchModal({
  isOpen,
  onClose,
  posts,
  onSelectEquipment,
  onSelectPost,
  onOpenPRTracker,
  onOpenCompare,
  onOpenBooking,
  onOpenStoryModal,
  onToggleTheme,
}: SpotlightSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'equipment' | 'posts' | 'actions'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  const normQuery = useMemo(() => removeVietnameseTones(query), [query]);

  // 1. Lọc Thiết bị
  const filteredEquipments = useMemo(() => {
    if (!normQuery) return MOCK_EQUIPMENTS.slice(0, 4);
    return MOCK_EQUIPMENTS.filter((eq) => {
      const name = removeVietnameseTones(eq.name);
      const brand = removeVietnameseTones(eq.brand);
      const category = removeVietnameseTones(eq.category);
      const excerpt = removeVietnameseTones(eq.excerpt || '');
      const muscles = removeVietnameseTones(eq.specifications?.targetMuscles?.join(' ') || '');
      return (
        name.includes(normQuery) ||
        brand.includes(normQuery) ||
        category.includes(normQuery) ||
        excerpt.includes(normQuery) ||
        muscles.includes(normQuery)
      );
    });
  }, [normQuery]);

  // 2. Lọc Bài viết
  const filteredPosts = useMemo(() => {
    if (!normQuery) return posts.slice(0, 4);
    return posts.filter((p) => {
      const content = removeVietnameseTones(p.content);
      const author = removeVietnameseTones(p.author?.name || '');
      const eqName = removeVietnameseTones(p.taggedEquipment?.name || '');
      return content.includes(normQuery) || author.includes(normQuery) || eqName.includes(normQuery);
    });
  }, [normQuery, posts]);

  // 3. Danh sách Thao tác nhanh (Quick Actions)
  const quickActions = [
    {
      id: 'action-pr',
      title: 'Kỷ Lục Tập Luyện (PR Tracker)',
      desc: 'Xem & cập nhật mức tạ kỷ lục mới',
      icon: <Trophy className="w-4 h-4 text-yellow-400" />,
      run: () => { onClose(); onOpenPRTracker(); },
    },
    {
      id: 'action-compare',
      title: 'So Sánh 2 Máy Tập',
      desc: 'Đối chiếu thông số, động cơ, tải trọng và giá VIP',
      icon: <Scale className="w-4 h-4 text-purple-400" />,
      run: () => { onClose(); onOpenCompare(); },
    },
    {
      id: 'action-booking',
      title: 'Đặt Lịch Thử Máy Showroom',
      desc: 'Trải nghiệm miễn phí máy tập tại showroom gần bạn',
      icon: <CalendarCheck className="w-4 h-4 text-emerald-400" />,
      run: () => { onClose(); onOpenBooking(); },
    },
    {
      id: 'action-story',
      title: 'Tạo Story 24 Giờ Mới',
      desc: 'Đăng khoảnh khắc tập gym kèm filter & vibe',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      run: () => { onClose(); onOpenStoryModal?.(); },
    },
    {
      id: 'action-theme',
      title: 'Đổi Giao Diện Sáng / Tối',
      desc: 'Chuyển đổi theme Light / Dark Mode',
      icon: <Sun className="w-4 h-4 text-orange-400" />,
      run: () => { onClose(); onToggleTheme?.(); },
    },
  ];

  const filteredActions = useMemo(() => {
    if (!normQuery) return quickActions;
    return quickActions.filter(
      (a) =>
        removeVietnameseTones(a.title).includes(normQuery) ||
        removeVietnameseTones(a.desc).includes(normQuery)
    );
  }, [normQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 p-3 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-150">
      
      {/* Container Spotlight */}
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-900/95 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query) {
                saveRecentSearch(query);
              }
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Tìm máy tập, bài review, PT hoặc nhập lệnh..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 text-xs overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'equipment', label: `Máy Tập (${filteredEquipments.length})` },
            { id: 'posts', label: `Bài Viết (${filteredPosts.length})` },
            { id: 'actions', label: `Thao Tác Nhanh (${filteredActions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-xl font-medium transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 max-h-[460px]">
          
          {/* Recent & Trending Searches (khi chưa gõ từ khóa) */}
          {!query && (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Tìm kiếm gần đây
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          saveRecentSearch(term);
                        }}
                        className="group flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition border border-slate-700/60"
                      >
                        <span>{term}</span>
                        <span
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-slate-500 hover:text-red-400 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Xu hướng tìm kiếm thịnh hành
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((trend, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(trend.replace('#', ''));
                        saveRecentSearch(trend);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section: THIẾT BỊ MÁY TẬP */}
          {(activeTab === 'all' || activeTab === 'equipment') && filteredEquipments.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> Thiết Bị & Máy Tập ({filteredEquipments.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredEquipments.map((eq) => (
                  <div
                    key={eq.id}
                    onClick={() => {
                      saveRecentSearch(eq.name);
                      onClose();
                      onSelectEquipment(eq);
                    }}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-xl flex items-center gap-3 cursor-pointer group transition"
                  >
                    <img src={eq.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition">
                        {eq.name}
                      </h4>
                      <p className="text-[10px] text-amber-400 font-semibold">{eq.priceRange}</p>
                      <span className="text-[9px] text-slate-400 truncate block">
                        Hãng {eq.brand} • ⭐ {eq.rating}/5.0
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 shrink-0 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: BÀI VIẾT & REVIEW */}
          {(activeTab === 'all' || activeTab === 'posts') && filteredPosts.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-blue-400" /> Bài Viết & Review Gymer ({filteredPosts.length})
              </span>
              <div className="space-y-2">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      saveRecentSearch(post.author?.name || 'Bài viết');
                      onClose();
                      onSelectPost?.(post);
                    }}
                    className="p-3 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-start gap-3 cursor-pointer group transition"
                  >
                    <img
                      src={post.author?.avatar || '/default-avatar.svg'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-white group-hover:text-amber-400 transition truncate">
                          {post.author?.name}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold shrink-0">
                          ⭐ {post.rating || 5}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                      {post.taggedEquipment && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 mt-1">
                          <Dumbbell className="w-2.5 h-2.5 text-amber-400" /> {post.taggedEquipment.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: THAO TÁC NHANH (QUICK ACTIONS) */}
          {(activeTab === 'all' || activeTab === 'actions') && filteredActions.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5 text-purple-400" /> Lệnh Thao Tác Nhanh ({filteredActions.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredActions.map((action) => (
                  <div
                    key={action.id}
                    onClick={action.run}
                    className="p-3 bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 rounded-xl flex items-center gap-3 cursor-pointer group transition"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-purple-500/40">
                      {action.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                        {action.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 shrink-0 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trạng thái không tìm thấy */}
          {query && filteredEquipments.length === 0 && filteredPosts.length === 0 && filteredActions.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-300">Không tìm thấy kết quả phù hợp với "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Hãy thử tìm theo tên máy, hãng (Impulse, DHZ) hoặc nhóm cơ.</p>
            </div>
          )}

        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Dùng <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Enter</kbd> để chọn</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">ESC</kbd> để đóng</span>
          </div>
          <span className="text-amber-400 font-medium">⚡ Spotlight GymGear v2.0</span>
        </div>

      </div>
    </div>
  );
}
