'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollTop > 280) {
        setIsVisible(true);
        if (scrollHeight > 0) {
          const progress = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
          setScrollProgress(progress);
        }
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  // Tính toán chu vi hình tròn SVG
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 left-5 z-40 p-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-400 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 flex items-center justify-center group focus:outline-none"
      title={`Cuộn lên đầu trang (${scrollProgress}%)`}
      aria-label="Cuộn lên đầu trang"
    >
      {/* Vòng tròn tiến trình cuộn */}
      <svg className="w-10 h-10 -rotate-90 transform" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          className="stroke-amber-500 transition-all duration-150"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Icon mũi tên ở giữa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
}
