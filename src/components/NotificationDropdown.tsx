'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  CalendarCheck, 
  ShieldAlert, 
  Dumbbell, 
  CheckCheck, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { 
  AppNotification, 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/lib/supabaseDB';

interface NotificationDropdownProps {
  onOpenBooking?: (equipmentId?: string) => void;
  onOpenPost?: (postId: string) => void;
}

export default function NotificationDropdown({ onOpenBooking, onOpenPost }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'social' | 'booking'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifs = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifs();
    // Poll nhẹ 15 giây 1 lần
    const interval = setInterval(loadNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  // Xử lý click ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }

    if (notif.type === 'booking' && onOpenBooking) {
      onOpenBooking(notif.targetId);
      setIsOpen(false);
    } else if ((notif.type === 'like' || notif.type === 'comment') && notif.targetId && onOpenPost) {
      onOpenPost(notif.targetId);
      setIsOpen(false);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'social') return n.type === 'like' || n.type === 'comment' || n.type === 'follow' || n.type === 'pr';
    if (activeTab === 'booking') return n.type === 'booking' || n.type === 'system';
    return true;
  });

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return 'Vừa xong';
    if (h < 1) return `${m} phút trước`;
    if (d < 1) return `${h} giờ trước`;
    return `${d} ngày trước`;
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />;
      case 'booking':
        return <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'pr':
        return <Dumbbell className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Chuông Thông Báo */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors focus:outline-none"
        title="Thông báo"
        aria-label="Thông báo"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">Thông Báo</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-medium text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 p-1"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Đã đọc hết
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors sm:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'social'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tương tác
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'booking'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lịch Showroom
            </button>
          </div>

          {/* List Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-800/50 ${
                    !notif.isRead ? 'bg-amber-500/5' : ''
                  }`}
                >
                  {/* Actor Avatar + Badge Icon */}
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={notif.actorAvatar || '/default-avatar.svg'}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow">
                      {getNotifIcon(notif.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {notif.actorName || notif.title}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {notif.content}
                    </p>
                  </div>

                  {/* Unread indicator dot */}
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2 self-start shadow-sm shadow-amber-400" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 px-4 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-400">Không có thông báo nào</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Bạn sẽ nhận thông báo khi có tương tác mới.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 text-center bg-slate-900/90 border-t border-slate-800">
            <span className="text-[11px] text-slate-500">
              ⚡ Hệ thống thông báo tự động cập nhật
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
