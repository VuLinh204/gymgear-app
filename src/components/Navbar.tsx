'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, CalendarCheck, Bell, Menu, X, Crown, ShieldAlert, LogIn, UserPlus, LogOut, ChevronDown, User, Settings, Sun, Moon, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';

interface NavbarProps {
  onSearch: (query: string) => void;
  onOpenBooking: () => void;
  onOpenAdminDashboard?: () => void;
  onOpenSpotlight?: () => void;
  onOpenGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  onOpenBooking, 
  onOpenAdminDashboard,
  onOpenSpotlight,
  onOpenGuide
}) => {
  const { currentUser, isGuest, isPremium, isAdmin, logout, requestAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('theme');
    const light = saved === 'light';
    setIsLight(light);
    if (light) document.documentElement.classList.add('theme-light');
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center" aria-label="Go to homepage">
              <img src={isLight ? '/LogoGymGearDark.png' : '/LogoGymGear.png'} alt="GymGear" className="h-10 object-contain" />
            </Link>
          </div>

          {/* ── Search (Spotlight Trigger) ─────────────────────────────────── */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div 
              onClick={onOpenSpotlight}
              className="relative w-full cursor-pointer group"
            >
              <Search className="w-4 h-4 text-[var(--foreground-dim)] group-hover:text-amber-400 absolute left-3.5 top-2.5 transition" />
              <input
                type="text"
                readOnly
                placeholder="Tìm máy tập, bài review, PT..."
                className="w-full bg-slate-900 text-slate-200 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-10 pr-16 py-2 border border-slate-800 group-hover:border-amber-500/50 cursor-pointer transition"
              />
              <div className="absolute right-2.5 top-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* ── Right controls ────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">

            {/* Admin panel button (chỉ hiện với Admin) */}
            {isAdmin && (
              <button
                onClick={onOpenAdminDashboard}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="hidden xl:inline">Admin Panel</span>
              </button>
            )}

            {/* VIP badge (chỉ hiện với Premium) */}
            {isPremium && (
              <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="hidden xl:inline">VIP Premium</span>
              </div>
            )}

            {/* Nút Bảng Hướng Dẫn & Phím Tắt */}
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition"
                title="Hướng dẫn tính năng & Phím tắt (Nhấn ? hoặc Ctrl + /)"
                aria-label="Hướng dẫn"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}

            {/* Notification dropdown */}
            <NotificationDropdown onOpenBooking={() => onOpenBooking()} />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Book button (luôn hiển thị) */}
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-xs font-bold text-slate-950 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-orange-500/20 transition font-bold"
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Đặt Lịch</span>
              <span className="hidden xl:inline">Thử Máy</span>
            </button>

            {/* Auth section */}
            {isGuest ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => requestAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" /> Đăng Nhập
                </button>
                <button
                  onClick={() => requestAuth('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Đăng Ký
                </button>
              </div>
            ) : (
              /* User dropdown menu */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className={`w-8 h-8 rounded-full object-cover border-2 ${
                      currentUser.role === 'premium' ? 'border-amber-400' :
                      currentUser.role === 'admin' ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-[var(--foreground)] leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-[var(--foreground-dim)] leading-none mt-0.5">{currentUser.role.toUpperCase()}</p>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-[var(--foreground-dim)] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-950">
                      <p className="text-xs font-bold text-[var(--foreground)]">{currentUser.name}</p>
                      <p className="text-[10px] text-[var(--foreground-dim)] mt-0.5">{currentUser.email || currentUser.roleTitle}</p>
                    </div>
                    
                    <div className="py-1 border-b border-slate-800">
                      <Link 
                        href="/profile" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--foreground-dim)] hover:text-[var(--foreground)] hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" /> Hồ Sơ Cá Nhân
                      </Link>
                      <Link 
                        href="/settings" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-[var(--foreground-dim)] hover:text-[var(--foreground)] hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" /> Cài Đặt Tài Khoản
                      </Link>
                    </div>

                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile menu toggle ────────────────────────────────────────── */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile dropdown ───────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm review máy gym..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-slate-800"
              />
            </div>

            {isGuest ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileOpen(false); requestAuth('login'); }}
                  className="py-2 font-bold text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/30"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => { setMobileOpen(false); requestAuth('register'); }}
                  className="py-2 font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl"
                >
                  Đăng Ký
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-amber-500" alt="" />
                  <div>
                    <p className="font-bold text-[var(--foreground)]">{currentUser.name}</p>
                    <p className="text-[var(--foreground-dim)]">{currentUser.roleTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-1 px-3 py-1.5 font-bold text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" /> Xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
