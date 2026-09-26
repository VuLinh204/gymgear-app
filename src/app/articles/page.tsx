'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Flame, MessageSquareText, Users } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { fetchPosts } from '@/lib/supabaseDB';
import { Equipment, SocialPost } from '@/types';

const engagementScore = (post: SocialPost) =>
  post.likesCount * 2 + post.commentsCount * 3 + post.sharesCount;

export default function ArticlesPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPosts(currentUser.role === 'guest' ? undefined : currentUser.id)
      .then((data) => {
        if (cancelled) return;
        const communityPosts = data.filter((post: SocialPost) =>
          currentUser.role === 'guest' || post.author.id !== currentUser.id
        );
        setPosts(communityPosts);
      })
      .catch((error) => {
        console.error('Unable to load community articles:', error);
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [currentUser.id, currentUser.role]);

  const { featuredPosts, otherPosts } = useMemo(() => {
    const featured = posts
      .filter((post) => post.isPinned || engagementScore(post) > 0)
      .sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)) || engagementScore(b) - engagementScore(a))
      .slice(0, 3);
    const featuredIds = new Set(featured.map((post) => post.id));

    return {
      featuredPosts: featured,
      otherPosts: posts.filter((post) => !featuredIds.has(post.id)),
    };
  }, [posts]);

  const openBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onSearch={() => {}} onOpenBooking={() => openBooking(null)} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/community" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Trở lại cộng đồng
        </Link>

        <header className="mb-8 mt-7 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-600 px-3 py-1 text-xs font-bold text-white">
            <Users className="h-3.5 w-3.5" /> CHIA SẺ TỪ CỘNG ĐỒNG GYMGEAR
          </p>
          <h1 className="text-3xl font-black sm:text-5xl">Bài viết từ cộng đồng</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Bài viết được lấy trực tiếp từ chia sẻ của thành viên GymGear. Mục nổi bật xếp hạng theo lượt thích, bình luận, chia sẻ và bài được ghim.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20" aria-label="Đang tải bài viết">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-500" />
            <h2 className="text-lg font-bold text-white">Chưa có bài chia sẻ từ thành viên khác</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Khi thành viên đăng bài chia sẻ, nội dung sẽ tự xuất hiện tại đây.
            </p>
            <Link href="/community" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">
              <MessageSquareText className="h-4 w-4" /> Đến cộng đồng
            </Link>
          </section>
        ) : (
          <>
            {featuredPosts.length > 0 && (
              <section className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <h2 className="text-xl font-black text-white">Bài viết đang nổi bật</h2>
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-300">TỪ CỘNG ĐỒNG</span>
                </div>
                <div className="space-y-4">
                  {featuredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onViewEquipment={setSelectedEquipment}
                      onBookEquipment={openBooking}
                    />
                  ))}
                </div>
              </section>
            )}

            {otherPosts.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-black text-white">Bài viết mới từ thành viên</h2>
                </div>
                <div className="space-y-4">
                  {otherPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onViewEquipment={setSelectedEquipment}
                      onBookEquipment={openBooking}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
      <EquipmentDetailModal
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        onOpenBooking={(equipment) => { setSelectedEquipment(null); openBooking(equipment); }}
      />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => { setBookingOpen(false); setBookingEquipment(null); }}
        selectedEquipment={bookingEquipment}
      />
    </div>
  );
}
