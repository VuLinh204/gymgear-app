'use client';

import React, { useState, useEffect } from 'react';
import { fetchEquipments } from '@/lib/supabaseDB';
import { Equipment } from '@/types';
import { Flame, Star, Award, CalendarCheck, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface SocialSidebarRightProps {
  onViewEquipment: (equipment: Equipment) => void;
  onOpenBooking: (equipment?: Equipment | null) => void;
}

export const SocialSidebarRight: React.FC<SocialSidebarRightProps> = ({
  onViewEquipment,
  onOpenBooking
}) => {
  const [topEquipments, setTopEquipments] = useState<Equipment[]>([]);

  useEffect(() => {
    fetchEquipments().then(data => setTopEquipments(data.slice(0, 3)));
  }, []);

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
          {topEquipments.map((eq, idx) => (
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
          ))}
        </div>
      </div>

      {/* Top Reviewers / Verified Experts */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Reviewer Uy Tín</h4>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                className="w-8 h-8 rounded-full object-cover border border-amber-500"
              />
              <div>
                <span className="font-bold text-white block">Nguyễn Văn Hùng</span>
                <span className="text-[10px] text-slate-400">Chủ Gym FitPlus</span>
              </div>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30">
              Theo dõi
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                className="w-8 h-8 rounded-full object-cover border border-amber-500"
              />
              <div>
                <span className="font-bold text-white block">Trần Hoàng Nam</span>
                <span className="text-[10px] text-slate-400">Reviewer Độc Lập</span>
              </div>
            </div>
            <button className="px-2.5 py-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30">
              Theo dõi
            </button>
          </div>
        </div>
      </div>

    </aside>
  );
};
