'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PostCard } from '@/components/PostCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { EditPostModal } from '@/components/EditPostModal';
import WorkoutPRModal from '@/components/WorkoutPRModal';
import SpotlightSearchModal from '@/components/SpotlightSearchModal';
import FeatureGuideModal from '@/components/FeatureGuideModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  fetchUserPosts, 
  fetchDeletedPosts, 
  fetchBookmarkedPosts, 
  fetchUserPRs, 
  UserPRRecord, 
  getFollowersCountByUserId 
} from '@/lib/supabaseDB';
import { SocialPost, Equipment } from '@/types';
import { 
  AlertCircle, 
  Crown, 
  Search, 
  Trash2, 
  Bookmark, 
  Trophy, 
  Settings, 
  Newspaper, 
  Users, 
  Sparkles, 
  Plus, 
  Loader2, 
  CalendarCheck,
  Flame,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

function ProfileContent() {
  const { currentUser, isGuest, requestAuth } = useAuth();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [deletedPosts, setDeletedPosts] = useState<SocialPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<SocialPost[]>([]);
  const [userPRs, setUserPRs] = useState<UserPRRecord[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(38);
  const [activeTab, setActiveTab] = useState<'my-posts' | 'prs' | 'saved' | 'trash'>('my-posts');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const isSaved = searchParams?.get('saved') === 'true' || searchParams?.get('tab') === 'saved';
    if (isSaved) {
      setActiveTab('saved');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isGuest && currentUser) {
      const loadData = async () => {
        setLoading(true);
        const [activeData, trashData, savedData, prData, count] = await Promise.all([
          fetchUserPosts(currentUser.id),
          fetchDeletedPosts(currentUser.id),
          fetchBookmarkedPosts(currentUser.id),
          fetchUserPRs(),
          getFollowersCountByUserId(currentUser.id)
        ]);

        setPosts(activeData);
        setDeletedPosts(trashData);
        setSavedPosts(savedData);
        setUserPRs(prData);
        if (typeof count === 'number' && count > 0) {
          setFollowersCount(count);
        }
        setLoading(false);
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser, isGuest]);

  const handleDeletePost = (deletedPostId: string) => {
    const deleted = posts.find((p) => p.id === deletedPostId);
    setPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
    if (deleted) {
      setDeletedPosts((prev) => [deleted, ...prev]);
    }
  };

  const handleRestorePost = (restoredPostId: string) => {
    const restored = deletedPosts.find((p) => p.id === restoredPostId);
    setDeletedPosts((prev) => prev.filter((p) => p.id !== restoredPostId));
    if (restored) {
      setPosts((prev) => [restored, ...prev]);
    }
  };

  const handleHardDeletePost = (deletedPostId: string) => {
    setDeletedPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
  };

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingModalOpen(true);
  };

  if (isGuest) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <Navbar onSearch={() => {}} onOpenBooking={() => {}} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full shadow-2xl">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Chưa Đăng Nhập</h2>
            <p className="text-sm text-slate-400 mb-6">Bạn cần đăng nhập để quản lý hồ sơ và kỷ lục tập luyện cá nhân.</p>
            <button 
              onClick={() => requestAuth('login')}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition shadow-lg"
            >
              Đăng Nhập Ngay
            </button>
          </div>
        </div>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar 
        onSearch={() => {}} 
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Profile Hero Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          {currentUser.role === 'premium' && (
            <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
              <Crown className="w-32 h-32 text-amber-400 rotate-12" />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img 
                src={currentUser.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=anon'} 
                alt={currentUser.name} 
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 shadow-xl ${
                  currentUser.role === 'premium' ? 'border-amber-400 ring-4 ring-amber-500/20' : 'border-slate-700'
                }`}
              />
              {currentUser.role === 'premium' && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Info and stats */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white truncate">{currentUser.name}</h1>
                {currentUser.role === 'premium' ? (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    <Crown className="w-3 h-3 fill-amber-400" /> VIP Premium
                  </span>
                ) : currentUser.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 text-red-400 font-bold text-[10px] uppercase tracking-wider bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30">
                    <ShieldCheck className="w-3 h-3" /> Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-blue-400 font-semibold text-[10px] uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    <UserCheck className="w-3 h-3" /> Thành viên
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-4">
                <span className="font-semibold text-amber-400">{currentUser.roleTitle || 'Gymer Nhiệt Huyết'}</span>
                <span className="mx-2 text-slate-600">•</span>
                <span>{currentUser.email}</span>
              </p>

              {/* Statistics row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 mb-5 pt-1">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center sm:text-left">
                  <span className="text-xs text-slate-400 block">Bài review</span>
                  <strong className="text-sm sm:text-base font-extrabold text-white">{posts.length}</strong>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center sm:text-left">
                  <span className="text-xs text-slate-400 block">Người theo dõi</span>
                  <strong className="text-sm sm:text-base font-extrabold text-amber-400">{followersCount}</strong>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center sm:text-left">
                  <span className="text-xs text-slate-400 block">Kỷ lục PR</span>
                  <strong className="text-sm sm:text-base font-extrabold text-orange-400">{userPRs.length}</strong>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <Link 
                  href="/settings"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-xs border border-slate-700"
                >
                  <Settings className="w-3.5 h-3.5" /> Chỉnh Sửa Hồ Sơ
                </Link>
                <button
                  onClick={() => setPrModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-xl transition text-xs border border-amber-500/30"
                >
                  <Trophy className="w-3.5 h-3.5" /> Quản Lý PR ({userPRs.length})
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2 min-w-max pb-1">
            <button 
              onClick={() => setActiveTab('my-posts')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'my-posts' 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Newspaper className="w-4 h-4" /> Bài viết của tôi ({posts.length})
            </button>

            <button 
              onClick={() => setActiveTab('prs')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'prs' 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4" /> Kỷ lục PR ({userPRs.length})
            </button>

            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'saved' 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bookmark className="w-4 h-4" /> Đã Lưu ({savedPosts.length})
            </button>

            <button 
              onClick={() => setActiveTab('trash')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'trash' 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Thùng rác ({deletedPosts.length})
            </button>
          </nav>
        </div>

        {/* Tab Content Feed */}
        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span>Đang tải dữ liệu hồ sơ...</span>
            </div>
          ) : activeTab === 'my-posts' ? (
            posts.length > 0 ? (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onViewEquipment={setSelectedEquipment}
                  onBookEquipment={handleOpenBooking}
                  onDelete={handleDeletePost}
                  onEdit={setEditingPost}
                  onBookmark={(postId, bk) => {
                    if (!bk) setSavedPosts(prev => prev.filter(p => p.id !== postId));
                    else setSavedPosts(prev => [post, ...prev.filter(p => p.id !== postId)]);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Bạn chưa có bài viết nào</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy chia sẻ cảm nhận trải nghiệm tập luyện & đánh giá máy gym với cộng đồng nhé!
                </p>
                <Link
                  href="/"
                  className="inline-block px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-400 hover:to-orange-400 transition shadow-md"
                >
                  Về Bảng Tin Đăng Bài
                </Link>
              </div>
            )
          ) : activeTab === 'prs' ? (
            userPRs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {userPRs.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-4 bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl flex flex-col justify-between transition shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white truncate">{pr.exerciseName}</span>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                          🏆 Kỷ Lục
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                          {pr.weightKg} <span className="text-xs text-slate-400 font-bold">KG</span>
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">• {pr.reps} reps</span>
                      </div>
                      {pr.notes && (
                        <p className="text-xs text-slate-300 italic mb-2">"{pr.notes}"</p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      Đạt được ngày: {new Date(pr.achievedAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="text-base font-bold text-white">Chưa ghi nhận kỷ lục cá nhân PR nào</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Ghi nhận mốc tạ tối đa của bạn để theo dõi hành trình tăng trưởng sức mạnh!
                </p>
                <button
                  onClick={() => setPrModalOpen(true)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-400 hover:to-orange-400 transition shadow-md"
                >
                  + Thêm Kỷ Lục PR Đầu Tiên
                </button>
              </div>
            )
          ) : activeTab === 'saved' ? (
            savedPosts.length > 0 ? (
              savedPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onViewEquipment={setSelectedEquipment}
                  onBookEquipment={handleOpenBooking}
                  onBookmark={(postId, bk) => {
                    if (!bk) setSavedPosts(prev => prev.filter(p => p.id !== postId));
                  }}
                />
              ))
            ) : (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white">Chưa có bài viết nào được lưu</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Nhấn biểu tượng Bookmark trên các bài review máy tập để lưu và đọc lại tại đây.
                </p>
              </div>
            )
          ) : (
            deletedPosts.length > 0 ? (
              deletedPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onViewEquipment={setSelectedEquipment}
                  onBookEquipment={handleOpenBooking}
                  inTrash={true}
                  onRestore={handleRestorePost}
                  onHardDelete={handleHardDeletePost}
                />
              ))
            ) : (
              <div className="text-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Thùng rác trống</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Các bài viết bị xoá mềm sẽ xuất hiện tại đây và có thể khôi phục lại bất kỳ lúc nào.
                </p>
              </div>
            )
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
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

      <EditPostModal
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onUpdate={(updated) => {
          setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
        }}
      />

      <WorkoutPRModal
        isOpen={prModalOpen}
        onClose={() => {
          setPrModalOpen(false);
          fetchUserPRs().then(setUserPRs);
        }}
      />

      <SpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        posts={posts}
        onSelectEquipment={(eq) => setSelectedEquipment(eq)}
        onOpenPRTracker={() => setPrModalOpen(true)}
        onOpenCompare={() => {}}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      <FeatureGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onOpenPRTracker={() => setPrModalOpen(true)}
        onOpenCompare={() => {}}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      <AuthModal />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
