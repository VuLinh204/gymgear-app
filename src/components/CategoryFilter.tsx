'use client';

import React from 'react';
import { CATEGORIES } from '@/data/mockData';
import { CategoryType } from '@/types';
import { Activity, Dumbbell, Home, Layers, Disc, Grid, ArrowUpDown } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSelectSort
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Dumbbell': return <Dumbbell className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Disc': return <Disc className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-6 border-b border-slate-800/80 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {getIcon(cat.iconName)}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sắp xếp:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-amber-500"
            >
              <option value="popular">Nổi bật & Đánh giá cao nhất</option>
              <option value="rating-desc">Đánh giá sao (Cao → Thấp)</option>
              <option value="price-asc">Khoảng giá (Thấp → Cao)</option>
              <option value="price-desc">Khoảng giá (Cao → Thấp)</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};
