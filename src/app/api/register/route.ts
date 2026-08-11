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

// Danh sách role_title hợp lệ - chỉnh lại cho khớp với hệ thống của bạn
const ALLOWED_ROLE_TITLES = ['Trainer', 'Member', 'Staff'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string; roleTitle?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Dữ liệu gửi lên không hợp lệ.' }, { status: 400 });
  }

  const { name, email, password, roleTitle } = body;

  // --- Validate bắt buộc ---
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Tên, email và mật khẩu là bắt buộc.' }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedName.length === 0) {
    return NextResponse.json({ success: false, error: 'Tên không được để trống.' }, { status: 400 });
  }

  if (trimmedName.length > 100) {
    return NextResponse.json({ success: false, error: 'Tên quá dài.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return NextResponse.json({ success: false, error: 'Email không hợp lệ.' }, { status: 400 });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { success: false, error: `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.` },
      { status: 400 }
    );
  }

  // --- Validate roleTitle (nếu có gửi lên) ---
  let safeRoleTitle: string | null = null;
  if (roleTitle !== undefined && roleTitle !== null && roleTitle !== '') {
    if (!ALLOWED_ROLE_TITLES.includes(roleTitle)) {
      return NextResponse.json({ success: false, error: 'Chức danh không hợp lệ.' }, { status: 400 });
    }
    safeRoleTitle = roleTitle;
  }

  // --- Tạo user trong Supabase Auth ---
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: trimmedEmail,
    password,
    email_confirm: true,
    user_metadata: { name: trimmedName },
  });

  if (error) {
    const message = error.message.toLowerCase().includes('rate limit')
      ? 'Đã vượt quá giới hạn gửi email. Vui lòng chờ vài phút rồi thử lại.'
      : error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists')
      ? 'Email này đã được đăng ký.'
      : error.message;

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const authId = data.user?.id;
  if (!authId) {
    return NextResponse.json({ success: false, error: 'Đăng ký thất bại. Vui lòng thử lại sau.' }, { status: 500 });
  }

  // --- Tạo hồ sơ trong bảng users ---
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert({
      auth_id: authId,
      name: trimmedName,
      email: trimmedEmail,
      role: 'user',
      role_title: safeRoleTitle,
    });

  if (profileError) {
    // Rollback: xóa user vừa tạo bên Auth để tránh "orphaned user"
    // (tài khoản tồn tại trong Auth nhưng không có hồ sơ, khiến email bị khóa vĩnh viễn)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(authId);
    if (deleteError) {
      console.error('Rollback thất bại, cần xóa thủ công user auth_id:', authId, deleteError);
    }

    return NextResponse.json({
      success: false,
      error: profileError.message.includes('row-level security')
        ? 'Không thể tạo hồ sơ người dùng. Vui lòng liên hệ admin hoặc thử lại sau.'
        : 'Đăng ký thất bại. Vui lòng thử lại.'
    }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}