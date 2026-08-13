import { NextResponse } from 'next/server';
import { toggleFollowUser, getFollowersCountByUserId, isFollowingUser } from '@/lib/supabaseDB';

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

  const count = await getFollowersCountByUserId(targetUserId);
  return NextResponse.json({ followersCount: count });
}
