'use client';

import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  Search, 
  Command, 
  Trophy, 
  Scale, 
  MessageCircle, 
  Bell, 
  MapPin, 
  Image as ImageIcon, 
  Layers, 
  Sun, 
  Flame, 
  BookOpen, 
  Keyboard,
  CheckCircle2
} from 'lucide-react';

interface FeatureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSpotlight: () => void;
  onOpenPRTracker: () => void;
  onOpenCompare: () => void;
  onOpenBooking: () => void;
}

export default function FeatureGuideModal({
  isOpen,
  onClose,
  onOpenSpotlight,
  onOpenPRTracker,
  onOpenCompare,
  onOpenBooking,
}: FeatureGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'shortcuts'>('features');

  if (!isOpen) return null;

  const FEATURES = [
    {
      title: '🔍 Thanh Tìm Kiếm Toàn Năng (Spotlight Search)',
      shortcut: 'Ctrl + K',
      icon: <Search className="w-5 h-5 text-amber-400" />,
      desc: 'Tìm kiếm đa đối tượng cùng lúc: Thiết bị, Bài viết review, Huấn luyện viên (PT) và Lệnh thao tác nhanh. Hỗ trợ gõ tiếng Việt không dấu siêu tốc.',
      action: onOpenSpotlight,
      actionText: 'Mở Spotlight',
    },
    {
      title: '📸 Story 24 Giờ & Bộ Lọc Màu Gym',
      shortcut: 'Thanh Story',
      icon: <Sparkles className="w-5 h-5 text-orange-400" />,
      desc: 'Đăng khoảnh khắc tập luyện trong ngày, tự động biến mất sau 24 giờ. Có sẵn bộ lọc màu ấm/tương phản cao, gắn nhãn mục tiêu (#LegDay, #PR) và gắn thẻ máy tập.',
    },
    {
      title: '💬 Nhắn Tin Trực Tiếp & Tư Vấn PT 1-1',
      shortcut: 'Nút Chat góc phải',
      icon: <MessageCircle className="w-5 h-5 text-sky-400" />,
      desc: 'Hỏi đáp kỹ thuật, lịch tập Push-Pull-Legs và mức giá VIP với Master Trainer & Chuyên viên Showroom. Đính kèm thẻ máy tập trực tiếp trong tin nhắn.',
    },
    {
      title: '⚖️ So Sánh Thiết Bị Máy Tập Song Song',
      shortcut: 'Ctrl + S',
      icon: <Scale className="w-5 h-5 text-purple-400" />,
      desc: 'Bảng đối chiếu thông số 2 máy tập cạnh nhau: công suất động cơ, tải trọng, nhóm cơ, giá VIP và chính sách bảo hành chính hãng.',
      action: onOpenCompare,
      actionText: 'Mở Bảng So Sánh',
    },
    {
      title: '🏆 Nhật Ký Kỷ Lục Cá Nhân (PR Tracker)',
      shortcut: 'Ctrl + P',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      desc: 'Lưu giữ mốc tạ tối đa (Bench Press, Squat, Leg Press...) và nút 1-chạm chia sẻ chiến tích lên Bảng tin cộng đồng.',
      action: onOpenPRTracker,
      actionText: 'Xem Kỷ Lục PR',
    },
    {
      title: '🏢 Showroom Toàn Quốc & Đặt Lịch Dùng Thử',
      shortcut: 'Ctrl + B',
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      desc: 'Hệ thống 5+ showroom trên toàn quốc có sẵn hơn 60+ máy tập để trải nghiệm thực tế miễn phí trước khi mua.',
      action: onOpenBooking,
      actionText: 'Đặt Lịch Thử Máy',
    },
    {
      title: '🔔 Trung Tâm Thông Báo Thời Gian Thực',
      shortcut: 'Chuông Navbar',
      icon: <Bell className="w-5 h-5 text-rose-400" />,
      desc: 'Nhận thông báo khi có người thả tim, bình luận bài viết, theo dõi hoặc duyệt lịch hẹn trải nghiệm showroom.',
    },
  ];

  const SHORTCUTS = [
    { key: 'Ctrl + K', mac: '⌘ + K', desc: 'Mở Thanh tìm kiếm Spotlight toàn năng' },
    { key: 'Ctrl + /', mac: '⌘ + /', desc: 'Mở Bảng hướng dẫn tính năng & phím tắt' },
    { key: 'Ctrl + P', mac: '⌘ + P', desc: 'Mở Nhật ký Kỷ lục cá nhân (PR Tracker)' },
    { key: 'Ctrl + S', mac: '⌘ + S', desc: 'Mở Bảng so sánh 2 máy tập song song' },
    { key: 'Ctrl + B', mac: '⌘ + B', desc: 'Mở Form đặt lịch trải nghiệm máy tập miễn phí' },
    { key: 'Ctrl + D', mac: '⌘ + D', desc: 'Chuyển đổi giao diện Sáng / Tối (Light/Dark mode)' },
    { key: 'ESC', mac: 'ESC', desc: 'Đóng tất cả các Modal, Popup hoặc bảng tìm kiếm' },
  ];

  return (
    <div className="fixed inset-0 z-[160] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-orange-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Hướng Dẫn Tính Năng & Phím Tắt
              </h2>
              <p className="text-xs text-slate-400">
                Làm chủ toàn bộ công cụ mạng xã hội & thiết bị GymGear
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

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-950/60 text-xs">
          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'features'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Khám Phá Tính Năng ({FEATURES.length})
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'shortcuts'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" /> Bảng Phím Tắt Nhanh ({SHORTCUTS.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'features' ? (
            <div className="space-y-3.5">
              {FEATURES.map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {item.title}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono shrink-0">
                          {item.shortcut}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {item.action && (
                    <button
                      onClick={() => {
                        onClose();
                        item.action();
                      }}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold border border-slate-700 hover:border-amber-400 transition flex items-center justify-center gap-1 self-end sm:self-center"
                    >
                      {item.actionText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sử dụng phím tắt bất kỳ lúc nào để thao tác nhanh như một Gymer chuyên nghiệp.</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 text-xs">
                {SHORTCUTS.map((sc, i) => (
                  <div
                    key={i}
                    className="p-3.5 flex items-center justify-between gap-4 bg-slate-950/70 hover:bg-slate-800/40 transition"
                  >
                    <span className="text-slate-200 font-medium">{sc.desc}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <kbd className="px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-xs shadow-sm">
                        {sc.key}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">?</kbd> trên bàn phím để mở lại bảng này bất kỳ lúc nào.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Đã Hiểu
          </button>
        </div>

      </div>
    </div>
  );
}
