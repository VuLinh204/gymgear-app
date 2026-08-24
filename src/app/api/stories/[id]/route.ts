import { NextResponse } from 'next/server';
import { deleteStory } from '@/lib/supabaseDB';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const ok = await deleteStory(id);
    if (!ok) return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
