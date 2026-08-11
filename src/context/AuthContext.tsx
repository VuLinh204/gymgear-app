'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, UserAuthor } from '@/types';
import { signIn, signUp, signOut, getCurrentUser } from '@/lib/supabaseDB';

// ─── Context Shape ─────────────────────────────────────────────────────────────
interface AuthContextType {
  currentUser: UserAuthor;
  role: UserRole;
  isGuest: boolean;
  isUser: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<UserAuthor | null>;
  register: (name: string, email: string, password?: string, role?: UserRole, roleTitle?: string) => Promise<{ success: boolean; error?: string; user?: UserAuthor }>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  requestAuth: (mode?: 'login' | 'register') => void;
  authModalState: { open: boolean; mode: 'login' | 'register' };
  closeAuthModal: () => void;
}

// ─── Guest Fallback ─────────────────────────────────────────────────────────────
const GUEST_USER: UserAuthor = {
  id: 'usr-guest',
  name: 'Khách Vãng Lai',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'guest',
  roleTitle: 'Chưa đăng nhập',
  isVerified: false,
};

// ─── Context ─────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAuthor>(GUEST_USER);
  const [authModalState, setAuthModalState] = useState<{ open: boolean; mode: 'login' | 'register' }>({
    open: false,
    mode: 'login',
  });

  // ── Khôi phục session từ Supabase khi client mount ─────────────────────────────────
  useEffect(() => {
    const fetchSession = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    fetchSession();
  }, []);

  // ── Auth Modal helpers ────────────────────────────────────────────────────────
  const requestAuth = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalState({ open: true, mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalState((prev) => ({ ...prev, open: false }));
  }, []);

  // ── Đăng nhập bằng email ──────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string = '123456'): Promise<UserAuthor | null> => {
    if (!email.trim()) return null;
    const result = await signIn(email.trim(), password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      closeAuthModal();
      return result.user;
    }
    return null;
  }, [closeAuthModal]);

  // ── Đăng ký tài khoản mới ────────────────────────────────────────────────────
  const register = useCallback(async (
    name: string,
    email: string,
    password: string = '123456',
    role: UserRole = 'user',
    roleTitle?: string
  ): Promise<{ success: boolean; error?: string; user?: UserAuthor }> => {
    if (!name.trim() || !email.trim()) {
      return { success: false, error: 'Vui lòng điền đầy đủ Họ tên và Email.' };
    }
    
    const result = await signUp(email.trim(), password, name.trim(), 'user', roleTitle);
    
    if (result.success) {
      // Sau khi đăng ký thành công, đăng nhập luôn để lấy token
      const loginResult = await signIn(email.trim(), password);
      if (loginResult.success && loginResult.user) {
         setCurrentUser(loginResult.user);
         closeAuthModal();
         return { success: true, user: loginResult.user };
      }
      return { success: true };
    }
    return { success: false, error: result.error };
  }, [closeAuthModal]);

  // ── Đăng xuất ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut();
    setCurrentUser(GUEST_USER);
  }, []);

  // ── Dev-only: Chuyển role nhanh (tắt tính năng do DB thật) ─────────────────────────────
  const setRole = useCallback((newRole: UserRole) => {
    if (newRole === 'guest') {
      setCurrentUser(GUEST_USER);
      signOut();
    } else {
      alert("Role Switcher tạm thời vô hiệu hoá khi dùng Database thật. Vui lòng tạo tài khoản mới qua form đăng ký.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        isGuest: currentUser.role === 'guest',
        isUser: currentUser.role === 'user',
        isPremium: currentUser.role === 'premium',
        isAdmin: currentUser.role === 'admin',
        login,
        register,
        logout,
        setRole,
        requestAuth,
        authModalState,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};
