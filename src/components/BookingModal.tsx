'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Equipment, BookingRequest } from '@/types';
import { submitBooking } from '@/lib/supabaseDB';
import { X, Calendar, MapPin, User, Phone, Mail, FileText, CheckCircle2, Loader2, Sparkles, Send } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipment?: Equipment | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedEquipment }) => {
  const { currentUser, role } = useAuth();

  const [formData, setFormData] = useState<BookingRequest>({
    customerName: currentUser.name !== 'Khách Vãng Lai' ? currentUser.name : '',
    customerPhone: '',
    customerEmail: currentUser.email || '',
    equipmentId: selectedEquipment?.id || 'general-consultation',
    equipmentName: selectedEquipment?.name || 'Tư vấn tổng hợp thiết bị gym',
    bookingType: 'try-showroom',
    preferredDate: '',
    preferredLocation: 'Showroom TP.HCM - Quận 10',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [createdBooking, setCreatedBooking] = useState<BookingRequest | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      alert('Vui lòng điền Họ tên và Số điện thoại!');
      return;
    }

    setLoading(true);
    const res = await submitBooking({ ...formData, userRole: role });
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setResponseMsg('Đặt lịch thành công qua Supabase DB. Admin sẽ liên hệ sớm.');
      setCreatedBooking({ ...formData, id: res.id, userRole: role });
    } else {
      alert(`Có lỗi xảy ra khi lưu vào Database: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Đặt Lịch Trải Nghiệm Máy Gym</h3>
              <p className="text-[11px] text-slate-400">Miễn phí 100% • Lưu trực tiếp vào Database & Báo Telegram</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted && createdBooking ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h4 className="text-xl font-extrabold text-white">Đã Lưu Vào Database!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {responseMsg}
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-mono">
                Mã đơn DB: <span className="font-bold text-white">{createdBooking.id}</span> | Trạng thái: Chờ duyệt (Pending)
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700"
              >
                Hoàn Tất
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Selected equipment highlight */}
              {selectedEquipment && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center space-x-3">
                  <img src={selectedEquipment.thumbnail} alt={selectedEquipment.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div>
                    <span className="text-[10px] text-amber-400 font-semibold block">Thiết Bị Chọn Thử:</span>
                    <h5 className="font-bold text-white line-clamp-1 text-xs">{selectedEquipment.name}</h5>
                    <span className="text-[11px] text-slate-400">{selectedEquipment.priceRange}</span>
                  </div>
                </div>
              )}

              {/* Form Field: Customer Name */}
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Họ và tên của bạn <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Form Field: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Số điện thoại (Zalo) <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912 345 678"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email liên hệ</span>
                  </label>
                  <input
                    type="email"
                    placeholder="VD: user@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Booking Type Selection */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Loại nhu cầu của bạn:</label>
                <select
                  value={formData.bookingType}
                  onChange={(e) => setFormData({ ...formData, bookingType: e.target.value as any })}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                >
                  <option value="try-showroom">🔥 Đặt lịch tập thử trực tiếp tại Showroom (0đ)</option>
                  <option value="request-quote">💰 Yêu cầu nhận báo giá ưu đãi & Chiết khấu đại lý</option>
                  <option value="rent-equipment">🚚 Thuê thiết bị tập gym theo tháng</option>
                  <option value="gym-setup-consulting">🏢 Tư vấn trọn gói thiết kế Setup phòng Gym</option>
                </select>
              </div>

              {/* Showroom & Preferred Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Showroom trải nghiệm</span>
                  </label>
                  <select
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Showroom TP.HCM - Quận 10">Showroom TP.HCM - Quận 10</option>
                    <option value="Showroom TP.HCM - Tân Bình">Showroom TP.HCM - Tân Bình</option>
                    <option value="Showroom Hà Nội - Cầu Giấy">Showroom Hà Nội - Cầu Giấy</option>
                    <option value="Showroom Hà Nội - Thanh Xuân">Showroom Hà Nội - Thanh Xuân</option>
                    <option value="Showroom Đà Nẵng">Showroom Đà Nẵng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ngày dự kiến thử</span>
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ghi chú thêm (Không bắt buộc):</label>
                <textarea
                  rows={2}
                  placeholder="VD: Cần thử thêm máy chạy bộ Impulse và khung gánh Smith..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu vào Database...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Lưu Booking Vào DB (Free 100%)</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
