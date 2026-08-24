'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchActiveStories, Story } from '@/lib/supabaseDB';
import { Plus, Sparkles } from 'lucide-react';
import StoryViewer from '@/components/StoryViewer';
import CreateStoryModal from '@/components/CreateStoryModal';

export default function StoriesBar() {
  const { currentUser, isGuest, requestAuth } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFileForModal, setSelectedFileForModal] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadStories = async () => {
    setLoading(true);
    const data = await fetchActiveStories();
    setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isGuest) {
      requestAuth('login');
      return;
    }
    setSelectedFileForModal(file);
    setIsCreateModalOpen(true);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleOpenAddStory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isGuest) {
      requestAuth('login');
      return;
    }
    fileRef.current?.click();
  };

  // Gom nhóm story theo từng tác giả (mỗi tác giả hiển thị 1 avatar ngoài thanh cuộn)
  const isMyStory = (s: Story) => {
    if (currentUser?.id && (s.authorId === currentUser.id || s.authorAuth === currentUser.id)) return true;
    if (s.authorId === 'current_user') return true;
    if (currentUser?.name && s.authorName === currentUser.name && s.authorName !== 'Ẩn danh' && s.authorName !== 'Thành viên') return true;
    return false;
  };

  const authorMap = new Map<string, Story>();
  stories.forEach((s) => {
    const key = isMyStory(s) ? '__my_story__' : (s.authorId || s.authorAuth || s.id);
    if (!authorMap.has(key)) authorMap.set(key, s);
  });
  const uniqueStories = Array.from(authorMap.values());
  const myStory = uniqueStories.find(isMyStory);

  // Trạng thái xem story theo từng tác giả cụ thể
  const [viewingStories, setViewingStories] = useState<Story[] | null>(null);

  // Mở viewer cho Story của bạn
  const handleViewMyStories = () => {
    const myAllStories = stories.filter(isMyStory);
    if (myAllStories.length > 0) {
      setViewingStories(myAllStories);
    } else {
      handleOpenAddStory();
    }
  };

  // Mở viewer cho Story của tác giả khác
  const handleViewAuthorStories = (targetStory: Story) => {
    const authorAllStories = stories.filter((s) => {
      if (s.id === targetStory.id) return true;
      if (targetStory.authorId && s.authorId === targetStory.authorId) return true;
      if (targetStory.authorAuth && s.authorAuth === targetStory.authorAuth) return true;
      if (targetStory.authorName && s.authorName === targetStory.authorName && s.authorName !== 'Ẩn danh') return true;
      return false;
    });
    setViewingStories(authorAllStories.length > 0 ? authorAllStories : [targetStory]);
  };

  if (loading && stories.length === 0) return null; // Tránh layout shift khi đang tải

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
        {/* Nút Tạo / Xem Story của bạn */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div
            onClick={handleViewMyStories}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              myStory
                ? 'p-0.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 hover:scale-105 shadow-lg shadow-orange-500/20'
                : 'border-2 border-dashed border-slate-700 bg-slate-900/80 hover:border-amber-500 hover:bg-slate-800'
            }`}
          >
            {myStory ? (
              <div className="w-full h-full rounded-full border-2 border-slate-950 overflow-hidden relative">
                <img
                  src={myStory.imageUrl}
                  alt="Story của bạn"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img
                  src={currentUser.avatar || '/default-avatar.svg'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover opacity-45"
                />
              </div>
            )}

            {/* Nút dấu cộng thêm story */}
            <button
              onClick={handleOpenAddStory}
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-slate-950 hover:scale-110 shadow-md transition-transform"
              title="Thêm Story mới"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950 font-bold" />
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-400 group-hover:text-amber-400 transition-colors w-16 text-center truncate">
            {myStory ? 'Story của bạn' : 'Thêm Story'}
          </span>
        </div>

        {/* Danh sách Stories của các thành viên khác */}
        {uniqueStories
          .filter((s) => !isMyStory(s))
          .map((story) => (
            <button
              key={story.id}
              onClick={() => handleViewAuthorStories(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 hover:scale-105 transition-transform shadow-lg shadow-orange-500/20">
                <div className="w-full h-full rounded-full border-2 border-slate-950 overflow-hidden">
                  <img
                    src={story.authorAvatar}
                    alt={story.authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors w-16 text-center truncate">
                {story.authorName}
              </span>
            </button>
          ))}
      </div>

      {/* Input chọn ảnh ẩn */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFilePicked}
      />

      {/* Popup / Modal Tạo Story Mới */}
      {isCreateModalOpen && (
        <CreateStoryModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedFileForModal(null);
          }}
          initialFile={selectedFileForModal}
          onSuccess={async () => {
            await loadStories();
          }}
        />
      )}

      {/* Bộ xem Story (Story Viewer - chỉ hiển thị story của tác giả đang xem) */}
      {viewingStories !== null && viewingStories.length > 0 && (
        <StoryViewer
          stories={viewingStories}
          initialIndex={0}
          currentUserId={currentUser.id}
          onClose={() => setViewingStories(null)}
          onDelete={async (id) => {
            const { deleteStory } = await import('@/lib/supabaseDB');
            await deleteStory(id);
            await loadStories();
            setViewingStories((prev) => {
              if (!prev) return null;
              const remaining = prev.filter((s) => s.id !== id);
              return remaining.length > 0 ? remaining : null;
            });
          }}
        />
      )}
    </>
  );
}

