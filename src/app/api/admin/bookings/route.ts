import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htwsrvixpvauhhngxzso.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getAdminClient() {
  const sb = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    await sb.auth.signInWithPassword({
      email: 'khanh@gymgear.vn',
      password: 'password123'
    });
  } catch (authErr) {
    console.warn('Lỗi xác thực admin:', authErr);
  }

  return sb;
}

// PATCH: Cập nhật trạng thái đơn booking
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc status.' }, { status: 400 });
    }

    const sb = await getAdminClient();
    const { data, error } = await sb
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn booking:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data?.[0] || { id, status } });


  } catch (err: any) {
    console.error('Exception tại PATCH /api/admin/bookings:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}

// DELETE: Xóa đơn booking
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (_) {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID đơn booking cần xóa.' }, { status: 400 });
    }

    const sb = await getAdminClient();
    const { error } = await sb
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa đơn booking khỏi DB:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Đã xóa đơn booking ${id} thành công.` });
  } catch (err: any) {
    console.error('Exception tại DELETE /api/admin/bookings:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}
