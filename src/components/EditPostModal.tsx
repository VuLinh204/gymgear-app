'use client';

import React, { useState, useEffect } from 'react';
import { SocialPost, Equipment } from '@/types';
import { fetchEquipments, updatePost, uploadImage } from '@/lib/supabaseDB';
import { Star, Tag, Image, Dumbbell, Send, X, Loader2 } from 'lucide-react';

interface EditPostModalProps {
  post: SocialPost | null;
  onClose: () => void;
  onUpdate: (updatedPost: SocialPost) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onUpdate }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipments().then(setEquipments);
  }, []);

  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setRating(post.rating || 5);
      setSelectedEquipmentId(post.taggedEquipment?.id || '');
      setImagePreview(post.images && post.images.length > 0 ? post.images[0] : null);
      setImageFile(null);
      setError(null);
    }
  }, [post]);

  if (!post) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    setError(null);

    let imageUrl = imagePreview; // Keep existing image by default
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile, 'posts');
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
        setIsSaving(false);
        return;
      }
    } else if (!imagePreview) {
      imageUrl = null; // Image was deleted
    }

    const taggedEquipment = equipments.find((eq) => eq.id === selectedEquipmentId);
    const postImages = imageUrl ? [imageUrl] : (taggedEquipment ? [taggedEquipment.thumbnail] : []);

    const success = await updatePost(
      post.id,
      content,
      rating,
      selectedEquipmentId || undefined,
      postImages
    );

    if (success) {
      const updatedPost: SocialPost = {
        ...post,
        content,
        rating,
        taggedEquipment,
        images: postImages,
      };
      onUpdate(updatedPost);
      onClose();
    } else {
      setError('Cập nhật bài viết thất bại. Vui lòng thử lại sau.');
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h3 className="text-lg font-black text-white">Chỉnh Sửa Bài Review</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn muốn sửa nội dung review gì?"
              rows={4}
              required
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-2xl p-4 border border-slate-800 focus:border-amber-500 outline-none resize-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tag Equipment */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Gắn thẻ Máy Gym:
              </label>
              <select
                value={selectedEquipmentId}
                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-sm rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 outline-none"
              >
                <option value="">-- Không gắn thẻ --</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.brand} – {eq.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Chấm điểm (1.0 - 5.0):
              </label>
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 h-[42px]">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button" key={s}
                      onClick={() => setRating(s)}
                      className="p-0.5 hover:scale-115 transition-transform cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5">
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
                  <span className="text-slate-400 text-xs font-bold">/ 5 ⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Hình ảnh đính kèm:
            </label>
            
            {imagePreview ? (
              <div className="relative inline-block mt-1">
                <img src={imagePreview} alt="Preview" className="h-28 rounded-xl object-cover border border-slate-800" />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-slate-800 text-slate-300 hover:text-white rounded-full p-1 border border-slate-700 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-950 border border-slate-800 hover:bg-slate-800 cursor-pointer transition">
                <Image className="w-4 h-4 text-emerald-400" /> Chọn ảnh thực tế
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 font-bold transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || !content.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 transition"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
