'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Equipment, EquipmentReview } from '@/types';
import { fetchEquipmentReviews, submitEquipmentReview } from '@/lib/supabaseDB';
import { X, Star, ShieldCheck, CheckCircle2, XCircle, MapPin, CalendarCheck, Crown, Award, Lock, MessageSquare, Send, Loader2, Plus } from 'lucide-react';

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  onOpenBooking: (item: Equipment) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({ equipment, onClose, onOpenBooking }) => {
  const { currentUser, isPremium, isAdmin, isGuest, requestAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [selectedImage, setSelectedImage] = useState<string>(equipment?.thumbnail ?? equipment?.gallery?.[0] ?? '');
  
  // Real DB Reviews State
  const [reviews, setReviews] = useState<EquipmentReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (equipment) {
      setSelectedImage(equipment.thumbnail ?? equipment.gallery?.[0] ?? '');
      // Load real reviews from DB
      setLoadingReviews(true);
      fetchEquipmentReviews(equipment.id)
        .then(data => {
          setReviews(data);
          setLoadingReviews(false);
        })
        .catch(() => setLoadingReviews(false));
    }
  }, [equipment]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      requestAuth('login');
      return;
    }
    if (!newComment.trim()) return;

    if (!equipment) return;
    setSubmittingReview(true);
    const res = await submitEquipmentReview({
      equipmentId: equipment.id,
      userName: currentUser.name || 'Thành viên GymGear',
      userRole: currentUser.roleTitle || (currentUser.role === 'premium' ? 'Hội viên VIP' : 'Thành viên'),
      userAvatar: currentUser.avatar,
      rating: newRating,
      title: newTitle.trim() || 'Đánh giá trải nghiệm máy',
      comment: newComment.trim()
    });
    setSubmittingReview(false);

    if (res.success && res.review) {
      setReviews([res.review, ...reviews]);
      setNewTitle('');
      setNewComment('');
      setShowReviewForm(false);
    } else {
      alert(res.error || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    }
  };

  if (!equipment) return null;


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {equipment.brand}
            </span>
            <span className="text-xs text-slate-400 font-mono">Mã: {equipment.modelNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-200">
          
          {/* Top Section: Media Gallery & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Gallery */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedImage || undefined}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnails */}
              {equipment.gallery && equipment.gallery.length > 1 && (
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {equipment.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img || undefined} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info Summary & Dynamic Role Pricing */}
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {equipment.name}
              </h2>

              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-sm text-white">{equipment.rating}</span>
                </div>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-medium">{equipment.reviewCount} bài đánh giá thực tế</span>
              </div>

              {/* Pricing breakdown based on UserRole */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Khoảng Giá Tham Khảo:</span>
                  <span className="text-sm font-bold text-slate-200">{equipment.priceRange}</span>
                </div>

                {/* VIP Price for Premium or Admin Role */}
                {(isPremium || isAdmin) ? (
                  <div className="p-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>GIÁ ƯU ĐÃI ĐẠI LÝ (ĐẶC QUYỀN VIP/ADMIN):</span>
                    </div>
                    <div className="text-lg font-black text-amber-300">
                      {equipment.vipPrice || 'Chiết khấu 15% khi chốt hợp đồng'}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Giá sỉ đại lý chiết khấu sâu (Khóa)</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-bold">Nâng cấp VIP</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {equipment.fullDescription}
              </p>

              {/* Showroom List Tag */}
              {equipment.showroomLocations && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
                    <MapPin className="w-4 h-4" />
                    <span>Showroom có sẵn máy trải nghiệm:</span>
                  </div>
                  <div className="text-slate-300 pl-5">
                    {equipment.showroomLocations.join(' • ')}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'overview' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Ưu & Nhược Điểm
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'specs' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Thông Số Kỹ Thuật
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'reviews' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Đánh Giá Thực Tế ({equipment.reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ưu Điểm Nổi Bật</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(equipment.pros || []).map((p, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <h4 className="text-sm font-bold text-rose-400 flex items-center space-x-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Điểm Cần Lưu Ý (Nhược Điểm)</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(equipment.cons || []).map((c, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
              <div className="divide-y divide-slate-800">
                {equipment.specifications?.powerOutput && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-slate-400 font-medium">Công Suất Động Cơ</span>
                    <span className="col-span-2 text-white font-bold">{equipment.specifications.powerOutput}</span>
                  </div>
                )}
                {equipment.specifications?.weightCapacity && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-slate-400 font-medium">Tải Trọng Tối Đa</span>
                    <span className="col-span-2 text-white font-bold">{equipment.specifications.weightCapacity}</span>
                  </div>
                )}
                {equipment.specifications?.dimensions && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-slate-400 font-medium">Kích Thước (DxRxC)</span>
                    <span className="col-span-2 text-white font-mono">{equipment.specifications.dimensions}</span>
                  </div>
                )}
                {equipment.specifications?.machineWeight && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-slate-400 font-medium">Trọng Lượng Máy</span>
                    <span className="col-span-2 text-white font-bold">{equipment.specifications.machineWeight}</span>
                  </div>
                )}
                {equipment.specifications?.targetMuscles && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-slate-400 font-medium">Nhóm Cơ Tác Động</span>
                    <span className="col-span-2 text-amber-400 font-semibold">{equipment.specifications.targetMuscles.join(', ')}</span>
                  </div>
                )}
                {equipment.specifications?.warranty && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-slate-400 font-medium">Chính Sách Bảo Hành</span>
                    <span className="col-span-2 text-emerald-400 font-bold">{equipment.specifications.warranty}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Nút bật/tắt form viết review */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white">{reviews.length}</span> đánh giá từ hội viên thực tế
                </div>
                <button
                  onClick={() => {
                    if (isGuest) {
                      requestAuth('login');
                      return;
                    }
                    setShowReviewForm(!showReviewForm);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showReviewForm ? 'Đóng form' : 'Viết đánh giá'}</span>
                </button>
              </div>

              {/* Form viết đánh giá mới */}
              {showReviewForm && (
                <form onSubmit={handlePostReview} className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Đánh giá của bạn:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 text-slate-500 hover:text-amber-400 transition"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Tiêu đề (VD: Máy chạy êm, khung chắc chắn...)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />

                  <textarea
                    placeholder="Chia sẻ trải nghiệm thực tế khi tập luyện hoặc sử dụng thiết bị này..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview || !newComment.trim()}
                      className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 disabled:opacity-50 transition"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi Đánh Giá</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách các bài đánh giá */}
              {loadingReviews ? (
                <div className="text-center py-6 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Đang tải đánh giá từ Database...</span>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-950/50 rounded-xl border border-slate-800">
                  Chưa có bài đánh giá nào cho máy này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {rev.userAvatar ? (
                          <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-amber-400">
                            {rev.userName[0]}
                          </div>
                        )}
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                        {rev.userRole && <span className="text-[11px] text-amber-400 font-mono">({rev.userRole})</span>}
                        {rev.verifiedBooking && (
                          <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            ✓ Đã trải nghiệm máy
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold">{rev.rating}/5</span>
                      </div>
                    </div>
                    {rev.title && <h5 className="text-xs font-bold text-slate-200">{rev.title}</h5>}
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    {rev.createdAt && (
                      <div className="text-[10px] text-slate-500 text-right">
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}


        </div>

        {/* Footer Bar Action CTAs */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span>Trải nghiệm máy miễn phí 100% tại Showroom</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenBooking(equipment);
              }}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-500/25 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Đặt Lịch Thử Máy Tại Showroom</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
