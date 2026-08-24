'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { uploadImage, createStory } from '@/lib/supabaseDB';
import { MOCK_EQUIPMENTS } from '@/data/mockData';
import { 
  X, 
  Upload, 
  Sparkles, 
  Dumbbell, 
  Smile, 
  Check, 
  Loader2, 
  Clock, 
  Image as ImageIcon,
  Flame,
  Zap,
  Tag
} from 'lucide-react';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile: File | null;
  onSuccess: () => void;
}

// Danh sách các cảm xúc / nhãn Gym thịnh hành
const GYM_VIBES = [
  { id: 'fire', label: '🔥 Đốt mỡ cực căng', text: '#DotMo' },
  { id: 'pr', label: '💪 PR Mới đạt được', text: '#PersonalRecord' },
  { id: 'legday', label: '🏋️ Leg Day hủy diệt', text: '#LegDay' },
  { id: 'chest', label: '🦾 Ngực & Tay trước', text: '#ChestDay' },
  { id: 'cardio', label: '🏃 Cardio bứt phá', text: '#CardioTime' },
  { id: 'clean', label: '🥗 Ăn sạch sống khỏe', text: '#EatClean' },
  { id: 'pump', label: '⚡ Pump cơ cực đã', text: '#MusclePump' },
  { id: 'music', label: '🎵 Nhạc tập cháy phố', text: '#GymVibes' },
];

// Danh sách bộ lọc màu sắc chuyên nghiệp
const PHOTO_FILTERS = [
  { id: 'normal', name: 'Gốc', style: 'none' },
  { id: 'warm', name: 'Nắng ấm', style: 'saturate(1.25) contrast(1.05) sepia(0.12)' },
  { id: 'beast', name: 'Beast Mode', style: 'contrast(1.25) brightness(0.92)' },
  { id: 'vibrant', name: 'Rực rỡ', style: 'saturate(1.45) contrast(1.1)' },
  { id: 'cyber', name: 'Neon Gym', style: 'hue-rotate(15deg) contrast(1.15) saturate(1.3)' },
];

export default function CreateStoryModal({
  isOpen,
  onClose,
  initialFile,
  onSuccess,
}: CreateStoryModalProps) {
  const { currentUser, isGuest, requestAuth } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [taggedEquipment, setTaggedEquipment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cập nhật preview khi file thay đổi
  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
    }
  }, [initialFile]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Dung lượng ảnh tối đa là 10MB. Vui lòng chọn ảnh nhẹ hơn.');
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
    }
  };

  // Tạo Data URL dự phòng nếu Storage gặp sự cố
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (isGuest) {
      requestAuth('login');
      return;
    }

    if (!selectedFile && !previewUrl) {
      setErrorMessage('Vui lòng chọn hoặc tải lên một hình ảnh.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let finalImageUrl: string | null = null;

      if (selectedFile) {
        // 1. Thử upload lên Supabase Storage
        finalImageUrl = await uploadImage(selectedFile, 'posts');
        
        // 2. Dự phòng: nếu Storage chưa bật, chuyển sang Data URL
        if (!finalImageUrl) {
          try {
            finalImageUrl = await fileToDataUrl(selectedFile);
          } catch (e) {
            console.error('Không thể đọc file:', e);
          }
        }
      } else if (previewUrl) {
        finalImageUrl = previewUrl;
      }

      if (!finalImageUrl) {
        setErrorMessage('Không thể xử lý hình ảnh. Vui lòng thử lại với một ảnh khác.');
        setIsSubmitting(false);
        return;
      }

      // Ghép Caption + Vibe Badge
      let fullCaption = caption.trim();
      if (selectedVibe) {
        const vibeObj = GYM_VIBES.find(v => v.id === selectedVibe);
        if (vibeObj) {
          fullCaption = fullCaption ? `${vibeObj.label} • ${fullCaption}` : vibeObj.label;
        }
      }

      const result = await createStory(finalImageUrl, fullCaption || undefined, taggedEquipment || undefined);

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(
          result.error === 'not_authenticated'
            ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
            : `Đăng Story thất bại: ${result.error || 'Có lỗi xảy ra'}`
        );
      }
    } catch (err: any) {
      console.error('Lỗi khi tạo story:', err);
      setErrorMessage(err?.message || 'Có lỗi không xác định xảy ra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeFilterStyle = PHOTO_FILTERS.find(f => f.id === selectedFilter)?.style || 'none';

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Tạo Story Mới</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400 inline" /> Tự động hiển thị trong 24 giờ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Cột trái: Khung xem trước Story (Preview 9:16) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1 self-start">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Bản xem trước Story
            </div>

            <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-xl group">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Story Preview"
                    className="w-full h-full object-cover transition-all duration-200"
                    style={{ filter: activeFilterStyle }}
                  />

                  {/* Header overlay trong preview */}
                  <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10">
                    <img
                      src={currentUser.avatar || '/default-avatar.svg'}
                      alt=""
                      className="w-6 h-6 rounded-full border border-white object-cover"
                    />
                    <span className="text-[11px] font-bold text-white drop-shadow truncate">
                      {currentUser.name || 'Bạn'}
                    </span>
                  </div>

                  {/* Vibe badge overlay nếu có chọn */}
                  {selectedVibe && (
                    <div className="absolute top-11 left-3 z-10 bg-black/60 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-lg">
                      {GYM_VIBES.find(v => v.id === selectedVibe)?.label}
                    </div>
                  )}

                  {/* Caption & Tagged equipment overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                    {taggedEquipment && (
                      <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded mb-1">
                        <Dumbbell className="w-2.5 h-2.5" />
                        {MOCK_EQUIPMENTS.find(e => e.id === taggedEquipment)?.name || 'Thiết bị'}
                      </span>
                    )}
                    {caption && (
                      <p className="text-white text-xs font-medium line-clamp-3 drop-shadow">
                        {caption}
                      </p>
                    )}
                  </div>

                  {/* Nút đổi ảnh nhanh trên preview */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 text-white transition-opacity backdrop-blur-[2px]"
                  >
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span className="text-xs font-medium bg-black/60 px-2 py-1 rounded-md">Đổi ảnh khác</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 border border-dashed border-slate-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-center">Bấm để chọn ảnh Story</span>
                  <span className="text-[10px] text-slate-500 mt-1">Hỗ trợ JPG, PNG, WEBP</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {previewUrl && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <Upload className="w-3.5 h-3.5" /> Chọn ảnh từ máy
              </button>
            )}
          </div>

          {/* Cột phải: Các tùy chỉnh chi tiết */}
          <div className="md:col-span-7 flex flex-col gap-4">
            
            {/* 1. Nhập chú thích / Caption */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-400" /> Thêm chú thích cho Story
                </label>
                <span className="text-[10px] text-slate-400">{caption.length}/150</span>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 150))}
                placeholder="Chia sẻ bài tập hôm nay, mức tạ, cảm xúc bứt phá..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none transition-colors"
              />
            </div>

            {/* 2. Chọn Nhãn cảm xúc / Hoạt động Gym */}
            <div>
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                <Flame className="w-4 h-4 text-orange-400" /> Gắn nhãn cảm xúc & Mục tiêu Gym
              </label>
              <div className="flex flex-wrap gap-1.5">
                {GYM_VIBES.map((vibe) => {
                  const isSelected = selectedVibe === vibe.id;
                  return (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setSelectedVibe(isSelected ? null : vibe.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 font-medium
                        ${isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                    >
                      {vibe.label}
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Bộ lọc màu sắc ảnh */}
            <div>
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Bộ lọc màu ảnh
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {PHOTO_FILTERS.map((filter) => {
                  const isSelected = selectedFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`py-2 px-1 rounded-lg border text-center text-xs font-medium transition-all
                        ${isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                    >
                      {filter.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Gắn thẻ Thiết bị tập (Tùy chọn) */}
            <div>
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
                <Tag className="w-4 h-4 text-amber-400" /> Gắn thẻ máy tập (Tùy chọn)
              </label>
              <select
                value={taggedEquipment}
                onChange={(e) => setTaggedEquipment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">-- Không gắn thẻ máy tập --</option>
                {MOCK_EQUIPMENTS.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.brand})
                  </option>
                ))}
              </select>
            </div>

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Tăng tương tác với cộng đồng Gymer
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || (!selectedFile && !previewUrl)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Đang đăng Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Đăng Story Ngay</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
