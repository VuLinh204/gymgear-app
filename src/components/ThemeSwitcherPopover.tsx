'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, Sun, Moon, Zap, ShieldCheck, Flame } from 'lucide-react';

export interface ThemeOption {
  id: 'meta-blue' | 'cyber-volt' | 'crimson-pulse';
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentSecondary: string;
  badgeText: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'meta-blue',
    name: 'Royal Meta',
    tagline: 'Mạng xã hội & Đặt lịch uy tín',
    icon: ShieldCheck,
    accentColor: '#0866FF',
    accentSecondary: '#0055D4',
    badgeText: 'Facebook Blue',
  },
  {
    id: 'cyber-volt',
    name: 'Cyber Volt',
    tagline: 'Năng lượng bùng nổ, GymTok',
    icon: Zap,
    accentColor: '#10B981',
    accentSecondary: '#CCFF00',
    badgeText: 'Hyper Volt',
  },
  {
    id: 'crimson-pulse',
    name: 'Crimson Pulse',
    tagline: 'Thể hình hardcore, tạ nặng',
    icon: Flame,
    accentColor: '#EF4444',
    accentSecondary: '#FF3B30',
    badgeText: 'Iron Beast',
  },
];

export default function ThemeSwitcherPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'meta-blue' | 'cyber-volt' | 'crimson-pulse'>('meta-blue');
  const [isLight, setIsLight] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Initialize theme from document / localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('gymgear-theme') as 'meta-blue' | 'cyber-volt' | 'crimson-pulse' | null;
      const savedMode = localStorage.getItem('theme');
      
      const themeToApply = savedTheme || 'meta-blue';
      setActiveTheme(themeToApply);
      document.documentElement.setAttribute('data-theme', themeToApply);

      const lightMode = savedMode === 'light' || document.documentElement.classList.contains('theme-light');
      setIsLight(lightMode);
      if (lightMode) {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    } catch {
      // Fallback safe
    }
  }, []);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectTheme = (themeId: 'meta-blue' | 'cyber-volt' | 'crimson-pulse') => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    try {
      localStorage.setItem('gymgear-theme', themeId);
    } catch {}
  };

  const toggleMode = (light: boolean) => {
    setIsLight(light);
    if (light) {
      document.documentElement.classList.add('theme-light');
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    } else {
      document.documentElement.classList.remove('theme-light');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    }
  };

  const currentThemeObj = THEMES.find((t) => t.id === activeTheme) || THEMES[0];

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button - OriginKit tactile style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer active:translate-y-0.5 shadow-sm"
        title="Đổi bộ theme màu giao diện (OriginKit Style)"
        aria-label="Theme switcher"
        aria-expanded={isOpen}
      >
        <span
          className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-110 shadow-sm"
          style={{ backgroundColor: currentThemeObj.accentColor }}
        />
        <Palette className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
        <span className="hidden sm:inline-block text-[11px] font-bold text-slate-300 group-hover:text-white pr-0.5">
          Theme
        </span>
      </button>

      {/* Popover Dropdown - OriginKit Spring Animation */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Bảng chọn màu giao diện"
          className="absolute right-0 top-full mt-2.5 w-76 z-50 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl shadow-black/60 origin-top-right transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{
            animationDuration: '180ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className="theme-accent-check w-5 h-5 rounded-lg flex items-center justify-center text-white shadow-inner"
                style={{ backgroundColor: currentThemeObj.accentColor }}
              >
                <Check className="w-3.5 h-3.5 text-white stroke-[3]" style={{ stroke: '#ffffff', color: '#ffffff' }} />
              </div>
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Bảng Màu Thể Hình
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              OriginKit
            </span>
          </div>

          {/* 3 Theme Options */}
          <div className="space-y-1.5 mb-3">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              const isSelected = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 ring-1 ring-white/20 shadow-md'
                      : 'hover:bg-slate-800/50 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Swatch dual dots */}
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-1 ring-slate-900"
                        style={{ backgroundColor: theme.accentSecondary }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {theme.name}
                        </span>
                        <Icon className="w-3 h-3 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {theme.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Checkmark indicator */}
                  {isSelected && (
                    <div
                      className="theme-accent-check w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: theme.accentColor, color: '#ffffff' }}
                    >
                      <Check className="w-3 h-3 text-white stroke-[3]" style={{ stroke: '#ffffff', color: '#ffffff' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dark / Light Mode Switcher (Segmented Control) */}
          <div className="pt-2.5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Chế độ hiển thị
              </span>
              <span className="text-[10px] font-bold text-slate-300">
                {isLight ? 'Sáng (Light)' : 'Tối (Dark)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
              <button
                onClick={() => toggleMode(false)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isLight
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Tối</span>
              </button>

              <button
                onClick={() => toggleMode(true)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Sáng</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
