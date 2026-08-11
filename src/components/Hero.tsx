'use client';

import React from 'react';
import { Star, ShieldCheck, Sparkles, MapPin, Zap, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onScrollToCatalog }) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/60">
      
      {/* Dynamic Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-red-500/10 blur-3xl pointer-events-none -z-10 rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Nền Tảng Đánh Giá & Đặt Lịch Máy Tập Gym #1 Việt Nam</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Chọn Đúng Máy Gym <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                Trải Nghiệm Thực Tế
              </span>{' '}
              Trước Khi Mua
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Tổng hợp bài Review chi tiết thông số, độ bền, tải trọng và giá thành máy tập Gym (Impulse, Technogym, Matrix, DHZ...). Đặt lịch tập thử trực tiếp tại Showroom gần bạn hoàn toàn miễn phí.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">30+ Showroom Toàn Quốc</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Phản Hồi Sau 15 Phút</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">100% Free Dịch Vụ</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 text-base font-bold text-white rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-500 shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Đặt Lịch Thử Máy Trực Tiếp</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onScrollToCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-base font-semibold text-slate-300 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all"
              >
                <span>Xem Bài Review & Thông Số</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80"
                  alt="Review máy tập gym commercial"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                {/* Floating Rating Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center space-x-1.5 shadow-lg">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-white">4.9 / 5.0</span>
                  <span className="text-[11px] text-slate-400">(150+ Đánh giá)</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase">Máy Gym Nổi Bật 2026</p>
                      <h4 className="text-sm font-bold text-white">Impulse PT300H & Leg Press DHZ</h4>
                    </div>
                    <button
                      onClick={onOpenBooking}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
                    >
                      Book Ngay
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
