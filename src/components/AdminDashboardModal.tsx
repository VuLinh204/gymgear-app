'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  fetchBookings, 
  updateBookingStatus, 
  deleteBooking,
  fetchEquipments, 
  createEquipment,
  updateEquipment,
  deleteEquipment,
  fetchUsers,
  updateUserRole,
  deleteUser,
  fetchAIKnowledgeDocs,
  createAIKnowledgeDoc,
  updateAIKnowledgeDoc,
  deleteAIKnowledgeDoc,
} from '@/lib/supabaseDB';
import { BookingRequest, UserRole, Equipment, UserAuthor, CategoryType, EquipmentType, AIKnowledgeDoc } from '@/types';
import { 
  X, ShieldCheck, CheckCircle2, Clock, XCircle, Users, 
  Dumbbell, Calendar, RefreshCw, Plus, Pencil, Trash2, 
  Search, Filter, AlertTriangle, Check, Image as ImageIcon,
  Sparkles, Tag, Shield, Loader2, Star, Crown, Store, Briefcase,
  Bot, BookOpen, FileText
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_THUMBNAILS = [
  { label: 'Máy Chạy Bộ Pro', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Giàn Smith Rack', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
  { label: 'Đạp Đùi Leg Press', url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kéo Xô Cable Tower', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tạ Tay Đơn Urethane', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80' },
];

const INITIAL_EQUIPMENT_FORM = {
  name: '',
  brand: 'Impulse Fitness',
  category: 'strength' as CategoryType,
  type: 'commercial' as EquipmentType,
  modelNumber: '',
  priceRange: '35.000.000đ - 45.000.000đ',
  vipPrice: '30.000.000đ (Đặc quyền Premium)',
  estimatedPrice: 38000000,
  thumbnail: PRESET_THUMBNAILS[0].url,
  excerpt: '',
  fullDescription: '',
  weightCapacity: '250 kg',
  dimensions: '2100 x 1100 x 1600 mm',
  machineWeight: '180 kg',
  warranty: '5 năm Khung sườn, 2 năm Linh kiện',
  targetMuscles: 'Cơ ngực, Cơ vai, Tay sau',
  isFeatured: false,
  availableForBooking: true,
};

const INITIAL_DOC_FORM = {
  title: '',
  category: 'workout' as AIKnowledgeDoc['category'],
  keywords: '',
  content: '',
  authorName: 'Admin GymGear',
};

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'equipments' | 'users' | 'ai_docs'>('bookings');
  
  // Data states
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<UserAuthor[]>([]);
  const [aiDocs, setAiDocs] = useState<AIKnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [equipmentCategory, setEquipmentCategory] = useState<string>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [docCategory, setDocCategory] = useState<string>('all');

  // Equipment Form Modal State
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [editingEquipId, setEditingEquipId] = useState<string | null>(null);
  const [equipForm, setEquipForm] = useState(INITIAL_EQUIPMENT_FORM);
  const [isSubmittingEquip, setIsSubmittingEquip] = useState(false);

  // AI Knowledge Doc Form Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState(INITIAL_DOC_FORM);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  // Confirm Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'equipment' | 'booking' | 'user' | 'ai_doc';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load real database records
  const loadRealData = async () => {
    setLoading(true);
    try {
      const [dbBookings, dbEquipments, dbUsers, dbDocs] = await Promise.all([
        fetchBookings(),
        fetchEquipments(),
        fetchUsers(),
        fetchAIKnowledgeDocs(),
      ]);
      setBookings(dbBookings);
      setEquipments(dbEquipments);
      setUsers(dbUsers);
      setAiDocs(dbDocs);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu admin:', err);
      showToast('Lỗi khi tải dữ liệu từ máy chủ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRealData();
    }
  }, [isOpen]);

  // ── BOOKING ACTIONS ────────────────────────────────────────────────────────
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    const success = await updateBookingStatus(id, newStatus);
    if (success) {
      showToast(`Đã cập nhật trạng thái đơn #${id} thành công!`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    } else {
      showToast('Cập nhật trạng thái thất bại!', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'equipment') {
        const res = await deleteEquipment(deleteTarget.id);
        if (res.success) {
          showToast(`Đã xóa thiết bị "${deleteTarget.title}" thành công!`);
          setEquipments(prev => prev.filter(e => e.id !== deleteTarget.id));
        } else {
          showToast(res.error || 'Lỗi khi xóa thiết bị', 'error');
        }
      } else if (deleteTarget.type === 'booking') {
        const res = await deleteBooking(deleteTarget.id);
        if (res.success) {
          showToast(`Đã xóa đơn booking #${deleteTarget.id}!`);
          setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
        } else {
          showToast(res.error || 'Lỗi khi xóa đơn booking', 'error');
        }
      } else if (deleteTarget.type === 'user') {
        const res = await deleteUser(deleteTarget.id);
        if (res.success) {
          showToast(`Đã xóa tài khoản user #${deleteTarget.id}!`);
          setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
        } else {
          showToast(res.error || 'Lỗi khi xóa user', 'error');
        }
      } else if (deleteTarget.type === 'ai_doc') {
        const ok = await deleteAIKnowledgeDoc(deleteTarget.id);
        if (ok) {
          showToast(`Đã xóa tài liệu "${deleteTarget.title}" khỏi Database!`);
          setAiDocs(prev => prev.filter(d => d.id !== deleteTarget.id));
        } else {
          showToast('Lỗi khi xóa tài liệu tri thức', 'error');
        }
      }
    } catch (err: any) {
      showToast('Có lỗi xảy ra khi thực hiện thao tác!', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── AI KNOWLEDGE DOC ACTIONS ──────────────────────────────────────────────
  const handleOpenAddDoc = () => {
    setEditingDocId(null);
    setDocForm(INITIAL_DOC_FORM);
    setIsDocModalOpen(true);
  };

  const handleOpenEditDoc = (doc: AIKnowledgeDoc) => {
    setEditingDocId(doc.id);
    setDocForm({
      title: doc.title,
      category: doc.category,
      keywords: Array.isArray(doc.keywords) ? doc.keywords.join(', ') : '',
      content: doc.content,
      authorName: doc.authorName || 'Admin GymGear',
    });
    setIsDocModalOpen(true);
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim() || !docForm.content.trim()) {
      showToast('Vui lòng nhập tiêu đề và nội dung tài liệu!', 'error');
      return;
    }
    setIsSubmittingDoc(true);
    try {
      const kws = docForm.keywords.split(',').map(k => k.trim()).filter(Boolean);
      if (editingDocId) {
        const updated = await updateAIKnowledgeDoc(editingDocId, {
          title: docForm.title.trim(),
          category: docForm.category,
          keywords: kws,
          content: docForm.content.trim(),
          authorName: docForm.authorName.trim() || 'Admin GymGear',
        });
        if (updated) {
          showToast(`Đã cập nhật tài liệu "${docForm.title}" thành công!`);
          setIsDocModalOpen(false);
          await loadRealData();
        } else {
          showToast('Cập nhật tài liệu thất bại!', 'error');
        }
      } else {
        const created = await createAIKnowledgeDoc({
          title: docForm.title.trim(),
          category: docForm.category,
          keywords: kws,
          content: docForm.content.trim(),
          authorName: docForm.authorName.trim() || 'Admin GymGear',
        });
        showToast(`Đã thêm tài liệu "${created.title}" vào Database!`);
        setIsDocModalOpen(false);
        await loadRealData();
      }
    } catch (err) {
      showToast('Lỗi khi lưu tài liệu vào Database!', 'error');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  // ── EQUIPMENT FORM ACTIONS ────────────────────────────────────────────────
  const handleOpenAddEquipment = () => {
    setEditingEquipId(null);
    setEquipForm(INITIAL_EQUIPMENT_FORM);
    setIsEquipModalOpen(true);
  };

  const handleOpenEditEquipment = (equip: Equipment) => {
    setEditingEquipId(equip.id);
    setEquipForm({
      name: equip.name,
      brand: equip.brand,
      category: equip.category,
      type: equip.type,
      modelNumber: equip.modelNumber || '',
      priceRange: equip.priceRange || '',
      vipPrice: equip.vipPrice || '',
      estimatedPrice: equip.estimatedPrice || 0,
      thumbnail: equip.thumbnail || PRESET_THUMBNAILS[0].url,
      excerpt: equip.excerpt || '',
      fullDescription: equip.fullDescription || '',
      weightCapacity: equip.specifications?.weightCapacity || '250 kg',
      dimensions: equip.specifications?.dimensions || '2000 x 1000 x 1500 mm',
      machineWeight: equip.specifications?.machineWeight || '150 kg',
      warranty: equip.specifications?.warranty || '5 năm',
      targetMuscles: Array.isArray(equip.specifications?.targetMuscles) 
        ? equip.specifications.targetMuscles.join(', ') 
        : 'Cơ ngực, Cơ vai',
      isFeatured: Boolean(equip.isFeatured),
      availableForBooking: equip.availableForBooking ?? true,
    });
    setIsEquipModalOpen(true);
  };

  const handleSaveEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipForm.name.trim() || !equipForm.brand.trim()) {
      showToast('Vui lòng nhập tên thiết bị và thương hiệu!', 'error');
      return;
    }

    setIsSubmittingEquip(true);

    const payload: Partial<Equipment> = {
      name: equipForm.name.trim(),
      brand: equipForm.brand.trim(),
      category: equipForm.category,
      type: equipForm.type,
      modelNumber: equipForm.modelNumber.trim(),
      priceRange: equipForm.priceRange.trim(),
      vipPrice: equipForm.vipPrice.trim(),
      estimatedPrice: Number(equipForm.estimatedPrice) || 0,
      thumbnail: equipForm.thumbnail.trim(),
      gallery: [equipForm.thumbnail.trim()],
      excerpt: equipForm.excerpt.trim() || equipForm.name.trim(),
      fullDescription: equipForm.fullDescription.trim() || equipForm.excerpt.trim() || equipForm.name.trim(),
      specifications: {
        weightCapacity: equipForm.weightCapacity.trim(),
        dimensions: equipForm.dimensions.trim(),
        machineWeight: equipForm.machineWeight.trim(),
        warranty: equipForm.warranty.trim(),
        targetMuscles: equipForm.targetMuscles.split(',').map(m => m.trim()).filter(Boolean),
      },
      isFeatured: equipForm.isFeatured,
      availableForBooking: equipForm.availableForBooking,
    };

    try {
      if (editingEquipId) {
        // Update
        const res = await updateEquipment(editingEquipId, payload);
        if (res.success) {
          showToast(`Đã cập nhật máy "${payload.name}" thành công!`);
          setIsEquipModalOpen(false);
          await loadRealData();
        } else {
          showToast(res.error || 'Cập nhật thiết bị thất bại!', 'error');
        }
      } else {
        // Create
        const res = await createEquipment(payload);
        if (res.success) {
          showToast(`Đã thêm máy "${payload.name}" vào hệ thống!`);
          setIsEquipModalOpen(false);
          await loadRealData();
        } else {
          showToast(res.error || 'Thêm thiết bị thất bại!', 'error');
        }
      }
    } catch (err: any) {
      showToast('Lỗi gửi dữ liệu lên máy chủ!', 'error');
    } finally {
      setIsSubmittingEquip(false);
    }
  };

  // ── USER ROLE ACTION ──────────────────────────────────────────────────────
  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    const roleTitleMap: Record<UserRole, string> = {
      guest: 'Khách tham quan',
      user: 'Thành viên Showroom',
      premium: 'Hội viên Premium',
      admin: 'Quản trị viên Hệ thống'
    };

    const res = await updateUserRole(userId, newRole, roleTitleMap[newRole]);
    if (res.success) {
      showToast(`Đã nâng/hạ quyền user thành ${newRole.toUpperCase()}!`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, roleTitle: roleTitleMap[newRole] } : u));
    } else {
      showToast(res.error || 'Lỗi khi cập nhật quyền!', 'error');
    }
  };

  // Filtered lists
  const filteredEquipments = useMemo(() => {
    return equipments.filter(eq => {
      const matchSearch = !equipmentSearch.trim() || 
        eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
        eq.brand.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
        (eq.modelNumber && eq.modelNumber.toLowerCase().includes(equipmentSearch.toLowerCase()));
      const matchCategory = equipmentCategory === 'all' || eq.category === equipmentCategory;
      return matchSearch && matchCategory;
    });
  }, [equipments, equipmentSearch, equipmentCategory]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      const matchSearch = !bookingSearch.trim() ||
        (b.customerName && b.customerName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
        (b.customerPhone && b.customerPhone.includes(bookingSearch)) ||
        (b.equipmentName && b.equipmentName.toLowerCase().includes(bookingSearch.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [bookings, bookingStatusFilter, bookingSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      return !userSearch.trim() ||
        (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()));
    });
  }, [users, userSearch]);

  const filteredDocs = useMemo(() => {
    return aiDocs.filter(d => {
      const matchSearch = !docSearch.trim() ||
        d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
        d.content.toLowerCase().includes(docSearch.toLowerCase()) ||
        (Array.isArray(d.keywords) && d.keywords.some(k => k.toLowerCase().includes(docSearch.toLowerCase())));
      const matchCategory = docCategory === 'all' || d.category === docCategory;
      return matchSearch && matchCategory;
    });
  }, [aiDocs, docSearch, docCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-bold border transition-all animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white border-emerald-400/50 shadow-emerald-500/20' 
            : 'bg-red-600 text-white border-red-400/50 shadow-red-500/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertTriangle className="w-5 h-5 text-white" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Admin Card */}
      <div className="relative w-full max-w-6xl bg-slate-900 rounded-2xl border border-red-500/40 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white border border-red-400/30 flex items-center justify-center shadow-lg shadow-red-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-wide">Admin Control Center</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-md border border-red-400/40">
                  DATABASE TRỰC TIẾP
                </span>
              </div>
              <p className="text-xs text-slate-400">Quản lý toàn diện Thiết Bị Máy Gym, Đơn Booking, Người Dùng và Kho Tri Thức Chatbot AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadRealData}
              disabled={loading}
              title="Làm mới dữ liệu từ Database"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-400' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-6 text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'bookings' 
                ? 'border-red-500 text-white bg-red-500/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Quản Lý Đơn Booking ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('equipments')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'equipments' 
                ? 'border-red-500 text-white bg-red-500/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Quản Lý Máy Gym ({equipments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'users' 
                ? 'border-red-500 text-white bg-red-500/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Danh Sách User ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_docs')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 whitespace-nowrap transition-all ${
              activeTab === 'ai_docs' 
                ? 'border-purple-500 text-white bg-purple-500/10' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Kho Tri Thức AI ({aiDocs.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 text-xs text-slate-200 space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: QUẢN LÝ ĐƠN BOOKING                                               */}
          {/* ========================================================================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Tìm theo tên khách, số điện thoại, tên máy..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingStatusFilter(st)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                        bookingStatusFilter === st
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st === 'all' ? 'Tất cả' : st === 'pending' ? 'Chờ duyệt' : st === 'confirmed' ? 'Đã duyệt' : st === 'completed' ? 'Hoàn tất' : 'Đã hủy'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                        <th className="p-3">Mã đơn DB</th>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Thiết bị quan tâm</th>
                        <th className="p-3">Nhu cầu & Showroom</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-right">Thao Tác Duyệt / Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-xs">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            Không tìm thấy đơn đặt lịch nào phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id || Math.random()} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-amber-400">{b.id}</td>
                            <td className="p-3">
                              <div className="font-bold text-white">{b.customerName}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{b.customerPhone}</div>
                              {b.customerEmail && <div className="text-[10px] text-slate-500">{b.customerEmail}</div>}
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-slate-200 block">{b.equipmentName}</span>
                              {b.preferredDate && (
                                <span className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span>{b.preferredDate}</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300 inline-block w-max">
                                {b.bookingType === 'try-showroom' ? (
                                  <span className="inline-flex items-center space-x-1">
                                    <Store className="w-3.5 h-3.5 text-blue-400" />
                                    <span>Thử tại Showroom</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1">
                                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Báo giá sỉ phòng Gym</span>
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {b.preferredLocation || 'Showroom chính'}
                              </span>
                            </td>
                            <td className="p-3">
                              {b.status === 'pending' && (
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Chờ xử lý</span>
                                </span>
                              )}
                              {b.status === 'confirmed' && (
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 inline-flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Đã xác nhận</span>
                                </span>
                              )}
                              {b.status === 'completed' && (
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center space-x-1">
                                  <Check className="w-3 h-3" />
                                  <span>Hoàn tất</span>
                                </span>
                              )}
                              {b.status === 'cancelled' && (
                                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center space-x-1">
                                  <XCircle className="w-3 h-3" />
                                  <span>Đã hủy</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              {b.id && (
                                <>
                                  {b.status !== 'confirmed' && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id!, 'confirmed')}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow transition-colors active:translate-y-0.5"
                                      title="Duyệt đơn booking"
                                    >
                                      Duyệt
                                    </button>
                                  )}
                                  {b.status !== 'completed' && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id!, 'completed')}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shadow transition-colors active:translate-y-0.5"
                                      title="Đánh dấu hoàn tất buổi thử máy"
                                    >
                                      Xong
                                    </button>
                                  )}
                                  {b.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id!, 'cancelled')}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-md shadow transition-colors active:translate-y-0.5"
                                      title="Hủy đơn booking"
                                    >
                                      Hủy
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setDeleteTarget({ type: 'booking', id: b.id!, title: `Đơn #${b.id} của ${b.customerName}` })}
                                    className="px-2 py-1 text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white rounded-md shadow transition-colors active:translate-y-0.5"
                                    title="Xóa đơn khỏi Database"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: QUẢN LÝ MÁY GYM (THÊM / XÓA / SỬA)                               */}
          {/* ========================================================================= */}
          {activeTab === 'equipments' && (
            <div className="space-y-4">
              {/* Control Header with Add Button */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={equipmentSearch}
                      onChange={(e) => setEquipmentSearch(e.target.value)}
                      placeholder="Tìm theo tên máy, hãng sản xuất, model..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <select
                    value={equipmentCategory}
                    onChange={(e) => setEquipmentCategory(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500"
                  >
                    <option value="all">Tất cả danh mục</option>
                    <option value="strength">Khối Tạ & Cơ Bắp (Strength)</option>
                    <option value="cardio">Cardio & Đốt Mỡ</option>
                    <option value="racks-benches">Khung Giàn & Ghế Tập</option>
                    <option value="home-gym">Gia Đình & Home Gym</option>
                    <option value="accessories">Phụ Kiện Thể Hình</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddEquipment}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:translate-y-0.5"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Thêm Máy Tập Mới</span>
                </button>
              </div>

              {/* Equipment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEquipments.length === 0 ? (
                  <div className="col-span-2 p-12 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                    <Dumbbell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-white">Chưa có thiết bị nào phù hợp tiêu chí tìm kiếm</p>
                    <button
                      onClick={handleOpenAddEquipment}
                      className="mt-3 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-500"
                    >
                      + Bấm vào đây để thêm máy mới ngay
                    </button>
                  </div>
                ) : (
                  filteredEquipments.map((eq) => (
                    <div 
                      key={eq.id} 
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-md"
                    >
                      <div className="flex space-x-3.5">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                          <img 
                            src={eq.thumbnail} 
                            alt={eq.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = PRESET_THUMBNAILS[0].url;
                            }}
                          />
                          {eq.isFeatured && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-black shadow">
                              HOT
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{eq.brand}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{eq.category}</span>
                          </div>
                          
                          <h5 className="font-bold text-white text-sm leading-snug line-clamp-2" title={eq.name}>
                            {eq.name}
                          </h5>

                          <div className="text-xs text-emerald-400 font-semibold">
                            {eq.priceRange || `${(eq.estimatedPrice || 0).toLocaleString('vi-VN')} đ`}
                          </div>

                          {eq.modelNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Model: {eq.modelNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Specs pills & Actions */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {eq.type === 'commercial' ? 'Commercial' : eq.type === 'home' ? 'Home Gym' : 'Light Commercial'}
                          </span>
                          {eq.availableForBooking && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Có lịch thử</span>
                            </span>
                          )}
                        </div>

                        {/* Action buttons (Edit, Delete) */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditEquipment(eq)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors shadow active:translate-y-0.5"
                          >
                            <Pencil className="w-3.5 h-3.5 text-white" />
                            <span>Sửa</span>
                          </button>
                          
                          <button
                            onClick={() => setDeleteTarget({ type: 'equipment', id: eq.id, title: eq.name })}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors shadow active:translate-y-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DANH SÁCH USER (PHÂN QUYỀN / XÓA USER)                             */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Danh Sách User Đã Đăng Ký Hệ Thống:</h4>
                  <p className="text-xs text-slate-400">Bạn có thể nâng quyền sang Premium hoặc Quản trị viên tại đây</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Tìm theo tên, email..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    Không tìm thấy người dùng nào phù hợp.
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div 
                      key={u.id} 
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={u.avatar} 
                          alt={u.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-700" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                          }}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{u.name}</span>
                            {u.role === 'admin' && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-600 text-white rounded">
                                ADMIN
                              </span>
                            )}
                            {u.role === 'premium' && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500 text-black rounded">
                                PREMIUM
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            {u.email || u.roleTitle || 'Thành viên'}
                          </span>
                        </div>
                      </div>

                      {/* Role selection buttons */}
                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                          <button
                            onClick={() => handleUpdateRole(u.id, 'user')}
                            className={`px-2.5 py-1 rounded transition-colors font-bold inline-flex items-center space-x-1 ${
                              u.role === 'user' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Users className="w-3 h-3" />
                            <span>User</span>
                          </button>
                          <button
                            onClick={() => handleUpdateRole(u.id, 'premium')}
                            className={`px-2.5 py-1 rounded transition-colors font-bold inline-flex items-center space-x-1 ${
                              u.role === 'premium' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>Premium</span>
                          </button>
                          <button
                            onClick={() => handleUpdateRole(u.id, 'admin')}
                            className={`px-2.5 py-1 rounded transition-colors font-bold inline-flex items-center space-x-1 ${
                              u.role === 'admin' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Crown className="w-3 h-3" />
                            <span>Admin</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setDeleteTarget({ type: 'user', id: u.id, title: u.name })}
                          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Xóa tài khoản này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: QUẢN LÝ KHO TRI THỨC AI (CHATBOT DATABASE)                         */}
          {/* ========================================================================= */}
          {activeTab === 'ai_docs' && (
            <div className="space-y-4">
              {/* Filter, Search & Add Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Tìm theo tiêu đề tài liệu, từ khóa, nội dung hướng dẫn..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center space-x-1.5 overflow-x-auto">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'equipment', label: 'Thiết bị' },
                      { id: 'workout', label: 'Luyện tập' },
                      { id: 'nutrition', label: 'Dinh dưỡng' },
                      { id: 'policy', label: 'Chính sách' },
                      { id: 'pricing', label: 'Giá & Ưu đãi' },
                      { id: 'custom', label: 'Khác' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setDocCategory(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                          docCategory === cat.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleOpenAddDoc}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-lg shadow-purple-600/20 transition-all active:translate-y-0.5 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Thêm Tri Thức</span>
                    <span className="sm:hidden">Thêm</span>
                  </button>
                </div>
              </div>

              {/* Documents Grid / List */}
              <div className="space-y-3">
                {filteredDocs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/80">
                    <Bot className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs font-semibold">Chưa có tài liệu tri thức nào phù hợp.</p>
                    <button
                      onClick={handleOpenAddDoc}
                      className="mt-3 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs"
                    >
                      Thêm tài liệu đầu tiên
                    </button>
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
                      equipment: { bg: 'bg-blue-500/20 border-blue-500/30 text-blue-300', text: 'text-blue-300', label: 'Thiết Bị' },
                      workout: { bg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300', text: 'text-emerald-300', label: 'Luyện Tập' },
                      nutrition: { bg: 'bg-amber-500/20 border-amber-500/30 text-amber-300', text: 'text-amber-300', label: 'Dinh Dưỡng' },
                      policy: { bg: 'bg-purple-500/20 border-purple-500/30 text-purple-300', text: 'text-purple-300', label: 'Chính Sách' },
                      pricing: { bg: 'bg-rose-500/20 border-rose-500/30 text-rose-300', text: 'text-rose-300', label: 'Giá & Ưu Đãi' },
                      custom: { bg: 'bg-slate-700/40 border-slate-600 text-slate-300', text: 'text-slate-300', label: 'Kiến Thức Chung' },
                    };
                    const catCfg = categoryColors[doc.category] || categoryColors.custom;

                    return (
                      <div
                        key={doc.id}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${catCfg.bg}`}>
                              {catCfg.label}
                            </span>
                            <h4 className="font-bold text-white text-sm hover:text-purple-300 transition-colors">
                              {doc.title}
                            </h4>
                          </div>

                          <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 whitespace-pre-line bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 font-mono">
                            {doc.content}
                          </p>

                          {/* Keywords & Metadata */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {Array.isArray(doc.keywords) && doc.keywords.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Tag className="w-3 h-3 text-slate-500" />
                                {doc.keywords.map((kw, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] text-slate-400 font-mono"
                                  >
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            )}
                            <span className="text-[11px] text-slate-500 ml-auto">
                              Tác giả: <strong className="text-slate-400">{doc.authorName || 'Admin'}</strong> • Cập nhật: {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 self-end md:self-start shrink-0">
                          <button
                            onClick={() => handleOpenEditDoc(doc)}
                            className="p-2 bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-1"
                            title="Chỉnh sửa tài liệu này"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">Sửa</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'ai_doc', id: doc.id, title: doc.title })}
                            className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-1"
                            title="Xóa tài liệu này khỏi Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">Xóa</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FORM MODAL: THÊM / SỬA MÁY GYM                                            */}
      {/* ========================================================================= */}
      {isEquipModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  {editingEquipId ? <Pencil className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
                </div>
                <h4 className="text-base font-bold text-white">
                  {editingEquipId ? 'Chỉnh Sửa Thông Tin Máy Tập' : 'Thêm Máy Tập Gym Mới'}
                </h4>
              </div>
              <button 
                onClick={() => setIsEquipModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scrollable Content */}
            <form onSubmit={handleSaveEquipment} className="overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Row 1: Tên máy & Thương hiệu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">
                    Tên máy tập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={equipForm.name}
                    onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })}
                    placeholder="VD: Máy Chạy Bộ Thương Mại PT300H"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">
                    Hãng sản xuất / Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={equipForm.brand}
                    onChange={(e) => setEquipForm({ ...equipForm, brand: e.target.value })}
                    placeholder="VD: Impulse Fitness, DHZ, Panatta, Life Fitness..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 2: Danh mục, Phân khúc, Model Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Danh mục thiết bị</label>
                  <select
                    value={equipForm.category}
                    onChange={(e) => setEquipForm({ ...equipForm, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="strength">Khối Tạ & Cơ Bắp (Strength)</option>
                    <option value="cardio">Cardio & Đốt Mỡ</option>
                    <option value="racks-benches">Khung Giàn & Ghế Tập</option>
                    <option value="home-gym">Gia Đình & Home Gym</option>
                    <option value="accessories">Phụ Kiện Thể Hình</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Phân khúc máy</label>
                  <select
                    value={equipForm.type}
                    onChange={(e) => setEquipForm({ ...equipForm, type: e.target.value as EquipmentType })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="commercial">Commercial (Phòng Gym 24/7)</option>
                    <option value="light-commercial">Light Commercial (Studio / KS)</option>
                    <option value="home">Home Gym (Gia đình cao cấp)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Mã Model / Năm</label>
                  <input
                    type="text"
                    value={equipForm.modelNumber}
                    onChange={(e) => setEquipForm({ ...equipForm, modelNumber: e.target.value })}
                    placeholder="VD: PT300H-2026"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 3: Giá bán hiển thị, Giá ước tính, Giá VIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Khoảng giá hiển thị</label>
                  <input
                    type="text"
                    value={equipForm.priceRange}
                    onChange={(e) => setEquipForm({ ...equipForm, priceRange: e.target.value })}
                    placeholder="VD: 42.000.000đ - 48.000.000đ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Giá ước tính (VNĐ số)</label>
                  <input
                    type="number"
                    value={equipForm.estimatedPrice}
                    onChange={(e) => setEquipForm({ ...equipForm, estimatedPrice: Number(e.target.value) || 0 })}
                    placeholder="VD: 45000000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Giá ưu đãi Premium</label>
                  <input
                    type="text"
                    value={equipForm.vipPrice}
                    onChange={(e) => setEquipForm({ ...equipForm, vipPrice: e.target.value })}
                    placeholder="VD: 38.500.000đ (Chiết khấu 15%)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 4: Link ảnh Thumbnail & Preset buttons */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-300">Ảnh đại diện (Thumbnail URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={equipForm.thumbnail}
                    onChange={(e) => setEquipForm({ ...equipForm, thumbnail: e.target.value })}
                    placeholder="Dán link ảnh trực tiếp tại đây..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  />
                  {equipForm.thumbnail && (
                    <img 
                      src={equipForm.thumbnail} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700" 
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                  <span className="text-[10px] text-slate-400 font-semibold">Gợi ý ảnh nhanh:</span>
                  {PRESET_THUMBNAILS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setEquipForm({ ...equipForm, thumbnail: preset.url })}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Thông số kỹ thuật */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-400 text-[11px]">Tải trọng tối đa</label>
                  <input
                    type="text"
                    value={equipForm.weightCapacity}
                    onChange={(e) => setEquipForm({ ...equipForm, weightCapacity: e.target.value })}
                    placeholder="VD: 250 kg"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-400 text-[11px]">Kích thước D x R x C</label>
                  <input
                    type="text"
                    value={equipForm.dimensions}
                    onChange={(e) => setEquipForm({ ...equipForm, dimensions: e.target.value })}
                    placeholder="VD: 2100 x 1000 mm"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-400 text-[11px]">Trọng lượng máy</label>
                  <input
                    type="text"
                    value={equipForm.machineWeight}
                    onChange={(e) => setEquipForm({ ...equipForm, machineWeight: e.target.value })}
                    placeholder="VD: 190 kg"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-400 text-[11px]">Thời gian bảo hành</label>
                  <input
                    type="text"
                    value={equipForm.warranty}
                    onChange={(e) => setEquipForm({ ...equipForm, warranty: e.target.value })}
                    placeholder="VD: 5 năm"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>

              {/* Row 6: Mô tả ngắn & Chi tiết */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Mô tả ngắn (Hiển thị trên thẻ)</label>
                <textarea
                  rows={2}
                  value={equipForm.excerpt}
                  onChange={(e) => setEquipForm({ ...equipForm, excerpt: e.target.value })}
                  placeholder="Giới thiệu điểm nổi bật nhất của thiết bị..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Switches */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={equipForm.isFeatured}
                    onChange={(e) => setEquipForm({ ...equipForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="font-bold text-white text-xs inline-flex items-center space-x-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Đánh dấu máy Nổi Bật (Featured)</span>
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={equipForm.availableForBooking}
                    onChange={(e) => setEquipForm({ ...equipForm, availableForBooking: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-white text-xs inline-flex items-center space-x-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Có sẵn tại Showroom để khách đặt lịch thử</span>
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEquipModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingEquip}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:translate-y-0.5"
                >
                  {isSubmittingEquip ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{editingEquipId ? 'Lưu Thay Đổi' : 'Thêm Thiết Bị Vào Database'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORM MODAL: THÊM / SỬA TÀI LIỆU KHO TRI THỨC AI                           */}
      {/* ========================================================================= */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-purple-500/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {editingDocId ? 'Chỉnh Sửa Tài Liệu Kho Tri Thức AI' : 'Thêm Tài Liệu Mới Vào Database AI'}
                  </h4>
                  <p className="text-[11px] text-slate-400">Chatbot AI sẽ tham khảo tài liệu này để tự động trả lời người dùng</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDocModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveDoc} className="overflow-y-auto p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-300">
                  Tiêu đề tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="VD: Chính Sách Bảo Trì Máy Gym Thương Mại Định Kỳ"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Danh mục phân loại</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="equipment">Thiết Bị & Máy Tập</option>
                    <option value="workout">Giáo Án & Luyện Tập</option>
                    <option value="nutrition">Dinh Dưỡng & Bổ Sung</option>
                    <option value="policy">Chính Sách & Showroom</option>
                    <option value="pricing">Báo Giá & Ưu Đãi Premium</option>
                    <option value="custom">Kiến Thức Khác</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300">Người biên soạn / Tác giả</label>
                  <input
                    type="text"
                    value={docForm.authorName}
                    onChange={(e) => setDocForm({ ...docForm, authorName: e.target.value })}
                    placeholder="VD: Admin GymGear, Master Trainer..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">
                  Từ khóa nhận diện AI (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={docForm.keywords}
                  onChange={(e) => setDocForm({ ...docForm, keywords: e.target.value })}
                  placeholder="VD: bảo trì, bảo dưỡng, cáp kéo, dầu bôi trơn, định kỳ"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-500">
                  Khi người dùng đặt câu hỏi chứa các từ khóa này, Chatbot AI sẽ tự động trích xuất nội dung từ tài liệu này để phản hồi.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">
                  Nội dung tài liệu tri thức <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={8}
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  placeholder="Nhập nội dung cẩm nang, thông số chi tiết, điều khoản hoặc câu trả lời mẫu mà bạn muốn Chatbot AI học và trả lời cho khách hàng..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  disabled={isSubmittingDoc}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDoc}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all active:translate-y-0.5"
                >
                  {isSubmittingDoc ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>Đang lưu vào Database...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{editingDocId ? 'Lưu Cập Nhật' : 'Lưu Vào Database'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRM DELETE MODAL DIALOG                                               */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-red-500/50 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Xác Nhận Xóa Dữ Liệu?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bạn có chắc chắn muốn xóa vĩnh viễn <strong className="text-red-400 font-bold">{deleteTarget.title}</strong> khỏi Database không? Thao tác này không thể hoàn tác!
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-1.5 transition-all active:translate-y-0.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-white" />
                    <span>Xác Nhận Xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
