import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be set for server-side registration.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, roleTitle } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Tên, email và mật khẩu là bắt buộc.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error) {
    const message = error.message.toLowerCase().includes('rate limit')
      ? 'Đã vượt quá giới hạn gửi email. Vui lòng chờ vài phút rồi thử lại.'
      : error.message;

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const authId = data.user?.id;
  if (!authId) {
    return NextResponse.json({ success: false, error: 'Đăng ký thất bại. Vui lòng thử lại sau.' }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({
      auth_id: authId,
      name,
      email,
      role: 'user',
      role_title: roleTitle,
    });

  if (profileError) {
    return NextResponse.json({
      success: false,
      error: profileError.message.includes('row-level security')
        ? 'Không thể tạo hồ sơ người dùng. Vui lòng liên hệ admin hoặc thử lại sau.'
        : 'Đăng ký thất bại. Vui lòng thử lại.'
    }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
