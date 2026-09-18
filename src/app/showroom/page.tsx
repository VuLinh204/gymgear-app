'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';
import EquipmentCompareModal from '@/components/EquipmentCompareModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { useAuth } from '@/context/AuthContext';
import { Equipment, ShowroomItem } from '@/types';
import { fetchShowrooms, fetchEquipments } from '@/lib/supabaseDB';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  CalendarCheck, 
  Search, 
  Scale, 
  Sparkles, 
  Crown, 
  Dumbbell,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function ShowroomPage() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [selectedEquipForBooking, setSelectedEquipForBooking] = useState<Equipment | null>(null);

  // Dynamic Data from DB
  const [showrooms, setShowrooms] = useState<ShowroomItem[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchShowrooms(), fetchEquipments()])
      .then(([dbShowrooms, dbEquips]) => {
        setShowrooms(dbShowrooms);
        setEquipments(dbEquips);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = showrooms.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase()) ||
    s.brands.some((b: string) => b.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenBookingWithEquip = (equip: Equipment) => {
    setSelectedEquipForBooking(equip);
    setBookingOpen(true);
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar onSearch={() => {}} onOpenBooking={() => setBookingOpen(true)} onOpenAdminDashboard={isAdmin ? () => setAdminDashboardOpen(true) : undefined} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold shadow-sm">
            <MapPin className="w-3.5 h-3.5" />
            HỆ THỐNG SHOWROOM TRẢI NGHIỆM MÁY TẬP TOÀN QUỐC
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Showroom Trải Nghiệm Máy Tập Thực Tế
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Trực tiếp cảm nhận chất lượng, chuyển động cơ học và thử sức với hơn 60+ dòng máy thương mại & gia đình trước khi quyết định đầu tư. Đặt lịch miễn phí 100%.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCompareOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 flex items-center gap-2 transition"
            >
              <Scale className="w-4 h-4" /> So Sánh 2 Thiết Bị Song Song
            </button>
            <button
              onClick={() => setBookingOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition"
            >
              <CalendarCheck className="w-4 h-4" /> Đặt Lịch Dùng Thử Miễn Phí
            </button>
          </div>

          <div className="relative max-w-md mx-auto pt-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-6.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm showroom theo quận, địa chỉ, hãng máy..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* Danh sách thiết bị nổi bật có sẵn tại Showroom để so sánh nhanh */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Thiết Bị Sẵn Sàng Trải Nghiệm Tại Showroom
              </h2>
            </div>
            <button
              onClick={() => setCompareOpen(true)}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" /> Mở Bảng So Sánh Chi Tiết
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {equipments.slice(0, 3).map((eq) => (
              <div key={eq.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3 group hover:border-amber-500/40 transition">
                <img src={eq.thumbnail} alt={eq.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition">{eq.name}</h4>
                  <p className="text-[11px] text-amber-400 font-semibold">{eq.priceRange}</p>
                  <button
                    onClick={() => handleOpenBookingWithEquip(eq)}
                    className="text-[10px] font-bold text-slate-400 hover:text-white mt-1 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đặt thử máy này
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Danh sách Showroom Toàn Quốc */}
        <div className="space-y-5">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" /> Danh Sách Địa Điểm Showroom ({filtered.length})
          </h2>

          {filtered.map(showroom => (
            <div key={showroom.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 flex flex-col sm:flex-row shadow-lg">
              <div className="relative sm:w-60 h-48 sm:h-auto shrink-0 overflow-hidden">
                <img src={showroom.image} alt={showroom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md ${showroom.isOpen ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                  {showroom.isOpen ? '● Đang mở cửa' : '● Tạm đóng cửa'}
                </div>
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black text-white leading-snug group-hover:text-amber-400 transition-colors">{showroom.name}</h3>
                    <div className="flex items-center gap-1 shrink-0 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-sm font-bold text-white">{showroom.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />{showroom.address}</span>
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />{showroom.hours}</span>
                    <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />{showroom.phone}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {showroom.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">{tag}</span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 pt-0.5">
                    Trưng bày <span className="font-bold text-white">{showroom.machines}+ máy tập</span> từ thương hiệu:{' '}
                    <span className="text-amber-400 font-semibold">{showroom.brands.join(', ')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setBookingOpen(true)} className="btn-theme-accent flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-md cursor-pointer">
                    <CalendarCheck className="w-4 h-4 text-white stroke-[2.5]" /> Đặt Lịch Thử Máy Miễn Phí
                  </button>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(showroom.address)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Chỉ đường
                  </a>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-semibold text-slate-400">Không tìm thấy showroom phù hợp với từ khóa</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => {
          setBookingOpen(false);
          setSelectedEquipForBooking(null);
        }} 
        selectedEquipment={selectedEquipForBooking} 
      />

      {/* Equipment Compare Modal */}
      <EquipmentCompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        onOpenBooking={(equip) => handleOpenBookingWithEquip(equip)}
      />

      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
      />
    </div>
  );
}
