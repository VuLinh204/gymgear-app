'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchEquipments } from '@/lib/supabaseDB';
import { SocialPost, Equipment } from '@/types';
import { Image, Star, Dumbbell, Send, Tag, CheckCircle2, Lock, Crown, ShieldCheck, LogIn, User, Loader2, X } from 'lucide-react';
import { uploadImage } from '@/lib/supabaseDB';

interface CreatePostCardProps {
  onAddPost: (post: SocialPost) => void;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ onAddPost }) => {
  const { currentUser, isGuest, requestAuth } = useAuth();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [equipments, setEquipments] = useState<Equipment[]>([]);

  React.useEffect(() => {
    fetchEquipments().then(data => setEquipments(data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsExpanded(true);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      requestAuth('login');
      return;
    }
    if (!content.trim()) return;

    setIsUploading(true);
    setErrorMessage(null);

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, 'posts');
      if (!imageUrl) {
        setErrorMessage('Tải ảnh lên thất bại! Vui lòng đảm bảo bạn đã tạo bucket "images" và phân quyền (chạy file SUPABASE_STORAGE_SETUP.sql trong SQL Editor).');
        setIsUploading(false);
        return;
      }
    }

    const taggedEquipment = equipments.find((eq) => eq.id === selectedEquipmentId);

    const postImages = imageUrl ? [imageUrl] : (taggedEquipment ? [taggedEquipment.thumbnail] : []);

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author: currentUser,
      createdAt: 'Vừa xong',
      content,
      rating,
      taggedEquipment,
      images: postImages,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      comments: [],
    };

    onAddPost(newPost);
    setContent('');
    setSelectedEquipmentId('');
    setRating(5);
    setIsExpanded(false);
    setPostedSuccess(true);
    removeImage();
    setIsUploading(false);
    
    setTimeout(() => setPostedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-lg">

      {/* Guest prompt banner */}
      {isGuest && (
        <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Bạn đang duyệt với quyền <b className="text-slate-200">Khách (Guest)</b>.
              Đăng nhập để đăng bài review &amp; bình luận.
            </span>
          </div>
          <button
            onClick={() => requestAuth('login')}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" /> Đăng nhập
          </button>
        </div>
      )}

      {/* Success toast */}
      {postedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Bài review của <b>{currentUser.name}</b> đã được đăng lên Feed và lưu vào Database!</span>
        </div>
      )}

      {/* Error toast */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-fadeIn">
          <X className="w-4 h-4 shrink-0 cursor-pointer" onClick={() => setErrorMessage(null)} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            {isGuest ? (
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
            ) : (
              <>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-10 h-10 rounded-full object-cover border-2 ${
                    currentUser.role === 'premium'
                      ? 'border-amber-400'
                      : currentUser.role === 'admin'
                      ? 'border-red-500'
                      : 'border-slate-500'
                  }`}
                />
                {currentUser.role === 'premium' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                {currentUser.role === 'admin' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex-1">
            <textarea
              rows={isExpanded ? 3 : 2}
              placeholder={
                isGuest
                  ? 'Đăng nhập để chia sẻ trải nghiệm & đánh giá máy gym...'
                  : `Viết bài review máy gym (${currentUser.role.toUpperCase()})...`
              }
              value={content}
              onFocus={() => { if (!isGuest) setIsExpanded(true); }}
              onClick={() => { if (isGuest) requestAuth('login'); }}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full bg-slate-950 text-slate-200 placeholder-slate-400 text-xs sm:text-sm rounded-xl p-3 border border-slate-800 focus:border-amber-500 focus:outline-none transition-all resize-none ${
                isGuest ? 'cursor-pointer' : ''
              }`}
            />
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && !isGuest && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80 animate-fadeIn text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tag Equipment */}
              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Gắn thẻ Máy Gym:
                </label>
                <select
                  value={selectedEquipmentId}
                  onChange={(e) => setSelectedEquipmentId(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2 border border-slate-800 focus:border-amber-500"
                >
                  <option value="">-- Chọn máy tập --</option>
                  {equipments.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.brand} – {eq.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block mt-2">
                  <img src={imagePreview} alt="Preview" className="h-24 rounded-lg object-cover border border-slate-700" />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-slate-800 text-slate-300 hover:text-white rounded-full p-1 border border-slate-700 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Chấm điểm (1.0 - 5.0):</label>
                <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button" key={s}
                        onClick={() => setRating(s)}
                        className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={rating}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          setRating(Math.min(5, Math.max(1, parseFloat(val.toFixed(1)))));
                        }
                      }}
                      className="w-12 bg-transparent text-amber-400 font-bold text-xs text-center outline-none"
                    />
                    <span className="text-slate-400 text-[11px] font-bold">/ 5 ⭐</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-slate-400">
                <label className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer">
                  <Image className="w-4 h-4 text-emerald-400" /> Ảnh thực tế
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <button type="button" className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                  <Dumbbell className="w-4 h-4 text-orange-400" /> Thông số
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isUploading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 transition-all"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} 
                  {isUploading ? 'Đang Đăng...' : 'Đăng Bài'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
