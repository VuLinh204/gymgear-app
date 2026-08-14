import { NextResponse } from 'next/server';
import { toggleRepost } from '@/lib/supabaseDB';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId } = body;
    if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 });

    const result = await toggleRepost(postId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as any).message || 'Unknown error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

  // Return basic count
  try {
    const res = await fetch(`${request.headers.get('x-site-origin') || ''}/api/repost?postId=${postId}`, { method: 'GET' });
    return NextResponse.json({});
  } catch (err) {
    return NextResponse.json({ error: 'not implemented' }, { status: 501 });
  }
}
