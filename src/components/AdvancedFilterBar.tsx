'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  CheckCircle, 
  Dumbbell, 
  Filter, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

export type FeedSortOption = 'latest' | 'trending' | 'verified' | 'tagged';

interface AdvancedFilterBarProps {
  currentSort: FeedSortOption;
  onSortChange: (sort: FeedSortOption) => void;
  totalCount: number;
  selectedMuscle: string;
  onSelectMuscle: (muscle: string) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  onResetFilters: () => void;
}

const MUSCLE_GROUPS = [
  'Tất cả nhóm cơ',
  'Ngực (Chest)',
  'Lưng xô (Back/Lats)',
  'Đùi & Mông (Legs/Glutes)',
  'Vai (Shoulders)',
  'Tay trước & sau (Arms)',
  'Tim mạch (Cardio)',
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-20', label: 'Dưới 20 triệu' },
  { id: '20-40', label: '20 - 40 triệu' },
  { id: 'above-40', label: 'Trên 40 triệu (Thương mại)' },
];

export default function AdvancedFilterBar({
  currentSort,
  onSortChange,
  totalCount,
  selectedMuscle,
  onSelectMuscle,
  selectedPriceRange,
  onSelectPriceRange,
  onResetFilters,
}: AdvancedFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters = selectedMuscle !== 'Tất cả nhóm cơ' || selectedPriceRange !== 'all';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-3.5 space-y-3 font-sans shadow-lg">
      
      {/* Top Row: Sort tabs + Advanced Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Sort tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs">
          {[
            { id: 'latest', label: 'Mới Nhất', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'trending', label: 'Thịnh Hành', icon: <Flame className="w-3.5 h-3.5" /> },
            { id: 'tagged', label: 'Có Gắn Thẻ Máy', icon: <Dumbbell className="w-3.5 h-3.5" /> },
            { id: 'verified', label: 'Đã Xác Minh', icon: <CheckCircle className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isSelected = currentSort === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSortChange(tab.id as FeedSortOption)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: Advanced filter toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              hasActiveFilters || showAdvanced
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Lọc theo nhóm cơ và giá máy"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ Lọc Nâng Cao</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

      </div>

      {/* Advanced Filter Collapse Dropdown */}
      {showAdvanced && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 animate-in fade-in duration-150 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Lọc theo nhóm cơ */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Nhóm cơ mục tiêu
              </label>
              <select
                value={selectedMuscle}
                onChange={(e) => onSelectMuscle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              >
                {MUSCLE_GROUPS.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc theo mức giá máy */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Khoảng giá thiết bị
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => onSelectPriceRange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-900">
              <span className="text-[11px] text-amber-400 font-medium">
                Đang áp dụng bộ lọc nâng cao
              </span>
              <button
                onClick={onResetFilters}
                className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 font-medium"
              >
                <X className="w-3 h-3" /> Đặt lại mặc định
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub-info bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
        <span>Hiển thị <strong className="text-slate-300">{totalCount}</strong> bài viết</span>
        <span className="hidden sm:inline text-amber-500/80">Phím tắt nhanh: Ctrl + K (Tìm kiếm) • ? (Hướng dẫn)</span>
      </div>

    </div>
  );
}
