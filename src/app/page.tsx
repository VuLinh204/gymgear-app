'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
import { fetchPosts, createPost, getFollowingUserIds } from '@/lib/supabaseDB';
import { SocialPost, Equipment, CategoryType } from '@/types';
import { Search, Sparkles, Loader2, Users, UserPlus } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  // Infinite Scroll state
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Following user IDs
  const [followingUserIds, setFollowingUserIds] = useState<Set<string>>(new Set());

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

  // 1. Tải bài viết & danh sách đang theo dõi
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userId = currentUser.role !== 'guest' ? currentUser.id : undefined;
        const [postsData, followIds] = await Promise.all([
          fetchPosts(userId),
          getFollowingUserIds(userId),
        ]);
        setPosts(postsData);
        setFollowingUserIds(followIds);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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
      if (feedSort === 'following' && !followingUserIds.has(post.author.id)) return false;

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
  }, [posts, searchQuery, activeCategory, feedSort, selectedMuscle, selectedPriceRange, followingUserIds]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, activeCategory, feedSort, selectedMuscle, selectedPriceRange]);

  // Infinite Scrolling IntersectionObserver
  useEffect(() => {
    if (loading || visibleCount >= filteredPosts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 5, filteredPosts.length));
            setLoadingMore(false);
          }, 350);
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading, visibleCount, filteredPosts.length, loadingMore]);

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
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* Left sidebar — lg: col-4, xl: col-3 */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 self-stretch">
            <div className="sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto sidebar-scroll pb-10">
              <SocialSidebarLeft
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                onOpenBooking={() => handleOpenBooking(null)}
                onOpenSaved={handleOpenSaved}
                onOpenPRTracker={() => setPrModalOpen(true)}
                onOpenCompare={() => setCompareModalOpen(true)}
              />
            </div>
          </div>

          {/* Center feed — lg: col-8, xl: col-6 */}
          <div className="col-span-1 lg:col-span-8 xl:col-span-6 space-y-5 min-w-0 max-w-3xl mx-auto w-full">

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
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 animate-pulse"
                  >
                    {/* Author header skeleton */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700/50" />
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4 bg-slate-800 rounded w-28" />
                            <div className="h-3.5 bg-slate-800/60 rounded w-16" />
                          </div>
                          <div className="h-3 bg-slate-800/50 rounded w-20" />
                        </div>
                      </div>
                      <div className="w-6 h-6 bg-slate-800 rounded-full" />
                    </div>

                    {/* Content text skeleton */}
                    <div className="space-y-2 pt-1">
                      <div className="h-3.5 bg-slate-800 rounded w-full" />
                      <div className="h-3.5 bg-slate-800/70 rounded w-5/6" />
                      <div className="h-3.5 bg-slate-800/40 rounded w-2/3" />
                    </div>

                    {/* Media container skeleton */}
                    <div className="w-full h-64 bg-slate-800/60 rounded-2xl border border-slate-800" />

                    {/* Footer action bar skeleton */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-7 bg-slate-800 rounded-xl w-16" />
                        <div className="h-7 bg-slate-800 rounded-xl w-16" />
                        <div className="h-7 bg-slate-800 rounded-xl w-16" />
                      </div>
                      <div className="h-7 bg-slate-800 rounded-xl w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.slice(0, visibleCount).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onViewEquipment={setSelectedEquipment}
                    onBookEquipment={handleOpenBooking}
                    onDelete={handleDeletePost}
                    onEdit={setEditingPost}
                  />
                ))}

                {/* Infinite Scrolling Sentinel & Loader */}
                {visibleCount < filteredPosts.length && (
                  <div
                    ref={loadMoreRef}
                    className="py-6 flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold animate-pulse"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Đang tải thêm bài viết ({visibleCount}/{filteredPosts.length})...</span>
                  </div>
                )}

                {/* End of Feed Badge */}
                {visibleCount >= filteredPosts.length && filteredPosts.length > 0 && (
                  <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-3">
                    <div className="h-px bg-slate-800/80 w-16 sm:w-24" />
                    <span className="font-medium text-slate-400">
                      🎉 Bạn đã xem hết tất cả {filteredPosts.length} bài viết!
                    </span>
                    <div className="h-px bg-slate-800/80 w-16 sm:w-24" />
                  </div>
                )}
              </div>
            ) : feedSort === 'following' ? (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
                <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                  <Users className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Chưa có bài viết từ người bạn theo dõi</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Hãy theo dõi các huấn luyện viên (PT), reviewer và chủ phòng gym để không bỏ lỡ những bài đánh giá thiết bị mới nhất của họ!
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setFeedSort('latest')}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    Khám Phá Bài Viết Mới
                  </button>
                </div>
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
                  className="px-4 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/30 hover:bg-amber-500/20 transition shadow-sm cursor-pointer"
                >
                  Xoá Tất Cả Bộ Lọc
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar — xl only */}
          <div className="hidden xl:block xl:col-span-3 self-stretch">
            <div className="sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto sidebar-scroll pb-10">
              <SocialSidebarRight
                onViewEquipment={handleOpenBooking}
                onOpenBooking={() => handleOpenBooking(null)}
              />
            </div>
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
          const eq = MOCK_EQUIPMENTS.find((e: Equipment) => e.id === id);
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
