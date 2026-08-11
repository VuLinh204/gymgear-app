import { supabase } from './supabase';
import { SocialPost, BookingRequest, UserAuthor, UserRole, PostComment } from '@/types';

// ── LẤY POSTS ───────────────────────────────────────────────────────────────
export async function fetchPosts(currentUserId?: string) {
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
  const postIds = (postsRes.data || []).map((p: any) => p.id);

  // Lấy tất cả likes và comments cho các post này (1 lần query)
  const [likesRes, commentsRes] = await Promise.all([
    supabase.from('likes').select('post_id, author_id').in('post_id', postIds),
    supabase.from('comments').select('post_id').in('post_id', postIds),
  ]);

  const likesData = likesRes.data || [];
  const commentsData = commentsRes.data || [];

  // Lấy auth UID để xác định bài đã like
  let currentAuthId: string | undefined;
  if (currentUserId) {
    const { data: { session } } = await supabase.auth.getSession();
    currentAuthId = session?.user?.id;
  }

  // Đếm likes và comments theo post_id
  const likeCountMap: Record<string, number> = {};
  const commentCountMap: Record<string, number> = {};
  const userLikedPostIds = new Set<string>();

  likesData.forEach((l: any) => {
    likeCountMap[l.post_id] = (likeCountMap[l.post_id] || 0) + 1;
    if (currentAuthId && l.author_id === currentAuthId) {
      userLikedPostIds.add(l.post_id);
    }
  });

  commentsData.forEach((c: any) => {
    commentCountMap[c.post_id] = (commentCountMap[c.post_id] || 0) + 1;
  });
  
  return (postsRes.data || []).map((post: any) => ({
    ...post,
    taggedEquipment: equipments.find((eq: any) => eq.id === post.equipment_id) || null,
    likesCount: likeCountMap[post.id] || 0,
    commentsCount: commentCountMap[post.id] || 0,
    isLiked: userLikedPostIds.has(post.id),
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

// ── TOGGLE LIKE (TYM) ────────────────────────────────────────────────────────
export async function toggleLike(postId: string, userId: string): Promise<{ liked: boolean; newCount: number }> {
  // Lấy auth UID của user hiện tại
  const { data: { session } } = await supabase.auth.getSession();
  const authId = session?.user?.id;
  if (!authId) return { liked: false, newCount: 0 };

  // Kiểm tra xem user đã like chưa (dùng author_id)
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('author_id', authId)
    .maybeSingle();

  if (existing) {
    // Đã like → unlike
    await supabase.from('likes').delete().eq('id', existing.id);
  } else {
    // Chưa like → like
    await supabase.from('likes').insert({ post_id: postId, author_id: authId });
  }

  // Đếm số likes hiện tại từ bảng likes
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  return { liked: !existing, newCount: count || 0 };
}

// ── LẤY COMMENTS THEO POST ───────────────────────────────────────────────────
export async function fetchCommentsByPost(postId: string): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, author:users(*)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return (data || []).map((c: any) => ({
    id: c.id,
    content: c.content,
    createdAt: new Date(c.created_at).toLocaleString('vi-VN', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' 
    }),
    likesCount: 0,
    author: {
      id: c.author?.id || '',
      name: c.author?.name || 'Ẩn danh',
      avatar: c.author?.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=anon',
      role: c.author?.role || 'user',
      roleTitle: c.author?.role_title,
      isVerified: c.author?.is_verified,
    }
  }));
}

// ── THÊM COMMENT ─────────────────────────────────────────────────────────────
export async function addComment(postId: string, userId: string, content: string): Promise<PostComment | null> {
  // Lấy auth UID để lưu vào cột auth_id (dùng cho RLS)
  const { data: { session } } = await supabase.auth.getSession();
  const authId = session?.user?.id;
  if (!authId) return null;

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, author_id: authId, content })
    .select('*, author:users(*)')
    .single();

  if (error) {
    console.error("Error adding comment:", error);
    return null;
  }

  return {
    id: data.id,
    content: data.content,
    createdAt: 'Vừa xong',
    likesCount: 0,
    author: {
      id: data.author?.id || '',
      name: data.author?.name || 'Ẩn danh',
      avatar: data.author?.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=anon',
      role: data.author?.role || 'user',
      roleTitle: data.author?.role_title,
      isVerified: data.author?.is_verified,
    }
  };
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
