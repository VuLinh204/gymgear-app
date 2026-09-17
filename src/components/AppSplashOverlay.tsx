'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AppSplashOverlay() {
  // Always render true during SSR so the overlay is present in raw HTML at frame 0
  const [visible, setVisible] = useState<boolean>(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gymgear-splash-shown')) {
        setVisible(false);
        return;
      }
    } catch {
      // ignore
    }

    // First visit in this session: display for 750ms, then fade out
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 750);

    const unmountTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('gymgear-splash-shown', 'true');
      } catch {}
    }, 1150);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="app-splash-overlay"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between py-12 px-6 transition-all duration-400 ease-out select-none pointer-events-auto ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: 'var(--theme-bg, #18191a)',
      }}
      onClick={() => setFadingOut(true)}
    >
      {/* Top spacer */}
      <div className="w-full h-8" />

      {/* Centered Brand Emblem (Facebook Launch Style) */}
      <div className="flex flex-col items-center text-center space-y-5">
        {/* Pulsing Logo Container */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          {/* Subtle ambient aura */}
          <div
            className="splash-aura absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
            style={{ backgroundColor: 'var(--theme-accent, #0866FF)' }}
          />

          {/* Logo Frame with Dual Dark/Light Logo */}
          <div className="splash-logo-card relative z-10 w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-2xl flex items-center justify-center animate-bounce duration-1000">
            <img
              src="/LogoGymGear.png"
              alt="GymGear Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md dark-logo"
            />
            <img
              src="/LogoGymGearDark.png"
              alt="GymGear Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md light-logo"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1">
          <h1 className="splash-brand-title text-2xl sm:text-3xl font-black tracking-wider uppercase flex items-center justify-center gap-1.5 font-sans">
            GYM<span style={{ color: 'var(--theme-accent, #0866FF)' }}>GEAR</span>
          </h1>
          <p className="splash-tagline text-xs sm:text-sm font-medium text-slate-400 max-w-xs">
            Mạng Xã Hội Review & Booking Máy Tập Gym
          </p>
        </div>

        {/* Dynamic Launch Progress Runner */}
        <div className="splash-runner-track w-36 h-1 rounded-full bg-slate-800/80 overflow-hidden relative mt-4">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: fadingOut ? '100%' : '85%',
              backgroundColor: 'var(--theme-accent, #0866FF)',
            }}
          />
        </div>
      </div>

      {/* Footer Meta Style */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <span className="splash-footer-sub text-[10px] tracking-widest uppercase font-semibold text-slate-500">
          from
        </span>
        <span className="splash-footer-text text-xs font-bold tracking-wider text-slate-300">
          GYMGEAR COMMUNITY
        </span>
      </div>
    </div>
  );
}
