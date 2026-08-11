'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import {
  X, User, Mail, Lock, LogIn, UserPlus,
  Crown, ShieldCheck, Sparkles, AlertCircle, CheckCircle2, Eye, EyeOff
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { login, register, setRole, authModalState, closeAuthModal } = useAuth();
  const { open, mode: initialMode } = authModalState;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!open) return null;

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setLoginError('');
    setRegError('');
    setRegSuccess('');
  };

  // ─── Login submit ────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Vui lòng nhập Email và Mật khẩu.');
      return;
    }
    const user = await login(loginEmail.trim(), loginPassword);
    if (!user) {
      setLoginError('Thông tin đăng nhập không chính xác hoặc tài khoản không tồn tại.');
    }
    // Nếu thành công, AuthContext đã gọi closeAuthModal()
  };

  // ─── Register submit ─────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setRegError('Vui lòng điền đầy đủ tất cả các trường bắt buộc.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu và xác nhận mật khẩu phải khớp.');
      return;
    }

    const result = await register(regName, regEmail, regPassword, 'user', regTitle);
    if (!result.success) {
      setRegError(result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } else {
      setRegSuccess(`Đăng ký thành công! Chào mừng ${result.user?.name} 🎉`);
      // AuthContext đã tự đăng nhập và closeAuthModal()
    }
  };

  // ─── Quick demo login ────────────────────────────────────────────────────────
  const quickLogin = (r: UserRole) => {
    setRole(r);
    closeAuthModal();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cổng Tài Khoản GymGear</h3>
              <p className="text-[11px] text-slate-400">Cộng đồng Review &amp; Booking Máy Tập Gym</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 text-xs font-bold">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
                mode === m
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {m === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{m === 'login' ? 'Đăng Nhập' : 'Đăng Ký Mới'}</span>
            </button>
          ))}
        </div>

        {/* ── Body ────────────────────────────────────────────────────────────── */}
        <div className="p-6 space-y-4 text-xs">

          {/* Quick 1-click demo */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              (Tính năng Role Switcher nhanh đã bị tắt do ứng dụng chuyển sang DB thật. Vui lòng đăng nhập hoặc tạo tài khoản mới!)
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <div className="flex-1 border-t border-slate-800" />
            <span>hoặc dùng tài khoản thật</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* ─── LOGIN FORM ───────────────────────────────────────────────────── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              {loginError && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Email đăng nhập
                </label>
                <input
                  type="email" required
                  placeholder="VD: hung.fitplus@gmail.com"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 pr-10 border border-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition"
                  />
                  <button type="button" onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                    {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Mật khẩu cần tối thiểu 6 ký tự.
                </p>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-500/20 transition-all">
                Đăng Nhập
              </button>

              <p className="text-center text-slate-400">
                Chưa có tài khoản?{' '}
                <button type="button" onClick={() => switchMode('register')}
                  className="text-amber-400 font-bold hover:underline">
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ─── REGISTER FORM ────────────────────────────────────────────────── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              {regError && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}
              {regSuccess && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Họ và tên <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text" required
                  placeholder="VD: Phạm Minh Khang"
                  value={regName}
                  onChange={(e) => { setRegName(e.target.value); setRegError(''); }}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Email đăng ký <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email" required
                  placeholder="VD: khang.gym@gmail.com"
                  value={regEmail}
                  onChange={(e) => { setRegEmail(e.target.value); setRegError(''); }}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Mật khẩu <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPw ? 'text' : 'password'} required minLength={6}
                    placeholder="Tối thiểu 6 ký tự"
                    value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setRegError(''); }}
                    className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 pr-10 border border-slate-800 focus:border-amber-500 focus:outline-none transition"
                  />
                  <button type="button" onClick={() => setShowRegPw(!showRegPw)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                    {showRegPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Xác nhận mật khẩu <span className="text-rose-400">*</span>
                </label>
                <input
                  type={showRegPw ? 'text' : 'password'} required minLength={6}
                  placeholder="Nhập lại mật khẩu"
                  value={regConfirmPassword}
                  onChange={(e) => { setRegConfirmPassword(e.target.value); setRegError(''); }}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 pr-10 border border-slate-800 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Danh xưng / Vai trò <span className="text-slate-500">(tuỳ chọn)</span>
                </label>
                <select
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value === 'none' ? '' : e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 rounded-xl p-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none transition"
                >
                  <option value="">-- Chọn chức danh --</option>
                  <option value="Huấn luyện viên">Huấn luyện viên</option>
                  <option value="Hội viên">Hội viên</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="none">Không có</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Chọn một chức danh phù hợp hoặc để mặc định nếu bạn không muốn đặt danh xưng.
                </p>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-500/20 transition-all">
                Tạo Tài Khoản
              </button>

              <p className="text-center text-slate-400">
                Đã có tài khoản?{' '}
                <button type="button" onClick={() => switchMode('login')}
                  className="text-amber-400 font-bold hover:underline">
                  Đăng nhập
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
