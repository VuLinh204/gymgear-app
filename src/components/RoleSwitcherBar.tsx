'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert, Crown, UserCheck, Eye, Sparkles, ShieldCheck } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, currentUser } = useAuth();

  const roleConfigs: { id: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      id: 'guest',
      label: 'Guest (Khách)',
      icon: <Eye className="w-3.5 h-3.5" />,
      color: 'bg-slate-800 text-slate-300 border-slate-700',
      desc: 'Chỉ xem bài & thiết bị, giới hạn đăng bài'
    },
    {
      id: 'user',
      label: 'User Thường',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      desc: 'Xem feed, đăng bài cơ bản, book thử máy'
    },
    {
      id: 'premium',
      label: 'VIP',
      icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
      color: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/50 font-bold',
      desc: 'Huy hiệu VIP, xem giá sỉ đại lý, ghim bài'
    },
    {
      id: 'admin',
      label: 'Quản Trị Viên (Admin)',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-red-400" />,
      color: 'bg-red-500/20 text-red-300 border-red-500/40 font-bold',
      desc: 'Toàn quyền Dashboard quản trị, duyệt đơn'
    }
  ];

  return (
    <div className="bg-slate-950 border-b border-amber-500/30 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        
        {/* Left Label */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-bold text-slate-300 flex items-center space-x-1">
            <span>Bảng Điều Khiển Phân Quyền (RBAC Test):</span>
          </span>
          <span className="text-amber-400 font-mono hidden sm:inline">({currentUser.name} - {currentUser.roleTitle})</span>
        </div>

        {/* Role Switcher Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {roleConfigs.map((cfg) => {
            const isActive = role === cfg.id;
            return (
              <button
                key={cfg.id}
                onClick={() => setRole(cfg.id)}
                title={cfg.desc}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[11px] border transition-all whitespace-nowrap ${
                  isActive
                    ? 'ring-2 ring-amber-400 shadow-md shadow-amber-500/20 scale-105 font-bold ' + cfg.color
                    : 'opacity-70 hover:opacity-100 bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
