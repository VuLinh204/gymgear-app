'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { updateUserProfile, upgradeUserRole, uploadImage } from '@/lib/supabaseDB';
import { UserRole } from '@/types';
import { Loader2, CheckCircle2, User, Camera, Crown, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, isGuest, isPremium, requestAuth } = useAuth();
  
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [roleTitle, setRoleTitle] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize fields when user data is available
  useEffect(() => {
    if (!isGuest && currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setRoleTitle(currentUser.roleTitle || '');
    }
  }, [currentUser, isGuest]);

  // Redirect guests or show auth prompt
  if (isGuest) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <Navbar onSearch={() => {}} onOpenBooking={() => {}} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Chưa đăng nhập</h2>
            <p className="text-sm text-slate-400 mb-6">Bạn cần đăng nhập để truy cập trang Cài đặt tài khoản.</p>
            <button 
              onClick={() => requestAuth('login')}
              className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    let avatarUrl = avatar;
    if (avatarFile) {
      const uploadedUrl = await uploadImage(avatarFile, 'avatars');
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
        setAvatar(uploadedUrl);
      } else {
        setMessage({ type: 'error', text: 'Không thể tải ảnh lên. Vui lòng thử lại.' });
        setLoading(false);
        return;
      }
    }

    const success = await updateUserProfile(currentUser.id, { name, avatar: avatarUrl, roleTitle });
    
    if (success) {
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công! Vui lòng tải lại trang để thấy thay đổi.' });
      setAvatarFile(null);
    } else {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật.' });
    }
    
    setLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file)); // preview
    }
  };

  const handleUpgradeVIP = async () => {
    if (isPremium) return;
    setLoading(true);
    setMessage(null);
    
    // Simulate payment / upgrade process
    setTimeout(async () => {
      const success = await upgradeUserRole(currentUser.id, 'premium');
      if (success) {
        setMessage({ type: 'success', text: '🎉 Chúc mừng! Bạn đã nâng cấp lên hạng VIP thành công. Vui lòng đăng nhập lại để nhận huy hiệu.' });
      } else {
        setMessage({ type: 'error', text: 'Nâng cấp thất bại.' });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar onSearch={() => {}} onOpenBooking={() => {}} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            Cài Đặt Tài Khoản
          </h1>
          <p className="text-sm text-slate-400 mt-2">Quản lý thông tin cá nhân và gói hội viên của bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cột trái: Form thông tin */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-3">Thông Tin Cơ Bản</h2>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-2 ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0 space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ảnh đại diện</label>
                    <div className="relative group w-24 h-24 cursor-pointer">
                      <img src={avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=anon'} className="w-24 h-24 rounded-full object-cover border border-slate-700" alt="Avatar" />
                      <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Họ và Tên</label>
                      <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)} required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none transition"
                      />
                    </div>
                    {/* URL Input removed, using File upload instead */}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Danh Xưng (Tuỳ chọn)</label>
                  <input 
                    type="text" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="VD: Chủ Gym, HLV Cá Nhân, Người Yêu Thể Hình..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none transition"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <button 
                    type="submit" disabled={loading}
                    className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Cột phải: Membership */}
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 border relative overflow-hidden ${
              isPremium ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 border-amber-500/30' : 'bg-slate-900/50 border-slate-800'
            }`}>
              {isPremium && (
                <div className="absolute top-0 right-0 p-2">
                  <Crown className="w-12 h-12 text-amber-500/10 rotate-12" />
                </div>
              )}
              
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gói Hội Viên</h3>
              
              <div className="flex items-center gap-3 mb-4">
                {isPremium ? (
                  <>
                    <Crown className="w-8 h-8 text-amber-400" />
                    <div>
                      <div className="font-bold text-lg text-white">Thành Viên VIP</div>
                      <div className="text-xs text-amber-400">Quyền lợi cao cấp nhất</div>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="w-8 h-8 text-slate-400" />
                    <div>
                      <div className="font-bold text-lg text-white">Thành Viên Thường</div>
                      <div className="text-xs text-slate-500">Quyền lợi cơ bản</div>
                    </div>
                  </>
                )}
              </div>

              {!isPremium && (
                <div className="space-y-4">
                  <ul className="text-xs text-slate-400 space-y-2 mb-4">
                    <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Huy hiệu VIP nổi bật</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Ưu tiên hiển thị bài viết</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Xem giá máy giảm giá đặc biệt</li>
                  </ul>
                  
                  <button 
                    onClick={handleUpgradeVIP}
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-500 transition disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                    Nâng cấp VIP (Free Test)
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
