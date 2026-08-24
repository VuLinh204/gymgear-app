'use client';

import React, { useState, useEffect } from 'react';
import { fetchEquipments, getTopUsersByFollowers, toggleFollowUser, isFollowingUser, TopUser } from '@/lib/supabaseDB';
import { Equipment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Flame, Star, Award, CalendarCheck, Sparkles, UserCheck, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface SocialSidebarRightProps {
  onViewEquipment: (equipment: Equipment) => void;
  onOpenBooking: (equipment?: Equipment | null) => void;
}

export const SocialSidebarRight: React.FC<SocialSidebarRightProps> = ({
  onViewEquipment,
  onOpenBooking
}) => {
  const { isGuest, requestAuth } = useAuth();
  const [topEquipments, setTopEquipments] = useState<Equipment[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [equipLoading, setEquipLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipments().then(data => {
      setTopEquipments(data.slice(0, 3));
      setEquipLoading(false);
    }).catch(() => setEquipLoading(false));

    getTopUsersByFollowers(3).then(data => {
      setTopUsers(data);
      setUsersLoading(false);
    }).catch(() => setUsersLoading(false));
  }, []);

  // Kiểm tra trạng thái follow của từng user
  useEffect(() => {
    if (isGuest || topUsers.length === 0) return;
    const checkAll = async () => {
      const results = await Promise.all(topUsers.map(u => isFollowingUser(u.id)));
      const ids = new Set<string>();
      topUsers.forEach((u, i) => { if (results[i]) ids.add(u.id); });
      setFollowingIds(ids);
    };
    checkAll();
  }, [topUsers, isGuest]);

  const handleFollow = async (userId: string) => {
    if (isGuest) { requestAuth('login'); return; }
    setFollowLoading(userId);
    try {
      const result = await toggleFollowUser(userId);
      setFollowingIds(prev => {
        const next = new Set(prev);
        if (result.following) next.add(userId); else next.delete(userId);
        return next;
      });
      // Cập nhật follower count trong list
      setTopUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, followersCount: result.followersCount } : u
      ));
    } catch (e) { console.error(e); }
    setFollowLoading(null);
  };

  return (
    <aside className="space-y-6">
      
      {/* Quick Booking CTA Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-600/20 to-slate-900 border border-amber-500/30 p-5 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>DỊCH VỤ BOOKING 0đ</span>
        </div>
        <h4 className="text-base font-extrabold text-white leading-snug">
          Đặt Lịch Chạy Thử Máy Gym Tại Showroom
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Được trải nghiệm trực tiếp 30+ mẫu máy commercial tại 5 showroom trước khi quyết định mua hoặc mở phòng.
        </p>
        <button
          onClick={() => onOpenBooking(null)}
          className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Đặt Lịch Ngay (Miễn Phí)</span>
        </button>
      </div>

      {/* Trending Equipments Widget */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Máy Gym Hot Nhất</h4>
          </div>
          <span className="text-[10px] text-amber-400 font-mono">Bảng Xếp Hạng</span>
        </div>

        <div className="space-y-3 divide-y divide-slate-800/80">
          {equipLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="w-4 h-4 bg-slate-800 rounded" />
                  <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="h-3 bg-slate-800 rounded w-28" />
                    <div className="h-2.5 bg-slate-800/60 rounded w-20" />
                  </div>
                  <div className="w-7 h-7 bg-slate-800 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            topEquipments.map((eq, idx) => (
              <div key={eq.id} className="pt-3 first:pt-0 flex items-center space-x-3 group">
                <span className="text-sm font-black text-amber-500 w-4 text-center">#{idx + 1}</span>
                <img
                  src={eq.thumbnail}
                  alt={eq.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h5
                    onClick={() => onViewEquipment(eq)}
                    className="text-xs font-bold text-white truncate hover:text-amber-400 cursor-pointer"
                  >
                    {eq.name}
                  </h5>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-bold ml-0.5">{eq.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{eq.priceRange}</span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking(eq)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-950 transition-colors"
                  title="Đặt lịch thử máy này"
                >
                  <CalendarCheck className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Reviewers / Verified Experts — Real DB data */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Reviewer Uy Tín</h4>
          </div>
          <Link href="/community" className="text-[10px] text-amber-400 hover:underline">Xem tất cả</Link>
        </div>

        {usersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-slate-800 rounded w-24" />
                    <div className="h-2 bg-slate-800/60 rounded w-16" />
                  </div>
                </div>
                <div className="w-16 h-6 bg-slate-800 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        ) : topUsers.length === 0 ? (
          <p className="text-[11px] text-slate-500 text-center py-2">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-3 text-xs">
            {topUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-2.5">
                <Link href={`/user/${user.id}`} className="flex items-center space-x-2 group min-w-0 flex-1 overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-amber-500/40 group-hover:border-amber-400 transition-colors shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white block group-hover:text-amber-400 transition-colors truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      <Users className="w-3 h-3 shrink-0" />
                      <span className="truncate">{user.followersCount} người theo dõi</span>
                      {user.roleTitle && <span className="truncate"> · {user.roleTitle}</span>}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => handleFollow(user.id)}
                  disabled={followLoading === user.id}
                  className={`shrink-0 whitespace-nowrap p-1.5 sm:px-2.5 sm:py-1 text-[11px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                    followingIds.has(user.id)
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                      : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30'
                  } ${followLoading === user.id ? 'opacity-60 cursor-wait' : ''}`}
                  title={followingIds.has(user.id) ? 'Đang theo dõi (Click để hủy)' : 'Theo dõi người này'}
                >
                  {followLoading === user.id ? (
                    <span className="text-[10px]">...</span>
                  ) : followingIds.has(user.id) ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden xl:inline">Đang theo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Theo dõi</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
};

