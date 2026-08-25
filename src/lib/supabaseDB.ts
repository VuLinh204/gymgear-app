import { supabase } from './supabase';
import { SocialPost, BookingRequest, UserAuthor, UserRole, PostComment } from '@/types';

async function getCurrentAuthId(): Promise<string | undefined> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Unable to resolve current auth session:', error.message);
    return undefined;
  }
  return session?.user?.id;
}

// ── LẤY POSTS ───────────────────────────────────────────────────────────────
export async function fetchPosts(currentUserId?: string) {
  const [postsRes, equipRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*, author:users(*)')
      .or('is_deleted.eq.false,is_deleted.is.null')
      .order('created_at', { ascending: false }),
    supabase.from('equipments').select('*')
  ]);

  if (postsRes.error) {
    console.error("Error fetching posts:", postsRes.error);
    return [];
  }

  const equipments = equipRes.data || [];
  const postIds = (postsRes.data || []).map((p: any) => p.id);

  // Lấy tất cả likes, comments và reposts cho các post này (1 lần query)
  const [likesRes, commentsRes, repostsRes] = await Promise.all([
    supabase.from('likes').select('post_id, author_id').in('post_id', postIds),
    supabase.from('comments').select('post_id').in('post_id', postIds),
    supabase.from('reposts').select('post_id, author_auth').in('post_id', postIds),
  ]);

  const likesData = likesRes.data || [];
  const commentsData = commentsRes.data || [];
  const repostsData = repostsRes.data || [];

  // Lấy auth UID để xác định bài đã like và đã bookmark
  const currentAuthId = await getCurrentAuthId();

  // Lấy danh sách bookmark của user hiện tại (fail gracefully nếu bảng chưa tồn tại)
  let userBookmarkedPostIds = new Set<string>();
  if (currentAuthId && postIds.length > 0) {
    try {
      const { data: bookmarkData, error: bkErr } = await supabase
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', currentAuthId)
        .in('post_id', postIds);
      if (!bkErr) {
        (bookmarkData || []).forEach((b: any) => userBookmarkedPostIds.add(b.post_id));
      }
    } catch (_) { /* bảng bookmarks chưa tồn tại */ }
  }

  // Đếm likes và comments theo post_id
  const likeCountMap: Record<string, number> = {};
  const commentCountMap: Record<string, number> = {};
  const repostCountMap: Record<string, number> = {};
  const userRepostedPostIds = new Set<string>();
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

  (repostsData || []).forEach((r: any) => {
    repostCountMap[r.post_id] = (repostCountMap[r.post_id] || 0) + 1;
    if (currentAuthId && r.author_auth === currentAuthId) userRepostedPostIds.add(r.post_id);
  });

  return (postsRes.data || []).map((post: any) => ({
    ...post,
    taggedEquipment: equipments.find((eq: any) => eq.id === post.equipment_id) || null,
    likesCount: likeCountMap[post.id] || 0,
    commentsCount: commentCountMap[post.id] || 0,
    sharesCount: repostCountMap[post.id] || 0,
    isReposted: userRepostedPostIds.has(post.id),
    isLiked: userLikedPostIds.has(post.id),
    isBookmarked: userBookmarkedPostIds.has(post.id),
  }));
}

// ── REPOST (SHARE) HELPERS ─────────────────────────────────────────────────
export async function toggleRepost(postId: string): Promise<{ reposted: boolean; count: number }> {
  const authId = await getCurrentAuthId();
  if (!authId) return { reposted: false, count: 0 };

  // check existing
  const { data: existing } = await supabase.from('reposts').select('id').eq('post_id', postId).eq('author_auth', authId).maybeSingle();
  if (existing && existing.id) {
    await supabase.from('reposts').delete().eq('id', existing.id);
  } else {
    await supabase.from('reposts').insert({ post_id: postId, author_auth: authId });
  }

  const { count } = await supabase.from('reposts').select('*', { count: 'exact', head: true }).eq('post_id', postId);
  return { reposted: !existing, count: count || 0 };
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
  const authId = await getCurrentAuthId();
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

// ── LẤY COMMENTS THEO POST (Hỗ trợ lồng nhau dạng TikTok/Facebook) ───────────
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

  // Đọc danh sách like comment từ cache
  const likedCommentIds = new Set<string>();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gymgear_comment_likes');
      if (stored) JSON.parse(stored).forEach((id: string) => likedCommentIds.add(id));
    } catch (_) {}
  }

  // 1. Chuyển đổi toàn bộ raw comments
  const rawList: PostComment[] = (data || []).map((c: any) => ({
    id: c.id,
    content: c.content,
    createdAt: new Date(c.created_at).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
    }),
    likesCount: c.likes_count || (likedCommentIds.has(c.id) ? 1 : 0),
    isLiked: likedCommentIds.has(c.id),
    parentId: c.parent_id || null,
    replyToUser: c.reply_to_user || null,
    replies: [],
    author: {
      id: c.author?.id || '',
      name: c.author?.name || 'Ẩn danh',
      avatar: c.author?.avatar || '/default-avatar.svg',
      role: c.author?.role || 'user',
      roleTitle: c.author?.role_title,
      isVerified: c.author?.is_verified,
    }
  }));

  // 2. Gom nhóm theo cấu trúc cây (Root comments chứa replies)
  const commentMap = new Map<string, PostComment>();
  const rootComments: PostComment[] = [];

  rawList.forEach(c => {
    commentMap.set(c.id, { ...c, replies: [] });
  });

  rawList.forEach(c => {
    const item = commentMap.get(c.id)!;
    if (c.parentId && commentMap.has(c.parentId)) {
      const parent = commentMap.get(c.parentId)!;
      parent.replies = parent.replies || [];
      parent.replies.push(item);
    } else {
      rootComments.push(item);
    }
  });

  return rootComments;
}

// ── THÊM COMMENT (Hỗ trợ trả lời lồng nhau) ───────────────────────────────────
export async function addComment(
  postId: string, 
  userId: string, 
  content: string,
  parentId?: string | null,
  replyToUser?: string | null
): Promise<PostComment | null> {
  const { data: { session } } = await supabase.auth.getSession();
  const authId = session?.user?.id;
  if (!authId) return null;

  let insertedData: any = null;

  // Thử insert có kèm parent_id & reply_to_user
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({ 
        post_id: postId, 
        user_id: userId, 
        author_id: authId, 
        content,
        parent_id: parentId || null,
        reply_to_user: replyToUser || null
      })
      .select('*, author:users(*)')
      .single();

    if (!error && data) {
      insertedData = data;
    }
  } catch (_) {}

  // Fallback nếu cột parent_id chưa có trong Supabase
  if (!insertedData) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: userId, author_id: authId, content })
      .select('*, author:users(*)')
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      return null;
    }
    insertedData = data;
  }

  return {
    id: insertedData.id,
    content: insertedData.content,
    createdAt: 'Vừa xong',
    likesCount: 0,
    isLiked: false,
    parentId: parentId || insertedData.parent_id || null,
    replyToUser: replyToUser || insertedData.reply_to_user || null,
    replies: [],
    author: {
      id: insertedData.author?.id || '',
      name: insertedData.author?.name || session?.user?.user_metadata?.name || 'Bạn',
      avatar: insertedData.author?.avatar || '/default-avatar.svg',
      role: insertedData.author?.role || 'user',
      roleTitle: insertedData.author?.role_title,
      isVerified: insertedData.author?.is_verified,
    }
  };
}

// ── LIKE COMMENT ─────────────────────────────────────────────────────────────
export function toggleCommentLike(commentId: string): { liked: boolean } {
  if (typeof window === 'undefined') return { liked: false };
  try {
    const stored = localStorage.getItem('gymgear_comment_likes');
    const set = new Set<string>(stored ? JSON.parse(stored) : []);
    const wasLiked = set.has(commentId);
    if (wasLiked) set.delete(commentId);
    else set.add(commentId);
    localStorage.setItem('gymgear_comment_likes', JSON.stringify(Array.from(set)));
    return { liked: !wasLiked };
  } catch (_) {
    return { liked: false };
  }
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

  // Tạo thông báo lịch hẹn
  createNotification({
    userId: 'current_user',
    actorId: 'system',
    actorName: 'Hệ thống Showroom',
    type: 'booking',
    title: 'Đặt lịch Showroom thành công 📅',
    content: `Lịch trải nghiệm ${booking.equipmentName || 'máy Gym'} tại ${booking.preferredLocation || 'Showroom'} đã được ghi nhận. Chuyên viên sẽ sớm liên hệ xác nhận.`,
    targetId: data?.id,
  });

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
    const fmt = (e: any) => {
      try { return JSON.stringify(e, Object.getOwnPropertyNames(e)); }
      catch { return String(e); }
    };
    console.error('Error fetching equipments:', fmt(error), error);
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
  if (error) {
    if (error.message.toLowerCase().includes('rate limit')) {
      return {
        success: false,
        error: 'Đã vượt quá giới hạn gửi email. Vui lòng chờ vài phút rồi thử lại.'
      };
    }
    return { success: false, error: error.message };
  }

  const authId = data.user?.id;
  if (!authId) {
    return { success: false, error: 'Đăng ký thất bại. Vui lòng thử lại sau.' };
  }

  const { error: profileError } = await supabase.from('users').insert({
    auth_id: authId, name, email, role, role_title: roleTitle
  });
  if (profileError) {
    const friendlyMessage = profileError.message.includes('row-level security')
      ? 'Không thể tạo hồ sơ người dùng. Vui lòng liên hệ admin hoặc thử lại sau.'
      : 'Đăng ký thất bại. Vui lòng thử lại.';
    return { success: false, error: friendlyMessage };
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

// ── PROFILE & SETTINGS ───────────────────────────────────────────────────────
export async function fetchUserPosts(userId: string) {
  const [postsRes, equipRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*, author:users(*)')
      .eq('author_id', userId)
      .or('is_deleted.eq.false,is_deleted.is.null')
      .order('created_at', { ascending: false }),
    supabase.from('equipments').select('*')
  ]);

  if (postsRes.error) {
    console.error("Error fetching user posts:", postsRes.error);
    return [];
  }

  const equipments = equipRes.data || [];
  const postIds = (postsRes.data || []).map((p: any) => p.id);

  if (postIds.length === 0) return [];

  const [likesRes, commentsRes] = await Promise.all([
    supabase.from('likes').select('post_id, author_id').in('post_id', postIds),
    supabase.from('comments').select('post_id').in('post_id', postIds),
  ]);

  const likesData = likesRes.data || [];
  const commentsData = commentsRes.data || [];
  const currentAuthId = await getCurrentAuthId();

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
    author: {
      id: post.author.id,
      name: post.author.name,
      avatar: post.author.avatar,
      role: post.author.role,
      roleTitle: post.author.role_title,
      isVerified: post.author.is_verified,
    },
    createdAt: new Date(post.created_at).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
    }),
    taggedEquipment: equipments.find((eq: any) => eq.id === post.equipment_id) || null,
    likesCount: likeCountMap[post.id] || 0,
    commentsCount: commentCountMap[post.id] || 0,
    isLiked: userLikedPostIds.has(post.id),
  }));
}

export async function updateUserProfile(userId: string, data: { name?: string; avatar?: string; roleTitle?: string }) {
  const updates: any = {};
  if (data.name) updates.name = data.name;
  if (data.avatar) updates.avatar = data.avatar;
  if (data.roleTitle !== undefined) updates.role_title = data.roleTitle;

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error("Error updating profile:", error);
    return false;
  }
  return true;
}

export async function upgradeUserRole(userId: string, newRole: UserRole) {
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    console.error("Error upgrading user:", error);
    return false;
  }
  return true;
}

// ── STORAGE: TẢI ẢNH LÊN ───────────────────────────────────────────────────
export async function uploadImage(file: File, folder: 'avatars' | 'posts'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    return null;
  }
}

// ── XOÁ POST (MỀM) ───────────────────────────────────────────────────────────
export async function deletePost(postId: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .update({ is_deleted: true })
    .eq('id', postId);

  if (error) {
    console.error("Error soft deleting post:", error.message);
    return false;
  }
  return true;
}

// ── KHÔI PHỤC POST ──────────────────────────────────────────────────────────
export async function restorePost(postId: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .update({ is_deleted: false })
    .eq('id', postId);

  if (error) {
    console.error("Error restoring post:", error.message);
    return false;
  }
  return true;
}

// ── XOÁ POST VĨNH VIỄN ───────────────────────────────────────────────────────
export async function hardDeletePost(postId: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error("Error hard deleting post:", error.message);
    return false;
  }
  return true;
}

// ── LẤY BÀI VIẾT ĐÃ XOÁ MỀM ──────────────────────────────────────────────────
export async function fetchDeletedPosts(userId: string) {
  const [postsRes, equipRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*, author:users(*)')
      .eq('author_id', userId)
      .eq('is_deleted', true)
      .order('created_at', { ascending: false }),
    supabase.from('equipments').select('*')
  ]);

  if (postsRes.error) {
    console.error("Error fetching deleted posts:", postsRes.error);
    return [];
  }

  const equipments = equipRes.data || [];
  const postIds = (postsRes.data || []).map((p: any) => p.id);

  if (postIds.length === 0) return [];

  const [likesRes, commentsRes] = await Promise.all([
    supabase.from('likes').select('post_id, author_id').in('post_id', postIds),
    supabase.from('comments').select('post_id').in('post_id', postIds),
  ]);

  const likesData = likesRes.data || [];
  const commentsData = commentsRes.data || [];
  const currentAuthId = await getCurrentAuthId();

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
    author: {
      id: post.author.id,
      name: post.author.name,
      avatar: post.author.avatar,
      role: post.author.role,
      roleTitle: post.author.role_title,
      isVerified: post.author.is_verified,
    },
    createdAt: new Date(post.created_at).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
    }),
    taggedEquipment: equipments.find((eq: any) => eq.id === post.equipment_id) || null,
    likesCount: likeCountMap[post.id] || 0,
    commentsCount: commentCountMap[post.id] || 0,
    isLiked: userLikedPostIds.has(post.id),
  }));
}

// ── CẬP NHẬT NỘI DUNG POST ───────────────────────────────────────────────────
export async function updatePost(
  postId: string,
  content: string,
  rating: number,
  equipmentId?: string,
  images?: string[]
): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .update({
      content,
      rating,
      equipment_id: equipmentId || null,
      ...(images !== undefined && { images })
    })
    .eq('id', postId);

  if (error) {
    console.error("Error updating post:", error.message);
    return false;
  }
  return true;
}

// ── TOGGLE BOOKMARK (LƯU BÀI) ────────────────────────────────────────────────
export async function toggleBookmark(postId: string): Promise<{ bookmarked: boolean; error?: string }> {
  const authId = await getCurrentAuthId();
  if (!authId) return { bookmarked: false, error: 'not_authenticated' };

  const { data: existing, error: selectErr } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', authId)
    .maybeSingle();

  if (selectErr) {
    console.error('Bookmark select error:', selectErr.message);
    return { bookmarked: false, error: selectErr.message };
  }

  if (existing) {
    const { error: delErr } = await supabase.from('bookmarks').delete().eq('id', existing.id);
    if (delErr) return { bookmarked: true, error: delErr.message };
    return { bookmarked: false };
  } else {
    const { error: insErr } = await supabase.from('bookmarks').insert({ post_id: postId, user_id: authId });
    if (insErr) return { bookmarked: false, error: insErr.message };
    return { bookmarked: true };
  }
}

// ── LẤY BÀI VIẾT ĐÃ LƯU CỦA USER ───────────────────────────────────────────
export async function fetchBookmarkedPosts(userId: string) {
  const authId = await getCurrentAuthId();
  if (!authId) return [];

  const { data: bookmarkData, error: bErr } = await supabase
    .from('bookmarks')
    .select('post_id')
    .eq('user_id', authId);

  if (bErr || !bookmarkData || bookmarkData.length === 0) return [];

  const postIds = bookmarkData.map((b: any) => b.post_id);

  const [postsRes, equipRes, likesRes, commentsRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*, author:users(*)')
      .in('id', postIds)
      .or('is_deleted.eq.false,is_deleted.is.null')
      .order('created_at', { ascending: false }),
    supabase.from('equipments').select('*'),
    supabase.from('likes').select('post_id, author_id').in('post_id', postIds),
    supabase.from('comments').select('post_id').in('post_id', postIds),
  ]);

  if (postsRes.error || !postsRes.data) return [];

  const equipments = equipRes.data || [];
  const likesData = likesRes.data || [];
  const commentsData = commentsRes.data || [];

  const likeCountMap: Record<string, number> = {};
  const commentCountMap: Record<string, number> = {};
  const userLikedPostIds = new Set<string>();

  likesData.forEach((l: any) => {
    likeCountMap[l.post_id] = (likeCountMap[l.post_id] || 0) + 1;
    if (l.author_id === authId) userLikedPostIds.add(l.post_id);
  });

  commentsData.forEach((c: any) => {
    commentCountMap[c.post_id] = (commentCountMap[c.post_id] || 0) + 1;
  });

  return postsRes.data.map((post: any) => ({
    ...post,
    author: {
      id: post.author.id,
      name: post.author.name,
      avatar: post.author.avatar,
      role: post.author.role,
      roleTitle: post.author.role_title,
      isVerified: post.author.is_verified,
    },
    createdAt: new Date(post.created_at).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
    }),
    taggedEquipment: equipments.find((eq: any) => eq.id === post.equipment_id) || null,
    likesCount: likeCountMap[post.id] || 0,
    commentsCount: commentCountMap[post.id] || 0,
    isLiked: userLikedPostIds.has(post.id),
    isBookmarked: true,
  }));
}

// ── LẤY THÔNG TIN USER THEO ID ───────────────────────────────────────────────
export async function fetchUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    role: data.role,
    roleTitle: data.role_title,
    isVerified: data.is_verified,
  };
}

// ── FOLLOW HELPERS ───────────────────────────────────────────────────────
async function getAuthIdByUserId(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('users').select('auth_id').eq('id', userId).single();
  if (error || !data) return null;
  return data.auth_id || null;
}

export async function getFollowersCountByUserId(userId: string): Promise<number> {
  const authId = await getAuthIdByUserId(userId);
  if (!authId) return 0;
  const { count } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_auth', authId);
  return count || 0;
}

export async function getFollowingCountByUserId(userId: string): Promise<number> {
  const authId = await getAuthIdByUserId(userId);
  if (!authId) return 0;
  const { count } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_auth', authId);
  return count || 0;
}

export async function isFollowingUser(targetUserId: string, followerUserId?: string): Promise<boolean> {
  let followerAuthId: string | null = null;
  if (followerUserId) {
    followerAuthId = await getAuthIdByUserId(followerUserId);
  }
  if (!followerAuthId) {
    followerAuthId = await getCurrentAuthId() as string | null;
  }
  if (!followerAuthId) return false;
  const targetAuth = await getAuthIdByUserId(targetUserId);
  if (!targetAuth) return false;
  const { data, error } = await supabase.from('follows').select('id').eq('follower_auth', followerAuthId).eq('following_auth', targetAuth).maybeSingle();
  if (error) console.error('isFollowingUser: select error', error);
  return !!(data && data.id);
}

export async function toggleFollowUser(targetUserId: string, followerUserId?: string): Promise<{ following: boolean; followersCount: number }> {
  let currentAuthId = await getCurrentAuthId();
  if (!currentAuthId && followerUserId) {
    currentAuthId = (await getAuthIdByUserId(followerUserId)) ?? undefined;
  }
  if (!currentAuthId) return { following: false, followersCount: 0 };
  const targetAuth = await getAuthIdByUserId(targetUserId);
  if (!targetAuth) return { following: false, followersCount: 0 };

  const { data: existing, error: selErr } = await supabase.from('follows').select('id').eq('follower_auth', currentAuthId).eq('following_auth', targetAuth).maybeSingle();
  if (selErr) console.error('toggleFollowUser: select error', selErr);

  if (existing && existing.id) {
    const { error: delErr } = await supabase.from('follows').delete().eq('id', existing.id);
    if (delErr) console.error('toggleFollowUser: delete error', delErr);
  } else {
    const { data: insData, error: insErr } = await supabase.from('follows').insert({ follower_auth: currentAuthId, following_auth: targetAuth }).select('id');
    if (insErr) console.error('toggleFollowUser: insert error', insErr);

    // Bắn thông báo theo dõi mới
    createNotification({
      userId: targetUserId,
      actorId: currentAuthId,
      actorName: 'Một gymer',
      type: 'follow',
      title: 'Người theo dõi mới 👤',
      content: 'Một thành viên vừa bắt đầu theo dõi hồ sơ của bạn.',
      targetId: targetUserId,
    });
  }

  const followers = await getFollowersCountByUserId(targetUserId);
  return { following: !existing, followersCount: followers };
}

export async function fetchUserFollowers(userId: string): Promise<UserAuthor[]> {
  try {
    const targetAuth = await getAuthIdByUserId(userId);
    if (!targetAuth) return [];

    // Lấy tất cả auth_id của người theo dõi
    const { data: followRows, error } = await supabase
      .from('follows')
      .select('follower_auth')
      .eq('following_auth', targetAuth);

    if (error) { console.error('fetchUserFollowers follows error:', error); return []; }
    if (!followRows || followRows.length === 0) return [];

    const followerAuthIds = followRows.map((r: any) => r.follower_auth);

    // Tìm users theo auth_id
    const { data: users, error: uErr } = await supabase
      .from('users')
      .select('id, name, avatar, role, role_title, is_verified, auth_id')
      .in('auth_id', followerAuthIds);

    if (uErr) { console.error('fetchUserFollowers users error:', uErr); return []; }
    if (!users || users.length === 0) {
      console.warn('fetchUserFollowers: found follows but no matching users. authIds:', followerAuthIds);
      return [];
    }

    return users.map((u: any) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=' + u.id,
      role: u.role || 'user',
      roleTitle: u.role_title || 'Thành viên Gymer',
      isVerified: !!u.is_verified,
      gymBranch: 'Showroom GymGear',
    }));
  } catch (e) {
    console.error('fetchUserFollowers exception:', e);
    return [];
  }
}

export async function fetchUserFollowing(userId: string): Promise<UserAuthor[]> {
  try {
    const followerAuth = await getAuthIdByUserId(userId);
    if (!followerAuth) return [];

    // Lấy tất cả auth_id của người đang được theo dõi
    const { data: followRows, error } = await supabase
      .from('follows')
      .select('following_auth')
      .eq('follower_auth', followerAuth);

    if (error) { console.error('fetchUserFollowing follows error:', error); return []; }
    if (!followRows || followRows.length === 0) return [];

    const followingAuthIds = followRows.map((r: any) => r.following_auth);

    // Tìm users theo auth_id
    const { data: users, error: uErr } = await supabase
      .from('users')
      .select('id, name, avatar, role, role_title, is_verified, auth_id')
      .in('auth_id', followingAuthIds);

    if (uErr) { console.error('fetchUserFollowing users error:', uErr); return []; }
    if (!users || users.length === 0) {
      console.warn('fetchUserFollowing: found follows but no matching users. authIds:', followingAuthIds);
      return [];
    }

    return users.map((u: any) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar || 'https://api.dicebear.com/8.x/avataaars/svg?seed=' + u.id,
      role: u.role || 'user',
      roleTitle: u.role_title || 'Thành viên Gymer',
      isVerified: !!u.is_verified,
      gymBranch: 'Showroom GymGear',
    }));
  } catch (e) {
    console.error('fetchUserFollowing exception:', e);
    return [];
  }
}

function getFallbackFollowers(): UserAuthor[] {
  return [
    {
      id: 'pt-tuananh',
      name: 'Tuấn Anh (Master Trainer)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'HLV Trưởng Thể Hình 8 Năm',
      isVerified: true,
      gymBranch: 'Showroom Cầu Giấy, Hà Nội',
    },
    {
      id: 'pt-lananh',
      name: 'Lan Anh (Bikini Fitness)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Vận Động Viên Thể Hình',
      isVerified: true,
      gymBranch: 'Showroom Bình Thạnh, TP.HCM',
    },
    {
      id: 'gymer-nam',
      name: 'Trần Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Powerlifter (PR 220kg)',
      isVerified: false,
      gymBranch: 'Showroom Đà Nẵng',
    },
    {
      id: 'showroom-support',
      name: 'GymGear Showroom Support',
      avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      roleTitle: 'Chuyên Viên Kỹ Thuật Máy Gym',
      isVerified: true,
      gymBranch: 'Tổng Đài Showroom Toàn Quốc',
    },
  ];
}

function getFallbackFollowing(): UserAuthor[] {
  return [
    {
      id: 'pt-tuananh',
      name: 'Tuấn Anh (Master Trainer)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'HLV Trưởng Thể Hình 8 Năm',
      isVerified: true,
      gymBranch: 'Showroom Cầu Giấy, Hà Nội',
    },
    {
      id: 'pt-lananh',
      name: 'Lan Anh (Bikini Fitness)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Vận Động Viên Thể Hình',
      isVerified: true,
      gymBranch: 'Showroom Bình Thạnh, TP.HCM',
    },
    {
      id: 'showroom-support',
      name: 'GymGear Showroom Support',
      avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      roleTitle: 'Chuyên Viên Kỹ Thuật Máy Gym',
      isVerified: true,
      gymBranch: 'Tổng Đài Showroom Toàn Quốc',
    },
  ];
}

// ── TOP USERS BY FOLLOWERS ────────────────────────────────────────────────────
export interface TopUser {
  id: string;
  name: string;
  avatar: string;
  roleTitle?: string;
  followersCount: number;
}

export async function getTopUsersByFollowers(limit: number = 3): Promise<TopUser[]> {
  // Đếm số follows theo following_auth, join với users để lấy thông tin
  const { data, error } = await supabase
    .from('follows')
    .select('following_auth')
    .limit(1000); // Lấy đủ dữ liệu để đếm

  if (error || !data) return [];

  // Đếm follower theo từng following_auth
  const countMap: Record<string, number> = {};
  data.forEach((row: any) => {
    countMap[row.following_auth] = (countMap[row.following_auth] || 0) + 1;
  });

  // Sort theo số followers giảm dần
  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit * 2); // Lấy dư để phòng user không tồn tại

  if (sorted.length === 0) return [];

  const authIds = sorted.map(([authId]) => authId);

  // Lấy thông tin user theo auth_id
  const { data: users, error: userErr } = await supabase
    .from('users')
    .select('id, name, avatar, role_title')
    .in('auth_id', authIds);

  if (userErr || !users) return [];

  // Map auth_id → user info
  const userMap: Record<string, any> = {};
  // We need auth_id in users query
  const { data: usersWithAuth } = await supabase
    .from('users')
    .select('id, auth_id, name, avatar, role_title')
    .in('auth_id', authIds);

  (usersWithAuth || []).forEach((u: any) => {
    userMap[u.auth_id] = u;
  });

  const result: TopUser[] = sorted
    .filter(([authId]) => userMap[authId])
    .slice(0, limit)
    .map(([authId, count]) => ({
      id: userMap[authId].id,
      name: userMap[authId].name,
      avatar: userMap[authId].avatar || '/default-avatar.svg',
      roleTitle: userMap[authId].role_title,
      followersCount: count,
    }));

  return result;
}

// ── STORIES ──────────────────────────────────────────────────────────────────
export interface Story {
  id: string;
  authorId: string;
  authorAuth?: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  expiresAt: string;
  likes?: string[]; // Array of user IDs who liked this story (mỗi người 1 tym)
}

export interface StoryViewerInfo {
  userId: string;
  name: string;
  avatar: string;
  role?: string;
  viewedAt: string;
  liked?: boolean;
}

const LOCAL_STORIES_KEY = 'gymgear_active_stories';
const STORY_LIKES_KEY = 'gymgear_story_likes_map';
const STORY_VIEWERS_KEY = 'gymgear_story_viewers_map';

// ── STORY VIEWERS: Supabase DB (story_views table) ──────────────────────────────
// Bảng: story_views (id uuid, story_id uuid, viewer_id uuid, viewed_at timestamptz)
// viewer_id FK → users.id (profile table)

export async function getStoryViewers(storyId: string): Promise<StoryViewerInfo[]> {
  try {
    // Lấy danh sách viewer_id + viewed_at từ DB
    const { data: viewRows, error } = await supabase
      .from('story_views')
      .select('viewer_id, viewed_at')
      .eq('story_id', storyId)
      .order('viewed_at', { ascending: false });

    if (error || !viewRows || viewRows.length === 0) return [];

    // Lấy thông tin profile (name, avatar, role) của từng viewer
    const viewerIds = viewRows.map((r: any) => r.viewer_id).filter(Boolean);
    const { data: usersData } = await supabase
      .from('users')
      .select('id, name, avatar, role')
      .in('id', viewerIds);

    const userMap: Record<string, any> = {};
    (usersData || []).forEach((u: any) => { userMap[u.id] = u; });

    // Ghép likes từ localStorage để hiển thị trái tim
    const likesMap = getStoryLikesMap();
    const likedUserIds = likesMap[storyId] || [];

    return viewRows.map((row: any) => {
      const user = userMap[row.viewer_id] || {};
      return {
        userId: row.viewer_id,
        name: user.name || 'Thành viên',
        avatar: user.avatar || '/default-avatar.svg',
        role: user.role || 'user',
        viewedAt: row.viewed_at,
        liked: likedUserIds.includes(row.viewer_id),
      } as StoryViewerInfo;
    });
  } catch (err) {
    console.warn('Lỗi getStoryViewers:', err);
    return [];
  }
}

export async function recordStoryView(
  storyId: string,
  viewer: { id: string; name: string; avatar?: string; role?: string }
): Promise<void> {
  // Không ghi nếu chưa có ID hợp lệ (guest / current_user fallback)
  if (!viewer.id || viewer.id === 'current_user') return;

  try {
    // Upsert để tránh duplicate (story_id + viewer_id unique)
    // Nếu đã xem rồi thì cập nhật viewed_at → luôn cập nhật "vừa xem"
    const { error } = await supabase
      .from('story_views')
      .upsert(
        { story_id: storyId, viewer_id: viewer.id, viewed_at: new Date().toISOString() },
        { onConflict: 'story_id,viewer_id', ignoreDuplicates: false }
      );

    if (error) {
      console.warn('recordStoryView DB error:', error.message);
    }
  } catch (err) {
    console.warn('Lỗi recordStoryView:', err);
  }
}


export function getStoryLikesMap(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORY_LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoryLikes(storyId: string): { count: number; userIds: string[] } {
  const map = getStoryLikesMap();
  const userIds = map[storyId] || [];
  return { count: userIds.length, userIds };
}

export async function toggleStoryLike(
  story: Story,
  user: { id: string; name: string; avatar?: string }
): Promise<{ liked: boolean; likesCount: number; userIds: string[] }> {
  const map = getStoryLikesMap();
  const currentLikes = map[story.id] || [];
  const isCurrentlyLiked = currentLikes.includes(user.id);

  let newLikes: string[];
  if (isCurrentlyLiked) {
    // Bỏ thả tim
    newLikes = currentLikes.filter((uid) => uid !== user.id);
  } else {
    // Thả tim (đảm bảo mỗi user chỉ có đúng 1 tim)
    newLikes = [...currentLikes.filter((uid) => uid !== user.id), user.id];
  }

  map[story.id] = newLikes;
  try {
    localStorage.setItem(STORY_LIKES_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('Không thể lưu story like vào localStorage:', e);
  }

  // Khi thả tim (không phải bỏ tym), gửi thông báo ngay cho chủ story
  if (!isCurrentlyLiked) {
    const targetUserId = story.authorId || story.authorAuth;
    if (targetUserId && targetUserId !== user.id && targetUserId !== 'current_user') {
      await createNotification({
        userId: targetUserId,
        actorId: user.id,
        actorName: user.name || 'Thành viên',
        actorAvatar: user.avatar || '/default-avatar.svg',
        type: 'like',
        title: 'Thả tim Story',
        content: `${user.name || 'Ai đó'} đã thả tim story của bạn! ❤️`,
        targetId: story.id,
      });
    }
  }

  return {
    liked: !isCurrentlyLiked,
    likesCount: newLikes.length,
    userIds: newLikes,
  };
}

function getLocalStories(): Story[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORIES_KEY);
    if (!raw) return [];
    const parsed: Story[] = JSON.parse(raw);
    const now = Date.now();
    const likesMap = getStoryLikesMap();
    // Lọc các story chưa hết hạn (24h) & gắn like thực tế
    return parsed
      .filter(s => new Date(s.expiresAt).getTime() > now)
      .map(s => ({
        ...s,
        likes: likesMap[s.id] || s.likes || [],
      }));
  } catch {
    return [];
  }
}

function saveLocalStory(story: Story) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStories();
    const updated = [story, ...current.filter(s => s.id !== story.id)];
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Không thể lưu story vào localStorage:', e);
  }
}

function removeLocalStory(storyId: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStories();
    const updated = current.filter(s => s.id !== storyId);
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Không thể xóa story từ localStorage:', e);
  }
}

export async function fetchActiveStories(): Promise<Story[]> {
  let dbStories: Story[] = [];

  try {
    // Query stories kèm thông tin author (2 bước để tránh lỗi FK)
    const { data: rawData, error: rawError } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (!rawError && rawData) {
      const userIds = Array.from(new Set(rawData.map((s: any) => s.author_id).filter(Boolean)));
      let userMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: usersData } = await supabase.from('users').select('id, name, avatar').in('id', userIds);
        (usersData || []).forEach((u: any) => { userMap[u.id] = u; });
      }

      const nowTime = Date.now();
      const likesMap = getStoryLikesMap();
      dbStories = rawData
        .filter((s: any) => !s.expires_at || new Date(s.expires_at).getTime() > nowTime)
        .map((s: any) => {
          const user = userMap[s.author_id];
          return {
            id: s.id,
            authorId: s.author_id || s.author_auth || '',
            authorAuth: s.author_auth || '',
            authorName: user?.name || 'Thành viên',
            authorAvatar: user?.avatar || '/default-avatar.svg',
            imageUrl: s.image_url,
            caption: s.caption,
            createdAt: s.created_at || new Date().toISOString(),
            expiresAt: s.expires_at || new Date(Date.now() + 86400000).toISOString(),
            likes: likesMap[s.id] || [],
          };
        });
    }
  } catch (err) {
    console.warn('Lỗi khi tải stories từ Supabase:', err);
  }

  // Kết hợp với Local Stories (đảm bảo story vừa đăng hiển thị 100% ngay lập tức)
  const localStories = getLocalStories();
  const storyMap = new Map<string, Story>();
  localStories.forEach(s => storyMap.set(s.id, s));
  dbStories.forEach(s => storyMap.set(s.id, s));

  return Array.from(storyMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createStory(
  imageUrl: string, 
  caption?: string, 
  equipmentId?: string
): Promise<{ success: boolean; error?: string; story?: Story }> {
  const { data: { session } } = await supabase.auth.getSession();
  const authId = session?.user?.id;

  // Lấy thông tin user hiện tại (hồ sơ profile)
  let userProfile: any = null;
  if (authId) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle();
    userProfile = profile;
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const newStoryId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `story_${Date.now()}`;

  const createdStory: Story = {
    id: newStoryId,
    authorId: userProfile?.id || authId || 'current_user',
    authorAuth: authId || '',
    authorName: userProfile?.name || session?.user?.user_metadata?.name || 'Bạn',
    authorAvatar: userProfile?.avatar || '/default-avatar.svg',
    imageUrl: imageUrl,
    caption: caption,
    createdAt: now.toISOString(),
    expiresAt: expiresAt,
  };

  // 1. Lưu ngay vào LocalStorage để story hiển thị ngay lập tức (Instant UI)
  saveLocalStory(createdStory);

  // 2. Ghi vào Supabase Database nếu đã có phiên đăng nhập
  if (authId) {
    const payload: any = {
      id: newStoryId,
      author_auth: authId,
      image_url: imageUrl,
      caption: caption || null,
      created_at: now.toISOString(),
      expires_at: expiresAt,
    };

    if (userProfile?.id) payload.author_id = userProfile.id;
    if (equipmentId) payload.equipment_id = equipmentId;

    try {
      const { error } = await supabase.from('stories').insert(payload);
      if (error) {
        console.warn('Supabase DB insert warning (đã lưu local story):', error.message);
      }
    } catch (dbErr) {
      console.warn('Supabase insert exception:', dbErr);
    }
  }

  return { success: true, story: createdStory };
}

export async function deleteStory(storyId: string): Promise<boolean> {
  removeLocalStory(storyId);
  try {
    const { error } = await supabase.from('stories').delete().eq('id', storyId);
    if (error) console.warn('deleteStory Supabase DB:', error.message);
  } catch (e) {
    console.warn('deleteStory error:', e);
  }
  return true;
}

// ── 🔔 NOTIFICATIONS SYSTEM ──────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  userId: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  type: 'like' | 'comment' | 'follow' | 'booking' | 'system' | 'pr';
  title: string;
  content: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

const LOCAL_NOTIFS_KEY = 'gymgear_notifications_cache';

const INITIAL_SAMPLE_NOTIFS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'current_user',
    actorId: 'usr-pt-1',
    actorName: 'HLV Tuấn Anh',
    actorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&auto=format&fit=crop&q=80',
    type: 'booking',
    title: 'Lịch hẹn Showroom đã được xác nhận',
    content: 'Buổi trải nghiệm máy Impulse PT300H tại Showroom Cầu Giấy đã sẵn sàng.',
    targetId: 'bk-1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'current_user',
    actorId: 'usr-2',
    actorName: 'Minh Hoàng Gym',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    type: 'like',
    title: 'Đã thả tim bài viết của bạn',
    content: 'Minh Hoàng và 4 người khác đã thích bài viết review máy Smith Machine của bạn.',
    targetId: 'post-1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'current_user',
    actorId: 'system',
    actorName: 'Hệ thống GymGear',
    actorAvatar: '/default-avatar.svg',
    type: 'system',
    title: 'Chào mừng thành viên VIP',
    content: 'Bạn được nhận ưu đãi chiết khấu 15% khi đặt lịch mua thiết bị hôm nay.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

function getLocalNotifs(): AppNotification[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_NOTIFS;
  try {
    const raw = localStorage.getItem(LOCAL_NOTIFS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(INITIAL_SAMPLE_NOTIFS));
      return INITIAL_SAMPLE_NOTIFS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_NOTIFS;
  }
}

function saveLocalNotifs(notifs: AppNotification[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.warn('Không thể lưu notifications vào localStorage:', e);
  }
}

export async function fetchNotifications(userId?: string): Promise<AppNotification[]> {
  // Bảng notifications chưa được tạo trong DB → dùng localStorage với sample + real notifications
  const local = getLocalNotifs();
  
  // Filter cho đúng người nhận (userId = 'current_user' là broadcast/system chung)
  const filtered = local.filter(n => {
    if (!userId) return true;
    return n.userId === userId || n.userId === 'current_user';
  });

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createNotification(notif: {
  userId?: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  type: 'like' | 'comment' | 'follow' | 'booking' | 'system' | 'pr';
  title: string;
  content: string;
  targetId?: string;
}): Promise<AppNotification> {
  const newNotif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    userId: notif.userId || 'current_user',
    actorId: notif.actorId || 'current_user',
    actorName: notif.actorName || 'Thành viên',
    actorAvatar: notif.actorAvatar || '/default-avatar.svg',
    type: notif.type,
    title: notif.title,
    content: notif.content,
    targetId: notif.targetId,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const list = getLocalNotifs();
  // Đưa thông báo mới lên đầu
  saveLocalNotifs([newNotif, ...list]);
  return newNotif;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const local = getLocalNotifs();
  const updated = local.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveLocalNotifs(updated);
  // TODO: await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  return true;
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  const local = getLocalNotifs();
  const updated = local.map(n => ({ ...n, isRead: true }));
  saveLocalNotifs(updated);
  // TODO: await supabase.from('notifications').update({ is_read: true }).eq('user_id', authId);
  return true;
}

// ── 💬 DIRECT GYM CHAT SYSTEM ────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  equipmentId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  roleTitle: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const LOCAL_CHAT_KEY = 'gymgear_chat_messages_cache';

const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: 'pt-tuananh',
    name: 'HLV Tuấn Anh (PT Chuyên Sâu)',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Master Trainer • Impulse Fitness',
    isOnline: true,
    lastMessage: 'Chào bạn! Bạn cần tư vấn về máy tập hay lịch tập Push-Pull-Legs?',
    lastMessageTime: 'Vừa xong',
    unreadCount: 1,
  },
  {
    id: 'showroom-support',
    name: 'Tư Vấn Showroom GymGear',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Chuyên viên Thiết Bị Cao Cấp',
    isOnline: true,
    lastMessage: 'Showroom Cầu Giấy và Bình Thạnh hiện đang có sẵn máy DHZ Fusion để thử.',
    lastMessageTime: '15 phút trước',
    unreadCount: 0,
  },
  {
    id: 'gymer-lananh',
    name: 'Lan Anh Fitness',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Hội viên VIP • 3 năm kinh nghiệm',
    isOnline: false,
    lastMessage: 'Máy Smith Machine tập mông đùi cực vào cơ luôn nhé bạn!',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'pt-tuananh': [
    {
      id: 'msg-1',
      conversationId: 'pt-tuananh',
      senderId: 'pt-tuananh',
      senderName: 'HLV Tuấn Anh',
      senderAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&auto=format&fit=crop&q=80',
      receiverId: 'current_user',
      text: 'Chào bạn! Mình là Tuấn Anh - HLV tại GymGear. Bạn cần tư vấn về máy tập hay lịch tập Push-Pull-Legs?',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      isRead: true,
    },
  ],
  'showroom-support': [
    {
      id: 'msg-2',
      conversationId: 'showroom-support',
      senderId: 'showroom-support',
      senderName: 'Tư Vấn Showroom GymGear',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      receiverId: 'current_user',
      text: 'Showroom Cầu Giấy và Bình Thạnh hiện đang có sẵn máy DHZ Fusion để thử.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
    },
  ],
};

function getLocalChatData(): Record<string, ChatMessage[]> {
  if (typeof window === 'undefined') return INITIAL_MESSAGES;
  try {
    const raw = localStorage.getItem(LOCAL_CHAT_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MESSAGES;
  }
}

function saveLocalChatData(data: Record<string, ChatMessage[]>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Lỗi lưu tin nhắn chat:', e);
  }
}

export async function fetchChatContacts(): Promise<ChatContact[]> {
  return INITIAL_CONTACTS;
}

export async function fetchChatMessages(contactId: string): Promise<ChatMessage[]> {
  const localData = getLocalChatData();
  const messages = localData[contactId] || [];
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export async function sendChatMessage(
  contactId: string,
  text: string,
  imageUrl?: string,
  equipmentId?: string,
  currentUser?: UserAuthor
): Promise<ChatMessage> {
  const now = new Date();
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    conversationId: contactId,
    senderId: currentUser?.id || 'current_user',
    senderName: currentUser?.name || 'Bạn',
    senderAvatar: currentUser?.avatar || '/default-avatar.svg',
    receiverId: contactId,
    text,
    imageUrl,
    equipmentId,
    createdAt: now.toISOString(),
    isRead: false,
  };

  const localData = getLocalChatData();
  const currentList = localData[contactId] || [];
  localData[contactId] = [...currentList, newMsg];
  saveLocalChatData(localData);

  // Sync Supabase nếu có DB
  try {
    const authId = await getCurrentAuthId();
    if (authId) {
      await supabase.from('chat_messages').insert({
        conversation_id: contactId,
        sender_id: authId,
        sender_name: currentUser?.name,
        sender_avatar: currentUser?.avatar,
        receiver_id: contactId,
        text,
        image_url: imageUrl,
        equipment_id: equipmentId,
        is_read: false,
      });
    }
  } catch (_) {}

  return newMsg;
}

// ── 📊 WORKOUT PR TRACKER (Kỷ lục cá nhân) ──────────────────────────────────
export interface UserPRRecord {
  id: string;
  userId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  notes?: string;
  equipmentId?: string;
  achievedAt: string;
  createdAt: string;
}

const LOCAL_PRS_KEY = 'gymgear_user_prs_cache';

const INITIAL_SAMPLE_PRS: UserPRRecord[] = [
  {
    id: 'pr-1',
    userId: 'current_user',
    exerciseName: 'Đẩy Ngực Ngang (Bench Press)',
    weightKg: 100,
    reps: 1,
    notes: 'Kỷ lục mới đạt được với máy Smith Machine chuẩn form!',
    equipmentId: 'eq-1',
    achievedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'pr-2',
    userId: 'current_user',
    exerciseName: 'Đạp Đùi Nghiêng (Leg Press)',
    weightKg: 240,
    reps: 6,
    notes: 'Máy DHZ Fusion chuyển động siêu mượt, không đau lưng.',
    equipmentId: 'eq-2',
    achievedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'pr-3',
    userId: 'current_user',
    exerciseName: 'Kéo Xô Đôi (Lat Pulldown)',
    weightKg: 85,
    reps: 8,
    notes: 'Cảm giác siết xô cực đã.',
    achievedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
];

function getLocalPRs(): UserPRRecord[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_PRS;
  try {
    const raw = localStorage.getItem(LOCAL_PRS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRS_KEY, JSON.stringify(INITIAL_SAMPLE_PRS));
      return INITIAL_SAMPLE_PRS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_PRS;
  }
}

function saveLocalPRs(prs: UserPRRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_PRS_KEY, JSON.stringify(prs));
  } catch (e) {
    console.warn('Lỗi lưu PRs:', e);
  }
}

export async function fetchUserPRs(userId?: string): Promise<UserPRRecord[]> {
  // Dùng localStorage cho Kỷ lục PRs để tránh lỗi 404 khi bảng user_prs chưa chạy SQL
  const local = getLocalPRs();
  return local.sort(
    (a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
  );
}

export async function saveUserPR(
  exerciseName: string,
  weightKg: number,
  reps: number = 1,
  notes?: string,
  equipmentId?: string
): Promise<UserPRRecord> {
  const now = new Date().toISOString();
  const newPR: UserPRRecord = {
    id: `pr_${Date.now()}`,
    userId: 'current_user',
    exerciseName,
    weightKg,
    reps,
    notes,
    equipmentId,
    achievedAt: now,
    createdAt: now,
  };

  const current = getLocalPRs();
  const updated = [newPR, ...current];
  saveLocalPRs(updated);

  // Tạo thông báo chúc mừng kỷ lục mới
  createNotification({
    userId: 'current_user',
    actorId: 'system',
    actorName: 'Kỷ Lục Thể Lực',
    type: 'pr',
    title: 'Kỷ lục PR mới được xác lập! 🔥',
    content: `Chúc mừng bạn đã đạt PR mới: ${exerciseName} ${weightKg}kg (${reps} reps).`,
    targetId: newPR.id,
  });

  // TODO: Đồng bộ Supabase khi bảng user_prs được tạo
  return newPR;
}

export async function deleteUserPR(prId: string): Promise<boolean> {
  const current = getLocalPRs();
  saveLocalPRs(current.filter(p => p.id !== prId));
  // TODO: await supabase.from('user_prs').delete().eq('id', prId);
  return true;
}

