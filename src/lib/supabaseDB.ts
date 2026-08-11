import { supabase } from './supabase';
import { SocialPost, BookingRequest, UserAuthor, UserRole } from '@/types';

// ── LẤY POSTS ───────────────────────────────────────────────────────────────
export async function fetchPosts() {
  const [postsRes, equipRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*, author:users(*)')
      .order('created_at', { ascending: false }),
    supabase.from('equipments').select('*')
  ]);
    
  if (postsRes.error) {
    console.error("Error fetching posts:", postsRes.error);
    return [];
  }

  const equipments = equipRes.data || [];
  
  return (postsRes.data || []).map((post: any) => ({
    ...post,
    equipment: equipments.find((eq: any) => eq.id === post.equipment_id) || null
  }));
}

// ── TẠO POST ────────────────────────────────────────────────────────────────
export async function createPost(
  authorId: string, content: string, rating: number,
  equipmentId?: string, images?: string[]
) {
  const { error } = await supabase.from('posts').insert({
    author_id: authorId, content, rating,
    equipment_id: equipmentId, images: images || []
  });
  if (error) {
    console.error("Error creating post:", error);
  }
  return !error;
}

// ── LẤY BOOKINGS (Admin) ────────────────────────────────────────────────────
export async function fetchBookings(): Promise<BookingRequest[]> {
  const { data, error } = await supabase
    .from('bookings').select('*').order('created_at', { ascending: false });
    
  if (error) {
     console.error("Error fetching bookings:", error);
     return [];
  }
  return (data || []).map((b: any) => ({
    id: b.id, customerName: b.customer_name,
    customerPhone: b.customer_phone, customerEmail: b.customer_email,
    equipmentId: b.equipment_id, equipmentName: b.equipment_name,
    bookingType: b.booking_type, preferredDate: b.preferred_date,
    preferredLocation: b.preferred_location, note: b.note,
    status: b.status, userRole: b.user_role, createdAt: b.created_at
  }));
}

// ── TẠO BOOKING ─────────────────────────────────────────────────────────────
export async function submitBooking(booking: BookingRequest) {
  const { data, error } = await supabase.from('bookings').insert({
    customer_name: booking.customerName, customer_phone: booking.customerPhone,
    customer_email: booking.customerEmail, equipment_id: booking.equipmentId,
    equipment_name: booking.equipmentName, booking_type: booking.bookingType,
    preferred_date: booking.preferredDate, preferred_location: booking.preferredLocation,
    note: booking.note, user_role: booking.userRole
  }).select('id').single();
  if (error) return { success: false, error: error.message };
  return { success: true, id: data?.id };
}

// ── CẬP NHẬT TRẠNG THÁI BOOKING ─────────────────────────────────────────────
export async function updateBookingStatus(id: string, status: string) {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) {
      console.error("Error updating booking status:", error);
  }
  return !error;
}

// ── LẤY DANH MỤC THIẾT BỊ ───────────────────────────────────────────────────
export async function fetchEquipments() {
  const { data, error } = await supabase
    .from('equipments')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching equipments:", error);
    return [];
  }
  return data || [];
}

// ── LẤY DANH SÁCH USER (Admin) ────────────────────────────────────────────────
export async function fetchUsers(): Promise<UserAuthor[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return (data || []).map((u: any) => ({
    id: u.id, name: u.name, email: u.email, avatar: u.avatar,
    role: u.role, roleTitle: u.role_title, isVerified: u.is_verified
  }));
}

// ── AUTH: ĐĂNG KÝ ───────────────────────────────────────────────────────────
export async function signUp(
  email: string, password: string, name: string,
  role: UserRole = 'user', roleTitle?: string
) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { success: false, error: error.message };
  if (data.user) {
    const { error: profileError } = await supabase.from('users').insert({
      auth_id: data.user.id, name, email, role, role_title: roleTitle
    });
    if(profileError) return { success: false, error: profileError.message };
  }
  return { success: true };
}

// ── AUTH: ĐĂNG NHẬP ─────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  const { data: profile, error: profileError } = await supabase
    .from('users').select('*').eq('auth_id', data.user.id).single();
  
  if (profileError || !profile) return { success: false, error: 'Không tìm thấy profile.' };
  
  const user: UserAuthor = {
    id: profile.id, name: profile.name, email: profile.email,
    avatar: profile.avatar, role: profile.role as UserRole,
    roleTitle: profile.role_title, isVerified: profile.is_verified
  };
  return { success: true, user };
}

// ── AUTH: ĐĂNG XUẤT ─────────────────────────────────────────────────────────
export async function signOut() {
  await supabase.auth.signOut();
}

// ── AUTH: SESSION HIỆN TẠI ──────────────────────────────────────────────────
export async function getCurrentUser(): Promise<UserAuthor | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data: profile, error } = await supabase
    .from('users').select('*').eq('auth_id', session.user.id).single();
  
  if (error || !profile) return null;
  return {
    id: profile.id, name: profile.name, email: profile.email,
    avatar: profile.avatar, role: profile.role as UserRole,
    roleTitle: profile.role_title, isVerified: profile.is_verified
  };
}
