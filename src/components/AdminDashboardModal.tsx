'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchBookings, updateBookingStatus, fetchEquipments, fetchUsers } from '@/lib/supabaseDB';
import { BookingRequest, UserRole, Equipment, UserAuthor } from '@/types';
import { X, ShieldCheck, CheckCircle2, Clock, XCircle, Users, Dumbbell, Calendar, Crown, RefreshCw } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'equipments' | 'users'>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<UserAuthor[]>([]);

  // Load real database records
  const loadRealData = async () => {
    const [dbBookings, dbEquipments, dbUsers] = await Promise.all([
      fetchBookings(),
      fetchEquipments(),
      fetchUsers()
    ]);
    setBookings(dbBookings);
    setEquipments(dbEquipments);
    setUsers(dbUsers);
  };

  useEffect(() => {
    if (isOpen) {
      loadRealData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (id: string, newStatus: NonNullable<BookingRequest['status']>) => {
    const success = await updateBookingStatus(id, newStatus);
    if (success) {
      loadRealData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl border border-red-500/40 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">Admin Dashboard - Dữ Liệu Thật</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-md border border-red-500/40">REAL DB</span>
              </div>
              <p className="text-xs text-slate-400">Quản lý đơn Booking thật, máy gym và tài khoản lưu trong Database</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadRealData}
              title="Làm mới dữ liệu từ Database"
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'bookings' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Quản Lý Đơn Booking ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('equipments')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'equipments' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Quản Lý Máy Gym ({equipments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'users' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh Sách User ({users.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs text-slate-200 space-y-4">
          
          {/* Tab 1: Real Bookings Management */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <th className="p-3">Mã đơn DB</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Thiết bị</th>
                      <th className="p-3">Nhu cầu</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Duyệt Đơn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {bookings.map((b) => (
                      <tr key={b.id || Math.random()} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-amber-400">{b.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-white">{b.customerName}</div>
                          <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-200">{b.equipmentName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                            {b.bookingType === 'try-showroom' ? 'Thử máy Showroom' : 'Báo giá sỉ'}
                          </span>
                        </td>
                        <td className="p-3">
                          {b.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Chờ xử lý
                            </span>
                          )}
                          {b.status === 'confirmed' && (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              Đã xác nhận
                            </span>
                          )}
                          {b.status === 'completed' && (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Hoàn tất
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {b.id && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(b.id!, 'confirmed')}
                                className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id!, 'completed')}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md"
                              >
                                Xong
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Equipments Management */}
          {activeTab === 'equipments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipments.map((eq) => (
                <div key={eq.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex space-x-3">
                  <img src={eq.thumbnail} alt={eq.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold">{eq.brand}</span>
                    <h5 className="font-bold text-white text-xs leading-snug">{eq.name}</h5>
                    <div className="text-[11px] text-slate-400">Giá: {eq.priceRange}</div>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        ✓ Có sẵn tại Showroom
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Users Real List */}
          {activeTab === 'users' && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <h4 className="font-bold text-white text-sm">Danh Sách User Đã Lưu Trong Database:</h4>
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.roleTitle || 'Thành viên'}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${
                      u.role === 'premium' 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                        : u.role === 'admin'
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      Role: {u.role.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
