'use client';

import React from 'react';
import { Equipment } from '@/types';
import { Star, ShieldCheck, CalendarCheck, FileText, CheckCircle2, MapPin } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onViewDetail: (item: Equipment) => void;
  onBook: (item: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onViewDetail, onBook }) => {
  return (
    <div className="group relative bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Header with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onViewDetail(equipment)}>
        <img
          src={equipment.thumbnail}
          alt={equipment.name}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
        
        {/* Brand & Type Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-700/80">
            {equipment.brand}
          </span>
          {equipment.type === 'commercial' && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Phòng Gym Commercial
            </span>
          )}
          {equipment.type === 'home' && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Home Gym
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{equipment.rating}</span>
          <span className="text-[10px] text-slate-400">({equipment.reviewCount})</span>
        </div>

        {/* Showroom Availability Tag */}
        {equipment.availableForBooking && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-[11px] font-medium text-emerald-400 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>Có máy thử tại Showroom</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Model number & Title */}
          <div className="text-[11px] font-mono text-slate-400 mb-1">Mã sản phẩm: {equipment.modelNumber}</div>
          <h3
            onClick={() => onViewDetail(equipment)}
            className="text-base sm:text-lg font-bold text-white hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {equipment.name}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
            {equipment.excerpt}
          </p>

          {/* Quick Specifications list */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            {equipment.specifications.powerOutput && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Công suất Động cơ:</span>
                <span className="font-semibold text-slate-200">{equipment.specifications.powerOutput}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tải trọng tối đa:</span>
              <span className="font-semibold text-slate-200">{equipment.specifications.weightCapacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bảo hành chính hãng:</span>
              <span className="font-semibold text-emerald-400">{equipment.specifications.warranty}</span>
            </div>
          </div>

          {/* Top Pros highlight */}
          {equipment.pros && equipment.pros.length > 0 && (
            <div className="mt-3 flex items-start space-x-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{equipment.pros[0]}</span>
            </div>
          )}
        </div>

        {/* Card Footer: Pricing & Action Buttons */}
        <div className="pt-3 border-t border-slate-800">
          <div className="mb-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Khoảng Giá Tham Khảo:</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400">{equipment.priceRange}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetail(equipment)}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Xem Review</span>
            </button>

            <button
              onClick={() => onBook(equipment)}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Thử Máy</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
