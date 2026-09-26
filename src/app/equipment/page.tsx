'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Search, Scale, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EquipmentCard } from '@/components/EquipmentCard';
import { EquipmentDetailModal } from '@/components/EquipmentDetailModal';
import EquipmentCompareModal from '@/components/EquipmentCompareModal';
import { BookingModal } from '@/components/BookingModal';
import { fetchEquipments } from '@/lib/supabaseDB';
import { CategoryType, Equipment } from '@/types';

const filters: { id: CategoryType | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' }, { id: 'cardio', label: 'Cardio' },
  { id: 'strength', label: 'Sức mạnh' }, { id: 'home-gym', label: 'Home gym' },
  { id: 'racks-benches', label: 'Rack & ghế' }, { id: 'accessories', label: 'Phụ kiện' },
];

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryType | 'all'>('all');
  const [selected, setSelected] = useState<Equipment[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [detail, setDetail] = useState<Equipment | null>(null);
  const [booking, setBooking] = useState<Equipment | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => { fetchEquipments().then(setEquipments).finally(() => setLoading(false)); }, []);

  const visible = useMemo(() => equipments.filter((item) => {
    const text = `${item.name} ${item.brand} ${item.modelNumber} ${item.excerpt}`.toLowerCase();
    return (category === 'all' || item.category === category) && text.includes(query.trim().toLowerCase());
  }), [equipments, category, query]);

  const toggleCompare = (item: Equipment) => setSelected((current) => current.some((chosen) => chosen.id === item.id)
    ? current.filter((chosen) => chosen.id !== item.id)
    : current.length >= 2 ? current : [...current, item]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onSearch={setQuery} onOpenBooking={() => setBookingOpen(true)} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-slate-800 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 p-6 sm:p-10">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-600 px-3 py-1 text-xs font-bold text-white"><SlidersHorizontal className="h-3.5 w-3.5" /> DANH MỤC THIẾT BỊ</p>
          <h1 className="text-3xl font-black sm:text-5xl">Toàn bộ máy tập</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Tìm thiết bị, xem thông số đã xác minh và chọn hai sản phẩm để đối chiếu trước khi đặt lịch trải nghiệm.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Tìm theo tên, thương hiệu, model..." /></label>
            {selected.length > 0 && <button onClick={() => setCompareOpen(true)} disabled={selected.length < 2} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Scale className="h-4 w-4" /> So sánh {selected.length}/2</button>}
          </div>
        </header>

        <nav className="mb-7 flex gap-2 overflow-x-auto pb-2">{filters.map((filter) => <button key={filter.id} onClick={() => setCategory(filter.id)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${category === filter.id ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'}`}>{filter.label}</button>)}</nav>

        {loading ? <p className="py-20 text-center text-slate-400">Đang tải danh mục thiết bị…</p> : visible.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item) => <EquipmentCard key={item.id} equipment={item} onViewDetail={setDetail} onBook={setBooking} onToggleCompare={toggleCompare} isSelectedForCompare={selected.some((chosen) => chosen.id === item.id)} />)}</div> : <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">{equipments.length ? 'Không tìm thấy thiết bị phù hợp.' : 'Chưa có sản phẩm trong danh mục. Hãy nhập danh mục sản phẩm vào Supabase để hiển thị tại đây.'}</div>}

        <section className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center">
          <div><p className="flex items-center gap-2 text-sm font-bold text-white"><BookOpen className="h-4 w-4 text-blue-400" /> Bài viết và hướng dẫn chọn thiết bị</p><p className="mt-1 text-xs text-slate-400">Tóm tắt biên soạn bởi GymGear, có dẫn nguồn từ Life Fitness.</p></div>
          <Link href="/articles" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Xem bài viết <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </main>
      <Footer />
      <EquipmentDetailModal equipment={detail} onClose={() => setDetail(null)} onOpenBooking={(item) => { setDetail(null); setBooking(item); }} />
      <EquipmentCompareModal isOpen={compareOpen} onClose={() => setCompareOpen(false)} initialEquip1={selected[0] || null} initialEquip2={selected[1] || null} onOpenBooking={(item) => setBooking(item)} />
      <BookingModal isOpen={bookingOpen || booking !== null} onClose={() => { setBooking(null); setBookingOpen(false); }} selectedEquipment={booking} />
    </div>
  );
}
