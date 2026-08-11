'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { SocialSidebarLeft } from '@/components/SocialSidebarLeft';
import { SocialSidebarRight } from '@/components/SocialSidebarRight';
import { CreatePostCard } from '@/components/CreatePostCard';
import { PostCard } from '@/components/PostCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { fetchPosts, createPost } from '@/lib/supabaseDB';
import { SocialPost, Equipment, CategoryType } from '@/types';
import { Search } from 'lucide-react';

// ─── Inner layout (inside AuthProvider) ──────────────────────────────────────
function AppLayout() {
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [feedFilter, setFeedFilter] = useState<'latest' | 'trending' | 'verified'>('latest');
  const [posts, setPosts] = useState<SocialPost[]>([]);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (activeCategory !== 'all') {
        if (!post.taggedEquipment || post.taggedEquipment.category !== activeCategory) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const ok =
          post.content.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q) ||
          post.taggedEquipment?.name.toLowerCase().includes(q) ||
          post.taggedEquipment?.brand.toLowerCase().includes(q);
        if (!ok) return false;
      }
      if (feedFilter === 'trending' && post.likesCount < 100) return false;
      if (feedFilter === 'verified' && !post.author.isVerified) return false;
      return true;
    });
  }, [posts, searchQuery, activeCategory, feedFilter]);

  const handleAddPost = async (newPost: SocialPost) => {
    const success = await createPost(
      newPost.author.id,
      newPost.content,
      newPost.rating || 5,
      newPost.taggedEquipment?.id,
      newPost.images
    );
    if (success) {
      const updated = await fetchPosts();
      setPosts(updated);
    }
  };

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">

      {/* Navbar (reads auth from context internally) */}
      <Navbar
        onSearch={setSearchQuery}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdminDashboard={isAdmin ? () => setAdminDashboardOpen(true) : undefined}
      />

      {/* 3-column feed layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <SocialSidebarLeft
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onOpenBooking={() => handleOpenBooking(null)}
            />
          </div>

          {/* Center feed */}
          <div className="lg:col-span-6 space-y-5">

            <CreatePostCard onAddPost={handleAddPost} />

            {/* Feed filter bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {(['latest', 'trending', 'verified'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFeedFilter(f)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      feedFilter === f
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'latest' ? '🔥 Mới Nhất' : f === 'trending' ? '⭐ Hot (>100 👍)' : '✓ Đã Xác Minh'}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:block">
                {filteredPosts.length} bài (DB)
              </span>
            </div>

            {/* Posts */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onViewEquipment={setSelectedEquipment}
                    onBookEquipment={handleOpenBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Không có bài review nào phù hợp</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thử từ khoá khác hoặc xoá bộ lọc để xem toàn bộ feed.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); setFeedFilter('latest'); }}
                  className="px-4 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/30 hover:bg-amber-500/20 transition"
                >
                  Xoá Bộ Lọc
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <SocialSidebarRight
              onViewEquipment={setSelectedEquipment}
              onOpenBooking={handleOpenBooking}
            />
          </div>

        </div>
      </div>

      <Footer />

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <EquipmentDetailModal
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        onOpenBooking={handleOpenBooking}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedEquipment={bookingEquipment}
      />

      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
      />

      {/* AuthModal tự đọc trạng thái từ AuthContext — không cần props */}
      <AuthModal />
    </div>
  );
}

// ─── Root export (wraps with AuthProvider) ────────────────────────────────────
export default function Home() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
