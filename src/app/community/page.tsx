'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PostCard } from '@/components/PostCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { fetchPosts, fetchCommunityStats } from '@/lib/supabaseDB';
import { SocialPost, Equipment } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { Users, Dumbbell, Award, TrendingUp, MessageSquare } from 'lucide-react';

export default function CommunityPage() {
  const { currentUser, isAdmin } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'trending'>('all');

  // Dynamic Community Stats from DB
  const [stats, setStats] = useState({
    membersCount: '2,400+',
    reviewsCount: '8,900+',
    gymOwnersCount: '320+',
    ptsCount: '150+'
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userId = currentUser.role !== 'guest' ? currentUser.id : undefined;
      const [data, dbStats] = await Promise.all([
        fetchPosts(userId),
        fetchCommunityStats()
      ]);
      setPosts(data);
      setStats(dbStats);
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  const STATS_ITEMS = [
    { label: 'Thành viên', value: stats.membersCount, icon: Users, color: 'text-blue-400' },
    { label: 'Bài review & Đánh giá', value: stats.reviewsCount, icon: MessageSquare, color: 'text-amber-400' },
    { label: 'Chủ Phòng Gym', value: stats.gymOwnersCount, icon: Dumbbell, color: 'text-emerald-400' },
    { label: 'HLV Cá Nhân (PT)', value: stats.ptsCount, icon: Award, color: 'text-purple-400' },
  ];

  const filtered = filter === 'trending'
    ? posts.filter(p => p.likesCount >= 5)
    : posts;

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar onSearch={() => {}} onOpenBooking={() => handleOpenBooking(null)} onOpenAdminDashboard={isAdmin ? () => setAdminDashboardOpen(true) : undefined} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            CỘNG ĐỒNG GYMGEAR
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Hội Chủ Phòng Gym & HLV PT</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Nơi chia sẻ kinh nghiệm mở phòng gym, chọn máy tập chuyên nghiệp và kết nối với các huấn luyện viên hàng đầu Việt Nam.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STATS_ITEMS.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <Icon className={`w-5 h-5 mx-auto ${stat.color}`} />
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] text-slate-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
          {(['all', 'trending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Tất cả bài viết' : <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Nổi bật</span>}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 font-mono">{filtered.length} bài viết</span>
        </div>


        {/* Posts feed */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onViewEquipment={setSelectedEquipment}
                onBookEquipment={handleOpenBooking}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Chua co bai viet nao</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {selectedEquipment && (
        <EquipmentDetailModal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} onOpenBooking={handleOpenBooking} />
      )}
      <BookingModal isOpen={bookingOpen} onClose={() => { setBookingOpen(false); setBookingEquipment(null); }} selectedEquipment={bookingEquipment} />
      <AdminDashboardModal isOpen={adminDashboardOpen} onClose={() => setAdminDashboardOpen(false)} />
    </div>
  );
}
