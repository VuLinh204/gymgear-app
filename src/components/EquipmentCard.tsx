'use client';

import React from 'react';
import { Equipment } from '@/types';
import { Star, CalendarCheck, FileText, CheckCircle2, MapPin, Dumbbell, Gauge } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onViewDetail: (item: Equipment) => void;
  onBook: (item: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onViewDetail, onBook }) => {
  const targetMuscleText = equipment.specifications.targetMuscles?.slice(0, 2).join(' • ');

  return (
    <div className="group relative bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-xl transition-all duration-300 flex flex-col overflow-hidden ring-1 ring-white/5 hover:ring-white/10">
      
      {/* Image Header with Hallmark Machine Spec HUD */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onViewDetail(equipment)}>
        <img
          src={equipment.thumbnail}
          alt={equipment.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Brand & Machine Grade Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-950/85 backdrop-blur-md text-white border border-slate-700 shadow-sm uppercase tracking-wider">
            {equipment.brand}
          </span>
          {equipment.type === 'commercial' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 backdrop-blur-sm uppercase">
              Commercial Grade
            </span>
          )}
          {equipment.type === 'home' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm uppercase">
              Home Gym Pro
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 flex items-center space-x-1 shadow-md z-10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{equipment.rating}</span>
          <span className="text-[10px] text-slate-400">({equipment.reviewCount})</span>
        </div>

        {/* Hallmark HUD: Bottom overlay tags on machine image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          {equipment.availableForBooking ? (
            <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">Có máy thử Showroom</span>
            </div>
          ) : <div />}

          {/* Biomechanics / Target muscle pill */}
          {targetMuscleText && (
            <div className="flex items-center space-x-1 text-[10px] font-mono font-medium text-slate-300 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800 shrink-0">
              <Dumbbell className="w-3 h-3 text-slate-400" />
              <span>{targetMuscleText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Model number */}
          <div className="text-[11px] font-mono text-slate-400 mb-1 tracking-tight flex items-center justify-between">
            <span>Model: {equipment.modelNumber}</span>
            {equipment.specifications.machineWeight && (
              <span className="text-slate-500">Khối lượng: {equipment.specifications.machineWeight}</span>
            )}
          </div>
          
          <h3
            onClick={() => onViewDetail(equipment)}
            className="text-base sm:text-lg font-extrabold text-white hover:text-slate-200 transition-colors line-clamp-2 cursor-pointer leading-snug tracking-tight"
          >
            {equipment.name}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
            {equipment.excerpt}
          </p>

          {/* Hallmark Quick Specifications HUD */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            {equipment.specifications.powerOutput && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-slate-500" /> Động cơ:
                </span>
                <span className="font-bold text-slate-200">{equipment.specifications.powerOutput}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tải trọng tối đa:</span>
              <span className="font-bold text-slate-200">{equipment.specifications.weightCapacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bảo hành chính hãng:</span>
              <span className="font-bold text-emerald-400">{equipment.specifications.warranty}</span>
            </div>
          </div>

          {/* Top Pros highlight */}
          {equipment.pros && equipment.pros.length > 0 && (
            <div className="mt-3 flex items-start space-x-1.5 text-[11px] text-slate-300 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{equipment.pros[0]}</span>
            </div>
          )}
        </div>

        {/* Card Footer: Pricing & Hallmark Tactile Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Khoảng Giá Tham Khảo:</span>
            <span className="text-base sm:text-lg font-black text-white">{equipment.priceRange}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetail(equipment)}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 active:translate-y-0.5 transition-all cursor-pointer ring-1 ring-inset ring-white/5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Xem Review</span>
            </button>

            <button
              onClick={() => onBook(equipment)}
              className="btn-theme-accent w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white active:translate-y-0.5 transition-all shadow-md cursor-pointer ring-1 ring-inset ring-white/20"
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
