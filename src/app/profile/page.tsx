'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PostCard } from '@/components/PostCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { fetchUserPosts, fetchDeletedPosts, fetchBookmarkedPosts } from '@/lib/supabaseDB';
import { SocialPost, Equipment } from '@/types';
import { AlertCircle, User, Loader2, Crown, Search, Trash2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { EditPostModal } from '@/components/EditPostModal';

export default function ProfilePage() {
  const { currentUser, isGuest, requestAuth } = useAuth();
  
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [deletedPosts, setDeletedPosts] = useState<SocialPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<'my-posts' | 'saved' | 'trash'>('my-posts');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

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

  useEffect(() => {
    if (!isGuest && currentUser) {
      const loadData = async () => {
        setLoading(true);
        const [activeData, trashData, savedData] = await Promise.all([
          fetchUserPosts(currentUser.id),
          fetchDeletedPosts(currentUser.id),
          fetchBookmarkedPosts(currentUser.id)
        ]);
        setPosts(activeData);
        setDeletedPosts(trashData);
        setSavedPosts(savedData);
        setLoading(false);
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser, isGuest]);

  if (isGuest) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <Navbar onSearch={() => {}} onOpenBooking={() => {}} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Chưa đăng nhập</h2>
            <p className="text-sm text-slate-400 mb-6">Bạn cần đăng nhập để xem hồ sơ cá nhân.</p>
            <button 
              onClick={() => requestAuth('login')}
              className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleOpenBooking = (equipment?: Equipment | null) => {
    setBookingEquipment(equipment || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar onSearch={() => {}} onOpenBooking={() => handleOpenBooking(null)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden">
          {currentUser.role === 'premium' && (
            <div className="absolute top-0 right-0 p-4">
              <Crown className="w-24 h-24 text-amber-500/10 rotate-12" />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <img 
              src={currentUser.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=anon'} 
              alt={currentUser.name} 
              className={`w-28 h-28 rounded-full object-cover border-4 ${
                currentUser.role === 'premium' ? 'border-amber-400' : 'border-slate-800'
              }`}
            />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-slate-400 mb-4">
                <span className="font-bold text-amber-400">{currentUser.roleTitle || 'Thành viên mới'}</span>
                <span>•</span>
                <span>{currentUser.email}</span>
                {currentUser.role === 'premium' && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[10px] uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Crown className="w-3 h-3" /> VIP
                    </span>
                  </>
                )}
              </div>
              
              <Link 
                href="/settings"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-sm border border-slate-700"
              >
                Chỉnh sửa hồ sơ
              </Link>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-slate-800 mb-6 overflow-x-auto">
          <nav className="-mb-px flex gap-1 min-w-max">
            <button 
              onClick={() => setActiveTab('my-posts')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'my-posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Bài viết của tôi ({posts.length})
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'saved' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" /> Đã Lưu ({savedPosts.length})
            </button>
            <button 
              onClick={() => setActiveTab('trash')}
              className={`py-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'trash' ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Thùng rác ({deletedPosts.length})
            </button>
          </nav>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span>Đang tải bài viết...</span>
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
              <div className="text-center py-20 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Bạn chưa có bài viết nào</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy chia sẻ trải nghiệm tập luyện của bạn với cộng đồng nhé!
                </p>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/30 hover:bg-amber-500/20 transition"
                >
                  Về Trang Chủ Đăng Bài
                </Link>
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
              <div className="text-center py-20 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Chưa có bài viết nào được lưu</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Nhấn biểu tượng Bookmark trên các bài đăng để lưu chúng vào đây.
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
              <div className="text-center py-20 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
                <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Thùng rác trống</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Các bài viết bị xoá mềm sẽ xuất hiện ở đây.
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
    </div>
  );
}
