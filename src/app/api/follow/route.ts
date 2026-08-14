import { NextResponse } from 'next/server';
import { toggleFollowUser, getFollowersCountByUserId, isFollowingUser } from '@/lib/supabaseDB';

// Note: To return an accurate followers count (not limited by RLS), this route
// will use the Supabase service role key when available. Keep the fallback to
// the existing helper for environments without a service key.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUserId } = body;
    if (!targetUserId) return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });

    const result = await toggleFollowUser(targetUserId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as any).message || 'Unknown error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetUserId = url.searchParams.get('userId');
  const check = url.searchParams.get('check');

  if (!targetUserId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  if (check) {
    const following = await isFollowingUser(targetUserId);
    return NextResponse.json({ isFollowing: following });
  }

  // Prefer service role client to get an accurate followers count that is not
  // restricted by Row Level Security policies. Fall back to helper otherwise.
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    if (serviceKey && supabaseUrl) {
      const { createClient } = await import('@supabase/supabase-js');
      const admin = createClient(supabaseUrl, serviceKey);
      const { data: userRow, error: userErr } = await admin.from('users').select('auth_id').eq('id', targetUserId).maybeSingle();
      if (userErr) throw userErr;
      const authId = userRow?.auth_id;
      if (!authId) return NextResponse.json({ followersCount: 0 });
      const { count } = await admin.from('follows').select('*', { count: 'exact', head: true }).eq('following_auth', authId);
      return NextResponse.json({ followersCount: count || 0 });
    }
  } catch (err) {
    console.error('GET /api/follow service-role error:', err);
  }

  const count = await getFollowersCountByUserId(targetUserId);
  return NextResponse.json({ followersCount: count });
}
