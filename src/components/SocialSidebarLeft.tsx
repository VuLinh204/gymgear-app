'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/data/mockData';
import { CategoryType } from '@/types';
import { Newspaper, Dumbbell, MapPin, Bookmark, Sparkles, Activity, Home, Layers, Disc, Grid, Users, Crown, ShieldCheck, UserCheck, Eye, User, Settings, Trophy, Scale, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface SocialSidebarLeftProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenBooking: () => void;
  onOpenSaved?: () => void;
  onOpenPRTracker?: () => void;
  onOpenCompare?: () => void;
}

export const SocialSidebarLeft: React.FC<SocialSidebarLeftProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenBooking,
  onOpenSaved,
  onOpenPRTracker,
  onOpenCompare
}) => {
  const { currentUser, role, isGuest, isPremium, isAdmin, requestAuth } = useAuth();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Dumbbell': return <Dumbbell className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Disc': return <Disc className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const getRoleBadge = () => {
    if (isPremium) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>VIP PREMIUM</span>
        </span>
      );
    }
    if (isAdmin) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
          <ShieldCheck className="w-3 h-3 text-red-400" />
          <span>ADMINISTRATOR</span>
        </span>
      );
    }
    if (isGuest) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
          <Eye className="w-3 h-3 text-slate-400" />
          <span>GUEST (KHÁCH)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
        <UserCheck className="w-3 h-3 text-blue-400" />
        <span>USER THƯỜNG</span>
      </span>
    );
  };

  return (
    <aside className="space-y-6">
      
      {/* Dynamic User Profile Quick View */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-lg">
        {isGuest ? (
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">Khách Vãng Lai</h4>
              <p className="text-[11px] text-[var(--foreground-dim)] mt-1">Đăng nhập để viết bài review máy gym & theo dõi cộng đồng.</p>
            </div>
            <div className="pt-1 space-y-2">
              <button
                onClick={() => requestAuth('login')}
                className="w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl shadow-md transition-all"
              >
                Đăng Nhập / Đăng Ký
              </button>
              <button
                onClick={onOpenBooking}
                className="w-full py-2 text-xs font-semibold text-slate-300 bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
              >
                + Đặt Lịch Thử Máy (Free)
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className={`w-12 h-12 rounded-full object-cover border-2 ${
                  isPremium ? 'border-amber-400' : isAdmin ? 'border-red-500' : 'border-slate-700'
                }`}
              />
              <div>
                <h4 className="text-sm font-bold text-[var(--foreground)] leading-tight">
                  {currentUser.name}
                </h4>
                <div className="mt-1">{getRoleBadge()}</div>
              </div>
            </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-slate-800 text-center text-xs">
              <div>
                <span className="font-bold text-[var(--foreground)] block">{currentUser.email || 'Thành viên'}</span>
                <span className="text-[10px] text-[var(--foreground-dim)]">Tài khoản</span>
              </div>
              <div>
                <span className="font-bold text-emerald-400 block">Hoạt động</span>
                <span className="text-[10px] text-[var(--foreground-dim)]">Trạng thái</span>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl shadow-md transition-all"
            >
              + Đặt Lịch Thử Máy (Free)
            </button>
          </>
        )}
      </div>

      {/* Main Navigation Menu */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
          Khám Phá Cộng Đồng
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            activeCategory === 'all'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Newspaper className="w-4 h-4 text-amber-400" />
          <span>Bảng Tin Review Mới Nhất</span>
        </button>

        <Link
          href="/showroom"
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <MapPin className="w-4 h-4 text-orange-400" />
          <span>Showroom Có Máy Thử (30+)</span>
        </Link>

        <Link
          href="/community"
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Hội Chủ Phòng Gym & PT</span>
        </Link>

        <button
          onClick={() => onOpenPRTracker && onOpenPRTracker()}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Kỷ Lục PR Của Bạn</span>
        </button>

        <button
          onClick={() => onOpenCompare && onOpenCompare()}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Scale className="w-4 h-4 text-purple-400" />
          <span>So Sánh Máy Tập (2 Máy)</span>
        </button>

        <button
          onClick={() => onOpenSaved && onOpenSaved()}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <span>Bài Viết Đã Lưu</span>
        </button>

        {!isGuest && (
          <>
            <div className="border-t border-slate-800/80 my-2"></div>
            <Link
              href="/profile"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Hồ Sơ Cá Nhân</span>
            </Link>
            <Link
              href="/settings"
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Cài Đặt Tài Khoản</span>
            </Link>
          </>
        )}
      </div>

      {/* Category Filter Menu */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
          Lọc Theo Loại Máy Tập
        </div>

        {CATEGORIES.map((cat) => {
          if (cat.id === 'all') return null;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {getCategoryIcon(cat.iconName)}
                <span>{cat.name}</span>
              </div>
            </button>
          );
        })}
      </div>

    </aside>
  );
};
