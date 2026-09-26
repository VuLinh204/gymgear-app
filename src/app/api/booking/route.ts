import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htwsrvixpvauhhngxzso.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
      preferredTime,
      preferredLocation, 
      note, 
      userRole 
    } = body;

    if (!customerName || !customerPhone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Họ tên, số điện thoại, ngày và giờ hẹn là bắt buộc.' },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime)) {
      return NextResponse.json({ success: false, error: 'Ngày hoặc giờ hẹn không hợp lệ.' }, { status: 400 });
    }
    const bookingDate = new Date(`${preferredDate}T${preferredTime}:00`);
    if (Number.isNaN(bookingDate.getTime()) || bookingDate.getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'Vui lòng chọn thời gian trong tương lai.' }, { status: 400 });
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json({ success: false, error: 'Booking chưa được cấu hình an toàn trên máy chủ.' }, { status: 503 });
    }
    const sb = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

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
        preferred_time: preferredTime,
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
  } catch (err: unknown) {
    console.error('Exception tại /api/booking:', err);
    const message = err instanceof Error ? err.message : 'Lỗi server';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
