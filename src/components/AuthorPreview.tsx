"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { fetchUserById, getFollowersCountByUserId, isFollowingUser, toggleFollowUser } from '@/lib/supabaseDB';
import { useAuth } from '@/context/AuthContext';

interface Props { userId: string; className?: string; onNavigate?: () => void; initialName?: string; initialAvatar?: string }

export const AuthorPreview: React.FC<Props> = ({ userId, className, onNavigate, initialName, initialAvatar }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [followers, setFollowers] = useState<number | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const { currentUser, requestAuth } = useAuth();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      const u = await fetchUserById(userId);
      if (!mounted) return;
      setUser(u);
      const f = await getFollowersCountByUserId(userId);
      if (!mounted) return;
      setFollowers(f);
      const isF = await isFollowingUser(userId);
      if (!mounted) return;
      setFollowing(!!isF);
    })();
    return () => { mounted = false; };
  }, [open, userId]);

  const handleFollow = async () => {
    if (!currentUser) return requestAuth('login');
    try {
      const res = await toggleFollowUser(userId);
      setFollowing(!!res.following);
      if (typeof res.followersCount === 'number') setFollowers(res.followersCount);
      else setFollowers(prev => prev ? prev + (res.following ? 1 : -1) : prev);
    } catch (e) { console.error(e); }
  };

  return (
    <span className={className} onMouseEnter={() => { if (timer.current) window.clearTimeout(timer.current); setOpen(true); }} onMouseLeave={() => { timer.current = window.setTimeout(() => setOpen(false), 200); }}>
      <Link href={`/user/${userId}`} onClick={() => { if (onNavigate) onNavigate(); }}>
        <span className="font-bold text-white hover:text-amber-400 transition-colors cursor-pointer">{user?.name || (initialName && initialName.trim() ? initialName : 'Người dùng')}</span>
      </Link>

      {open && (
        <div className="absolute z-50 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg text-sm">
          <div className="flex items-center gap-3">
            <img src={user?.avatar || initialAvatar || `https://api.dicebear.com/8.x/avataaars/svg?seed=${userId}`} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-white">{user?.name || 'Người dùng'}</div>
                <button onClick={handleFollow} className={`px-3 py-1 rounded-lg text-xs font-bold ${following ? 'bg-slate-700 text-white' : 'bg-amber-500 text-slate-950'}`}>
                  {following ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
              </div>
              <div className="text-xs text-slate-400">{user?.roleTitle || ''}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">{followers !== null ? `${followers} người theo dõi` : '—'}</div>
        </div>
      )}
    </span>
  );
};

export default AuthorPreview;
