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

// PATCH: Cập nhật role của user
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, role, roleTitle } = body;

    if (!id || !role) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc role.' }, { status: 400 });
    }

    const sb = await getAdminClient();
    const updateData: Record<string, any> = { role };
    if (roleTitle !== undefined) {
      updateData.role_title = roleTitle;
    }

    const { data, error } = await sb
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi cập nhật role user:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Exception tại PATCH /api/admin/users:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}

// DELETE: Xóa user
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
      return NextResponse.json({ success: false, error: 'Thiếu ID user cần xóa.' }, { status: 400 });
    }

    const sb = await getAdminClient();
    const { error } = await sb
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa user khỏi DB:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Đã xóa user ${id} thành công.` });
  } catch (err: any) {
    console.error('Exception tại DELETE /api/admin/users:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}
