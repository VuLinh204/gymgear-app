'use client';

import React, { useState } from 'react';
import { Equipment } from '@/types';
import { MOCK_EQUIPMENTS } from '@/data/mockData';
import { 
  X, 
  Scale, 
  Check, 
  Sparkles, 
  CalendarCheck, 
  Crown, 
  Star, 
  Layers, 
  ShieldCheck,
  Dumbbell
} from 'lucide-react';

interface EquipmentCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquip1?: Equipment | null;
  initialEquip2?: Equipment | null;
  onOpenBooking: (equipment: Equipment) => void;
}

export default function EquipmentCompareModal({
  isOpen,
  onClose,
  initialEquip1,
  initialEquip2,
  onOpenBooking,
}: EquipmentCompareModalProps) {
  const [equip1Id, setEquip1Id] = useState<string>(
    initialEquip1?.id || MOCK_EQUIPMENTS[0]?.id || ''
  );
  const [equip2Id, setEquip2Id] = useState<string>(
    initialEquip2?.id || MOCK_EQUIPMENTS[1]?.id || ''
  );

  if (!isOpen) return null;

  const equip1 = MOCK_EQUIPMENTS.find((e) => e.id === equip1Id) || MOCK_EQUIPMENTS[0];
  const equip2 = MOCK_EQUIPMENTS.find((e) => e.id === equip2Id) || MOCK_EQUIPMENTS[1];

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                So Sánh Thiết Bị Máy Tập
              </h2>
              <p className="text-xs text-slate-400">
                Đối chiếu trực quan thông số, công suất, tải trọng & giá ưu đãi VIP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Top Selection Row: Machine 1 vs Machine 2 */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Machine 1 Selector */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col items-center text-center">
              <label className="text-[11px] font-bold text-amber-400 mb-1.5 uppercase tracking-wider">
                Thiết Bị 1
              </label>
              <select
                value={equip1Id}
                onChange={(e) => setEquip1Id(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-amber-500 mb-3"
              >
                {MOCK_EQUIPMENTS.map((eq) => (
                  <option key={eq.id} value={eq.id} disabled={eq.id === equip2Id}>
                    {eq.name}
                  </option>
                ))}
              </select>

              <div className="relative w-full h-36 sm:h-48 rounded-xl overflow-hidden mb-3 border border-slate-800">
                <img src={equip1.thumbnail} alt={equip1.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  {equip1.brand}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{equip1.name}</h3>
              <p className="text-xs text-amber-400 font-bold mb-3">{equip1.priceRange}</p>
              
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking(equip1);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:scale-[1.02] transition shadow-md flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Đặt Thử Máy Này
              </button>
            </div>

            {/* Machine 2 Selector */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col items-center text-center">
              <label className="text-[11px] font-bold text-orange-400 mb-1.5 uppercase tracking-wider">
                Thiết Bị 2
              </label>
              <select
                value={equip2Id}
                onChange={(e) => setEquip2Id(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-amber-500 mb-3"
              >
                {MOCK_EQUIPMENTS.map((eq) => (
                  <option key={eq.id} value={eq.id} disabled={eq.id === equip1Id}>
                    {eq.name}
                  </option>
                ))}
              </select>

              <div className="relative w-full h-36 sm:h-48 rounded-xl overflow-hidden mb-3 border border-slate-800">
                <img src={equip2.thumbnail} alt={equip2.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-orange-400 border border-orange-500/30">
                  {equip2.brand}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{equip2.name}</h3>
              <p className="text-xs text-orange-400 font-bold mb-3">{equip2.priceRange}</p>

              <button
                onClick={() => {
                  onClose();
                  onOpenBooking(equip2);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-bold hover:scale-[1.02] transition shadow-md flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Đặt Thử Máy Này
              </button>
            </div>

          </div>

          {/* Comparison Table Specifications */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-800/60 p-3 text-xs font-bold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Bảng Đối Chiếu Thông Số Kỹ Thuật
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              
              {/* Row 1: Giá VIP */}
              <div className="grid grid-cols-12 p-3 bg-slate-950/40">
                <div className="col-span-4 text-slate-400 font-medium flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Giá Ưu Đãi VIP
                </div>
                <div className="col-span-4 text-amber-300 font-bold">{equip1.vipPrice || 'Liên hệ'}</div>
                <div className="col-span-4 text-amber-300 font-bold">{equip2.vipPrice || 'Liên hệ'}</div>
              </div>

              {/* Row 2: Động cơ / Công suất */}
              <div className="grid grid-cols-12 p-3 bg-slate-900/40">
                <div className="col-span-4 text-slate-400 font-medium">Động cơ / Công suất</div>
                <div className="col-span-4 text-slate-200 font-semibold">{equip1.specifications?.powerOutput || 'Khung cơ học'}</div>
                <div className="col-span-4 text-slate-200 font-semibold">{equip2.specifications?.powerOutput || 'Khung cơ học'}</div>
              </div>

              {/* Row 3: Tải trọng người tập */}
              <div className="grid grid-cols-12 p-3 bg-slate-950/40">
                <div className="col-span-4 text-slate-400 font-medium">Tải trọng tối đa</div>
                <div className="col-span-4 text-slate-200">{equip1.specifications?.weightCapacity || '150 - 200 kg'}</div>
                <div className="col-span-4 text-slate-200">{equip2.specifications?.weightCapacity || '150 - 200 kg'}</div>
              </div>

              {/* Row 4: Kích thước & Cân nặng máy */}
              <div className="grid grid-cols-12 p-3 bg-slate-900/40">
                <div className="col-span-4 text-slate-400 font-medium">Kích thước & Trọng lượng</div>
                <div className="col-span-4 text-slate-300">
                  {equip1.specifications?.dimensions || 'Chuẩn Showroom'} • {equip1.specifications?.machineWeight || 'N/A'}
                </div>
                <div className="col-span-4 text-slate-300">
                  {equip2.specifications?.dimensions || 'Chuẩn Showroom'} • {equip2.specifications?.machineWeight || 'N/A'}
                </div>
              </div>

              {/* Row 5: Nhóm cơ tác động */}
              <div className="grid grid-cols-12 p-3 bg-slate-950/40">
                <div className="col-span-4 text-slate-400 font-medium flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> Nhóm cơ tác động
                </div>
                <div className="col-span-4 text-slate-300">
                  {equip1.specifications?.targetMuscles?.join(', ') || 'Toàn thân'}
                </div>
                <div className="col-span-4 text-slate-300">
                  {equip2.specifications?.targetMuscles?.join(', ') || 'Toàn thân'}
                </div>
              </div>

              {/* Row 6: Bảo hành */}
              <div className="grid grid-cols-12 p-3 bg-slate-900/40">
                <div className="col-span-4 text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Chế độ bảo hành
                </div>
                <div className="col-span-4 text-emerald-300 font-semibold">{equip1.specifications?.warranty || '3 - 5 năm'}</div>
                <div className="col-span-4 text-emerald-300 font-semibold">{equip2.specifications?.warranty || '3 - 5 năm'}</div>
              </div>

              {/* Row 7: Đánh giá Gymer */}
              <div className="grid grid-cols-12 p-3 bg-slate-950/40">
                <div className="col-span-4 text-slate-400 font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Đánh giá cộng đồng
                </div>
                <div className="col-span-4 text-slate-200 font-bold">
                  ⭐ {equip1.rating || 4.8}/5.0 ({equip1.reviewCount || 20} đánh giá)
                </div>
                <div className="col-span-4 text-slate-200 font-bold">
                  ⭐ {equip2.rating || 4.8}/5.0 ({equip2.reviewCount || 20} đánh giá)
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Trải nghiệm thực tế máy tập miễn phí tại hệ thống Showroom toàn quốc.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
