'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
import { EditPostModal } from '@/components/EditPostModal';
import { fetchPosts, createPost } from '@/lib/supabaseDB';
import { SocialPost, Equipment, CategoryType } from '@/types';
import { Search, Sparkles } from 'lucide-react';
import StoriesBar from '@/components/StoriesBar';
import ChatWidget from '@/components/ChatWidget';
import EquipmentCompareModal from '@/components/EquipmentCompareModal';
import WorkoutPRModal from '@/components/WorkoutPRModal';
import SpotlightSearchModal from '@/components/SpotlightSearchModal';
import FeatureGuideModal from '@/components/FeatureGuideModal';
import AdvancedFilterBar, { FeedSortOption } from '@/components/AdvancedFilterBar';
import BackToTopButton from '@/components/BackToTopButton';
import { MOCK_EQUIPMENTS } from '@/data/mockData';

// ─── Inner layout (inside AuthProvider) ──────────────────────────────────────
function AppLayout() {
  const { isAdmin, currentUser } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [feedSort, setFeedSort] = useState<FeedSortOption>('latest');
  const [selectedMuscle, setSelectedMuscle] = useState('Tất cả nhóm cơ');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [posts, setPosts] = useState<SocialPost[]>([]);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // 1. Tải bài viết
  useEffect(() => {
    const loadPosts = async () => {
      const userId = currentUser.role !== 'guest' ? currentUser.id : undefined;
      const data = await fetchPosts(userId);
      setPosts(data);
    };
    loadPosts();
  }, [currentUser.id]);

  // 2. Lắng nghe phím tắt toàn năng (Global Shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua khi người dùng đang nhập liệu trong ô input/textarea thông thường
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Ctrl + K hoặc Cmd + K (Spotlight)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSpotlightOpen(prev => !prev);
        return;
      }

      // Ctrl + / hoặc phím ? khi không focus input (Bảng Hướng Dẫn)
      if (((e.ctrlKey || e.metaKey) && e.key === '/') || (!isInput && e.key === '?')) {
        e.preventDefault();
        setGuideOpen(prev => !prev);
        return;
      }

      if (!isInput) {
        // Ctrl + P (PR Tracker)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
          e.preventDefault();
          setPrModalOpen(true);
        }
        // Ctrl + S (Compare)
        else if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
          e.preventDefault();
          setCompareModalOpen(true);
        }
        // Ctrl + B (Booking)
        else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
          e.preventDefault();
          setBookingEquipment(null);
          setBookingModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Thuật toán Lọc đa chiều nâng cao
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Lọc danh mục
      if (activeCategory !== 'all') {
        if (!post.taggedEquipment || post.taggedEquipment.category !== activeCategory) return false;
      }

      // Lọc từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const ok =
          post.content.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q) ||
          post.taggedEquipment?.name.toLowerCase().includes(q) ||
          post.taggedEquipment?.brand.toLowerCase().includes(q);
        if (!ok) return false;
      }

      // Lọc sort tabs
      if (feedSort === 'trending' && post.likesCount < 50) return false;
      if (feedSort === 'verified' && !post.author.isVerified) return false;
      if (feedSort === 'tagged' && !post.taggedEquipment) return false;

      // Lọc theo nhóm cơ
      if (selectedMuscle !== 'Tất cả nhóm cơ') {
        const eqMuscles = post.taggedEquipment?.specifications?.targetMuscles || [];
        const match = eqMuscles.some(m => selectedMuscle.toLowerCase().includes(m.toLowerCase()));
        if (!match) return false;
      }

      // Lọc theo khoảng giá
      if (selectedPriceRange !== 'all' && post.taggedEquipment) {
        const pr = post.taggedEquipment.priceRange;
        if (selectedPriceRange === 'under-20' && !pr.includes('1') && !pr.includes('2')) return false;
        if (selectedPriceRange === 'above-40' && !pr.includes('4') && !pr.includes('5') && !pr.includes('6') && !pr.includes('7') && !pr.includes('8') && !pr.includes('9')) return false;
      }

      return true;
    });
  }, [posts, searchQuery, activeCategory, feedSort, selectedMuscle, selectedPriceRange]);

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

  const handleDeletePost = (deletedPostId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
  };

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingModalOpen(true);
  };

  const handleOpenSaved = () => {
    router.push('/profile?saved=true');
  };

  const handleResetFilters = () => {
    setSelectedMuscle('Tất cả nhóm cơ');
    setSelectedPriceRange('all');
    setFeedSort('latest');
    setActiveCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">

      {/* Navbar */}
      <Navbar
        onSearch={setSearchQuery}
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdminDashboard={isAdmin ? () => setAdminDashboardOpen(true) : undefined}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
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
              onOpenSaved={handleOpenSaved}
              onOpenPRTracker={() => setPrModalOpen(true)}
              onOpenCompare={() => setCompareModalOpen(true)}
            />
          </div>

          {/* Center feed */}
          <div className="lg:col-span-6 space-y-5">

            {/* Stories strip */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 overflow-hidden">
              <StoriesBar />
            </div>

            <CreatePostCard onAddPost={handleAddPost} />

            {/* Advanced Multi-faceted Filter Bar */}
            <AdvancedFilterBar
              currentSort={feedSort}
              onSortChange={setFeedSort}
              totalCount={filteredPosts.length}
              selectedMuscle={selectedMuscle}
              onSelectMuscle={setSelectedMuscle}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              onResetFilters={handleResetFilters}
            />

            {/* Posts Stream */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onViewEquipment={setSelectedEquipment}
                    onBookEquipment={handleOpenBooking}
                    onDelete={handleDeletePost}
                    onEdit={setEditingPost}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Không có bài review nào phù hợp với bộ lọc</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy thử chọn khoảng giá khác, đặt lại bộ lọc nhóm cơ hoặc bấm Xoá Bộ Lọc để xem toàn bộ feed.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/30 hover:bg-amber-500/20 transition shadow-sm"
                >
                  Xoá Tất Cả Bộ Lọc
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

      {/* ── Modals & Widgets ──────────────────────────────────────────────── */}
      
      {/* Spotlight Universal Search (Ctrl + K) */}
      <SpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        posts={posts}
        onSelectEquipment={(eq) => setSelectedEquipment(eq)}
        onSelectPost={(post) => {
          // Focus scroll tới post
          const el = document.getElementById(`post-${post.id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPRTracker={() => setPrModalOpen(true)}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Feature Guide & Shortcuts (Ctrl + /) */}
      <FeatureGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onOpenPRTracker={() => setPrModalOpen(true)}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedEquipment={bookingEquipment}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onUpdate={(updated) => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))}
      />

      {/* Equipment Comparison Modal */}
      <EquipmentCompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Workout PR Tracker Modal */}
      <WorkoutPRModal
        isOpen={prModalOpen}
        onClose={() => setPrModalOpen(false)}
        onPRSharedToFeed={async () => {
          const updated = await fetchPosts();
          setPosts(updated);
        }}
      />

      {/* Direct Gym Chat Widget */}
      <ChatWidget
        onOpenEquipmentDetail={(id) => {
          const eq = MOCK_EQUIPMENTS.find(e => e.id === id);
          if (eq) setSelectedEquipment(eq);
        }}
      />

      {/* Nút Cuộn Nhanh Lên Đầu Trang kèm Tiến Trình Đọc */}
      <BackToTopButton />

      {/* AuthModal */}
      <AuthModal />
    </div>
  );
}

// ─── Root export ───────────────────────────────────────────────────────────────
export default function Home() {
  return <AppLayout />;
}
