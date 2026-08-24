'use client';

import React, { useState, useEffect } from 'react';
import { UserAuthor } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  Users, 
  UserCheck, 
  UserPlus, 
  Search, 
  Crown, 
  ShieldCheck, 
  MapPin, 
  Loader2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  fetchUserFollowers, 
  fetchUserFollowing, 
  toggleFollowUser, 
  isFollowingUser,
  getFollowersCountByUserId,
  getFollowingCountByUserId
} from '@/lib/supabaseDB';
import Link from 'next/link';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
  initialTab?: 'followers' | 'following';
  onCountsLoaded?: (followersCount: number, followingCount: number) => void;
}

export default function FollowListModal({
  isOpen,
  onClose,
  userId,
  userName = 'Người dùng',
  initialTab = 'followers',
  onCountsLoaded,
}: FollowListModalProps) {
  const { currentUser, requestAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [followers, setFollowers] = useState<UserAuthor[]>([]);
  const [following, setFollowing] = useState<UserAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});



  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadData = async () => {
      setLoading(true);
      const [followersList, followingList, dbFollowersCount, dbFollowingCount] = await Promise.all([
        fetchUserFollowers(userId),
        fetchUserFollowing(userId),
        getFollowersCountByUserId(userId),
        getFollowingCountByUserId(userId),
      ]);

      setFollowers(followersList);
      setFollowing(followingList);

      // Khởi tạo map trạng thái follow
      const fMap: Record<string, boolean> = {};

      // Tất cả người trong "đang theo dõi" → chắc chắn đã follow rồi
      followingList.forEach(u => {
        fMap[u.id] = true;
        try { localStorage.setItem(`gymgear_follow_${u.id}`, 'true'); } catch (_) {}
      });

      // Với danh sách "người theo dõi": đọc từ localStorage
      followersList.forEach(u => {
        if (fMap[u.id] !== undefined) return;
        try {
          const cached = localStorage.getItem(`gymgear_follow_${u.id}`);
          fMap[u.id] = cached === 'true';
        } catch (_) {
          fMap[u.id] = false;
        }
      });

      setFollowingMap(fMap);

      // Dùng count từ DB (đáng tin hơn list.length vì list có thể bị lỗi join)
      if (onCountsLoaded) {
        onCountsLoaded(
          Math.max(followersList.length, dbFollowersCount || 0),
          Math.max(followingList.length, dbFollowingCount || 0),
        );
      }
      setLoading(false);
    };

    loadData();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleToggleFollow = async (e: React.MouseEvent, targetUser: UserAuthor) => {
    e.stopPropagation();
    if (!currentUser || currentUser.role === 'guest') {
      return requestAuth('login');
    }

    const currentStatus = !!followingMap[targetUser.id];
    const nextStatus = !currentStatus;

    // Optimistic UI update
    setFollowingMap(prev => ({ ...prev, [targetUser.id]: nextStatus }));
    try {
      localStorage.setItem(`gymgear_follow_${targetUser.id}`, nextStatus ? 'true' : 'false');
    } catch (_) {}

    try {
      const res = await toggleFollowUser(targetUser.id);
      setFollowingMap(prev => ({ ...prev, [targetUser.id]: res.following }));
      try {
        localStorage.setItem(`gymgear_follow_${targetUser.id}`, res.following ? 'true' : 'false');
      } catch (_) {}
    } catch (err) {
      console.error(err);
      setFollowingMap(prev => ({ ...prev, [targetUser.id]: currentStatus }));
    }
  };

  const currentList = activeTab === 'followers' ? followers : following;

  const filteredList = currentList.filter(user => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      (user.roleTitle && user.roleTitle.toLowerCase().includes(q)) ||
      (user.gymBranch && user.gymBranch.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-orange-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Mạng Lưới Kết Nối
              </h3>
              <p className="text-[11px] text-slate-400">
                {userName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 text-xs">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 text-center font-bold transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'followers'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Người theo dõi ({followers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-center font-bold transition border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'following'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Đang theo dõi ({following.length})</span>
          </button>
        </div>

        {/* Search inside list */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên gymer, PT, showroom..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 divide-y divide-slate-800/40">
          {loading ? (
            <div className="space-y-3 p-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 p-2 rounded-2xl animate-pulse"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 border border-slate-700/50" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 bg-slate-800 rounded-md w-28" />
                      <div className="h-2.5 bg-slate-800/60 rounded-md w-36" />
                    </div>
                  </div>
                  <div className="w-20 h-7 bg-slate-800 rounded-xl shrink-0" />
                </div>
              ))}
            </div>
          ) : filteredList.length > 0 ? (
            filteredList.map(item => {
              const isMe = currentUser?.id === item.id;
              const isFollowed = !!followingMap[item.id];

              return (
                <div
                  key={item.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 hover:bg-slate-800/30 p-2 rounded-2xl transition"
                >
                  {/* User info */}
                  <Link
                    href={`/user/${item.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 group cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.avatar || '/default-avatar.svg'}
                        alt=""
                        className={`w-11 h-11 rounded-full object-cover border-2 transition ${
                          item.role === 'premium' ? 'border-amber-400 ring-2 ring-amber-500/20' :
                          item.role === 'admin' ? 'border-red-500' : 'border-slate-700'
                        }`}
                      />
                      {item.role === 'premium' && (
                        <div className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-amber-500 text-slate-950 shadow">
                          <Crown className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 truncate transition">
                          {item.name}
                        </span>
                        {item.isVerified && (
                          <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-amber-400/90 font-medium truncate">
                        {item.roleTitle || 'Thành viên Gymer'}
                      </p>
                      {item.gymBranch && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                          <MapPin className="w-2.5 h-2.5 text-slate-500 shrink-0" /> {item.gymBranch}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Follow button */}
                  {!isMe && (
                    <button
                      onClick={(e) => handleToggleFollow(e, item)}
                      className={`w-[110px] h-[32px] rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1 shrink-0 ${
                        isFollowed
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400'
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đang theo dõi</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ Theo dõi</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-14 text-center text-slate-500 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
              <p className="text-xs font-semibold text-slate-400">
                {activeTab === 'followers' ? 'Chưa có người theo dõi nào' : 'Chưa theo dõi người dùng nào'}
              </p>
              <p className="text-[11px] text-slate-500">
                {searchQuery ? 'Không tìm thấy kết quả phù hợp từ khóa' : 'Hãy kết nối và theo dõi các gymer & HLV nổi bật!'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-400" /> Cộng đồng Gymer & Showroom GymGear
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
