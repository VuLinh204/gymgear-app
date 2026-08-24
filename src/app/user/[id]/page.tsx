'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PostCard } from '@/components/PostCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { BookingModal } from '@/components/BookingModal';
import SpotlightSearchModal from '@/components/SpotlightSearchModal';
import FeatureGuideModal from '@/components/FeatureGuideModal';
import FollowListModal from '@/components/FollowListModal';
import { AuthModal } from '@/components/AuthModal';
import { fetchUserById, fetchUserPosts, isFollowingUser, toggleFollowUser, getFollowersCountByUserId, getFollowingCountByUserId } from '@/lib/supabaseDB';
import { SocialPost, Equipment, UserAuthor } from '@/types';
import { Crown, ShieldCheck, UserCheck, Loader2, ArrowLeft, UserCircle2, UserPlus, Users, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, requestAuth } = useAuth();

  const [profileUser, setProfileUser] = useState<UserAuthor | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<'followers' | 'following'>('followers');

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingModalOpen(true);
  };

  useEffect(() => {
    if (!id) return;

    // Nếu là profile của chính mình → chuyển về trang /profile cá nhân
    if (currentUser && currentUser.role !== 'guest' && currentUser.id === id) {
      router.replace('/profile');
      return;
    }

    const load = async () => {
      setLoading(true);
      const [user, userPosts, count, following, fgCount] = await Promise.all([
        fetchUserById(id),
        fetchUserPosts(id),
        getFollowersCountByUserId(id),
        isFollowingUser(id),
        getFollowingCountByUserId(id),
      ]);

      if (typeof count === 'number') setFollowersCount(count);
      if (typeof fgCount === 'number') setFollowingCount(fgCount);
      setIsFollowing(!!following);

      if (!user) {
        setNotFound(true);
      } else {
        setProfileUser(user as UserAuthor);
        setPosts(userPosts.filter((p: SocialPost) => !(p as any).is_deleted));
      }
      setLoading(false);
    };

    load();
  }, [id, currentUser, router]);

  const handleFollow = async () => {
    if (!currentUser || currentUser.role === 'guest') {
      return requestAuth('login');
    }
    setFollowLoading(true);
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount(prev => Math.max(0, prev + (nextState ? 1 : -1)));

    try {
      const res = await toggleFollowUser(id);
      setIsFollowing(!!res.following);
      setFollowersCount(res.followersCount);
    } catch (e) {
      console.error(e);
      setIsFollowing(!nextState);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar 
        onSearch={() => {}} 
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay Lại
        </button>

        {loading ? (
          <div className="space-y-6">
            {/* Profile Hero Skeleton */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-pulse space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-800 border-4 border-slate-700/50 shrink-0" />
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="h-7 bg-slate-800 rounded-lg w-44" />
                    <div className="h-6 bg-slate-800/60 rounded-full w-28" />
                  </div>
                  <div className="h-4 bg-slate-800/60 rounded w-56 mx-auto sm:mx-0" />
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                    <div className="h-9 bg-slate-800/70 rounded-2xl w-32" />
                    <div className="h-9 bg-slate-800/70 rounded-2xl w-32" />
                    <div className="h-9 bg-slate-800/70 rounded-2xl w-28" />
                  </div>
                </div>
              </div>
            </div>

            {/* Post Skeletons */}
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-800" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-slate-800 rounded w-32" />
                      <div className="h-3 bg-slate-800/50 rounded w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-800 rounded w-full" />
                    <div className="h-3.5 bg-slate-800/70 rounded w-3/4" />
                  </div>
                  <div className="w-full h-52 bg-slate-800/60 rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
        ) : notFound ? (
          <div className="text-center py-24 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
            <UserCircle2 className="w-16 h-16 text-slate-700 mx-auto" />
            <h2 className="text-xl font-bold text-white">Không Tìm Thấy Người Dùng</h2>
            <p className="text-slate-400 text-sm">Tài khoản này không tồn tại hoặc đã đổi tên.</p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs transition shadow-md">
              Về Trang Chủ
            </Link>
          </div>
        ) : profileUser && (
          <>
            {/* Profile Hero Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              {profileUser.role === 'premium' && (
                <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                  <Crown className="w-32 h-32 text-amber-400 rotate-12" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <img
                  src={profileUser.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profileUser.id}`}
                  alt={profileUser.name}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 shadow-xl ${
                    profileUser.role === 'premium' ? 'border-amber-400 ring-4 ring-amber-500/20' :
                    profileUser.role === 'admin' ? 'border-red-500 ring-4 ring-red-500/20' : 'border-slate-700'
                  }`}
                />
                
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-white truncate">{profileUser.name}</h1>
                    {profileUser.role === 'premium' ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                        <Crown className="w-3 h-3 fill-amber-400" /> VIP Premium
                      </span>
                    ) : profileUser.role === 'admin' ? (
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
                    <span className="font-semibold text-amber-400">{profileUser.roleTitle || 'Gymer Nhiệt Huyết'}</span>
                  </p>

                  {/* Stats & Follow Action row */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 pt-1">
                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center sm:text-left">
                      <span className="text-[11px] text-slate-400 block">Bài viết</span>
                      <strong className="text-sm sm:text-base font-extrabold text-white">{posts.length}</strong>
                    </div>

                    <button
                      onClick={() => {
                        setFollowModalTab('followers');
                        setFollowModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition text-center sm:text-left group cursor-pointer"
                      title="Nhấp để xem người theo dõi"
                    >
                      <span className="text-[11px] text-slate-400 block group-hover:text-slate-200">Người theo dõi</span>
                      <strong className="text-sm sm:text-base font-extrabold text-amber-400 group-hover:text-amber-300">{followersCount}</strong>
                    </button>

                    <button
                      onClick={() => {
                        setFollowModalTab('following');
                        setFollowModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition text-center sm:text-left group cursor-pointer"
                      title="Nhấp để xem đang theo dõi"
                    >
                      <span className="text-[11px] text-slate-400 block group-hover:text-slate-200">Đang theo dõi</span>
                      <strong className="text-sm sm:text-base font-extrabold text-sky-400 group-hover:text-sky-300">{followingCount}</strong>
                    </button>

                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-5 py-2 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 ${
                        isFollowing 
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700' 
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400'
                      }`}
                    >
                      {followLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đang Theo Dõi</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ Theo Dõi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Posts Section */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-amber-400" /> Danh Sách Bài Review Của {profileUser.name} ({posts.length})
              </h2>

              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onViewEquipment={setSelectedEquipment}
                    onBookEquipment={handleOpenBooking}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                  <Newspaper className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                  <p className="text-slate-400 text-sm font-semibold">Người dùng này chưa đăng bài viết nào.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onOpenBooking={handleOpenBooking}
        />
      )}
      
      {bookingModalOpen && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => { setBookingModalOpen(false); setBookingEquipment(null); }}
          selectedEquipment={bookingEquipment}
        />
      )}

      <SpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        posts={posts}
        onSelectEquipment={(eq) => setSelectedEquipment(eq)}
        onOpenPRTracker={() => {}}
        onOpenCompare={() => {}}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      <FeatureGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onOpenPRTracker={() => {}}
        onOpenCompare={() => {}}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      <FollowListModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        userId={id}
        userName={profileUser?.name}
        initialTab={followModalTab}
        onCountsLoaded={(fc, fg) => {
          setFollowersCount(fc);
          setFollowingCount(fg);
        }}
      />

      <AuthModal />
    </div>
  );
}
