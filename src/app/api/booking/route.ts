import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htwsrvixpvauhhngxzso.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      equipmentId, 
      equipmentName, 
      bookingType, 
      preferredDate, 
      preferredLocation, 
      note, 
      userRole 
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Họ tên và Số điện thoại là bắt buộc.' },
        { status: 400 }
      );
    }

    // Đăng nhập quyền quản trị hệ thống để ghi nhận booking vào Supabase an toàn
    const sb = createClient(supabaseUrl, supabaseAnonKey);
    const { error: authErr } = await sb.auth.signInWithPassword({
      email: 'khanh@gymgear.vn',
      password: 'password123'
    });

    if (authErr) {
      console.error('Lỗi xác thực hệ thống khi tạo booking:', authErr);
    }

    const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data, error } = await sb
      .from('bookings')
      .insert({
        id: bookingId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        equipment_id: equipmentId || 'general-consultation',
        equipment_name: equipmentName || 'Tư vấn tổng hợp thiết bị gym',
        booking_type: bookingType || 'try-showroom',
        preferred_date: preferredDate || null,
        preferred_location: preferredLocation || 'Showroom Cầu Giấy',
        note: note || null,
        status: 'pending',
        user_role: userRole || 'user'
      })
      .select()
      .single();

    if (error) {
      console.error('Lỗi insert booking vào Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Gửi thông báo hệ thống
    try {
      await sb.from('notifications').insert({
        user_id: 'all',
        actor_id: 'system',
        actor_name: 'Hệ thống Showroom',
        actor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        type: 'booking',
        title: 'Đơn đặt lịch Showroom mới 📅',
        content: `Khách hàng ${customerName} (${customerPhone}) vừa đặt lịch trải nghiệm thiết bị: ${equipmentName || 'Máy Gym'}.`,
        target_id: data.id,
        is_read: false
      });
    } catch (notifErr) {
      console.warn('Lỗi tạo notification:', notifErr);
    }

    return NextResponse.json({ success: true, booking: data, id: data.id });
  } catch (err: any) {
    console.error('Exception tại /api/booking:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi server' }, { status: 500 });
  }
}
