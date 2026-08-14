'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PostCard } from '@/components/PostCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { fetchUserById, fetchUserPosts, isFollowingUser, toggleFollowUser } from '@/lib/supabaseDB';
import { SocialPost, Equipment, UserAuthor } from '@/types';
import { Crown, ShieldCheck, UserCheck, Loader2, ArrowLeft, UserCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, requestAuth } = useAuth();

  const [profileUser, setProfileUser] = useState<UserAuthor | null>(null);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingModalOpen(true);
  };

  useEffect(() => {
    if (!id) return;

    // Nếu là profile của chính mình → redirect
    if (currentUser && currentUser.role !== 'guest' && currentUser.id === id) {
      router.replace('/profile');
      return;
    }

    const load = async () => {
      setLoading(true);
      const [user, userPosts] = await Promise.all([
        fetchUserById(id),
        fetchUserPosts(id),
      ]);

      // load followers count and follow status
      try {
        const resCount = await fetch(`/api/follow?userId=${id}`);
        const jsonCount = await resCount.json();
        if (typeof jsonCount.followersCount === 'number') setFollowersCount(jsonCount.followersCount);
        else setFollowersCount(0);

        const following = await isFollowingUser(id);
        setIsFollowing(!!following);
      } catch (e) { console.error('Failed loading follow info', e); }

      if (!user) {
        setNotFound(true);
      } else {
        setProfileUser(user as UserAuthor);
        // Chỉ hiện bài không bị xóa
        setPosts(userPosts.filter((p: SocialPost) => !(p as any).is_deleted));
      }
      setLoading(false);
    };

    load();
  }, [id, currentUser]);

  const roleBadge = () => {
    if (!profileUser) return null;
    if (profileUser.role === 'premium') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
        <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> VIP
      </span>
    );
    if (profileUser.role === 'admin') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
        <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> ADMIN
      </span>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar onSearch={() => {}} onOpenBooking={() => handleOpenBooking(null)} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : notFound ? (
          <div className="text-center py-32 space-y-4">
            <UserCircle2 className="w-16 h-16 text-slate-700 mx-auto" />
            <h2 className="text-xl font-bold text-white">Không tìm thấy người dùng</h2>
            <p className="text-slate-400 text-sm">Tài khoản không tồn tại hoặc đã bị xóa.</p>
            <Link href="/" className="inline-block mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors">
              Về trang chủ
            </Link>
          </div>
        ) : profileUser && (
          <>
            {/* Profile Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden">
              {profileUser.role === 'premium' && (
                <div className="absolute top-0 right-0 p-4 pointer-events-none">
                  <Crown className="w-24 h-24 text-amber-500/10 rotate-12" />
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <img
                  src={profileUser.avatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profileUser.id}`}
                  alt={profileUser.name}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 ${
                    profileUser.role === 'premium' ? 'border-amber-400' :
                    profileUser.role === 'admin' ? 'border-red-500' : 'border-slate-800'
                  }`}
                />
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-white">{profileUser.name}</h1>
                    {profileUser.isVerified && (
                      <UserCheck className="w-5 h-5 text-sky-400" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-slate-400 mb-4">
                    <span className="font-bold text-amber-400">{profileUser.roleTitle || 'Thành viên'}</span>
                    {roleBadge() && <><span>•</span>{roleBadge()}</>}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 rounded-xl text-xs text-slate-400 border border-slate-700">
                    <span className="font-bold text-white">{posts.length}</span> bài viết
                  </div>
                  <div className="inline-flex items-center gap-2 ml-3">
                    <div className="px-3 py-1 rounded-xl bg-slate-800 text-sm text-slate-300 border border-slate-700">{followersCount} người theo dõi</div>
                    <button
                      onClick={async () => {
                        if (!currentUser) return requestAuth('login');
                        setFollowLoading(true);
                        try {
                          const j = await toggleFollowUser(id);
                          setIsFollowing(!!j.following);
                          // Fetch authoritative followers count from server API (uses service role when available)
                          try {
                            const resp = await fetch(`/api/follow?userId=${id}`);
                            const body = await resp.json();
                            if (typeof body.followersCount === 'number') setFollowersCount(body.followersCount);
                            else setFollowersCount(prev => prev + (j.following ? 1 : -1));
                          } catch (err) {
                            console.error('Failed refreshing followers count', err);
                            setFollowersCount(prev => prev + (j.following ? 1 : -1));
                          }
                        } catch (e) { console.error(e); }
                        setFollowLoading(false);
                      }}
                      disabled={followLoading}
                      className={`px-4 py-2 rounded-xl font-bold text-sm ${isFollowing ? 'bg-slate-700 text-white border border-slate-600' : 'bg-amber-500 text-slate-950'} ${followLoading ? 'opacity-60 cursor-wait' : ''}`}
                    >
                      {followLoading ? 'Đang xử lý...' : (isFollowing ? 'Đang theo dõi' : 'Theo dõi')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wider text-slate-400">
              Bài viết của {profileUser.name}
            </h2>
            <div className="space-y-4">
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
                <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-sm">Người dùng này chưa có bài viết nào.</p>
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
    </div>
  );
}
