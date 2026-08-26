import { Equipment, SocialPost, BookingRequest, UserAuthor, UserRole } from '@/types';
import { MOCK_EQUIPMENTS, MOCK_REVIEWS } from '@/data/mockData';

// Key storage names cho Real Data Persistence
const STORAGE_KEYS = {
  POSTS: 'gymgear_db_posts_v1',
  BOOKINGS: 'gymgear_db_bookings_v1',
  EQUIPMENTS: 'gymgear_db_equipments_v1',
  USERS: 'gymgear_db_users_v1',
  SESSION: 'gymgear_db_current_user_v1',
};

// Seed Users ban đầu trong Database
const SEED_USERS: (UserAuthor & { email: string; password?: string })[] = [
  {
    id: 'usr-1',
    name: 'Nguyễn Văn Hùng',
    email: 'hung.fitplus@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'premium',
    roleTitle: 'Chủ chuỗi Gym FitPlus (3 cơ sở)',
    isVerified: true
  },
  {
    id: 'usr-2',
    name: 'Lê Minh Tuấn',
    email: 'tuan.pt@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    roleTitle: 'HLV Chuyên Nghiệp (PT)',
    isVerified: false
  },
  {
    id: 'usr-admin',
    name: 'Quản Trị Viên Master',
    email: 'admin@gymgear.vn',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    roleTitle: 'System Administrator',
    isVerified: true
  }
];

const SEED_BOOKINGS: BookingRequest[] = [
  {
    id: 'BK-1001',
    customerName: 'Trần Văn Mạnh',
    customerPhone: '0988 123 456',
    customerEmail: 'manh.tran@gmail.com',
    equipmentId: 'eq-1',
    equipmentName: 'Máy Chạy Bộ Impulse PT300H',
    bookingType: 'try-showroom',
    preferredDate: '2026-08-10',
    preferredLocation: 'Showroom Cầu Giấy',
    note: 'Cần thử máy vào buổi sáng',
    status: 'pending',
    userRole: 'premium',
    createdAt: '10/08/2026'
  },
  {
    id: 'BK-1002',
    customerName: 'Nguyễn Thị Hoa',
    customerPhone: '0912 987 654',
    customerEmail: 'hoa.nguyen@fitgym.vn',
    equipmentId: 'eq-2',
    equipmentName: 'Leg Press 45 Độ DHZ Fusion',
    bookingType: 'request-quote',
    preferredDate: '2026-08-12',
    preferredLocation: 'Showroom Quận 10',
    note: 'Xin báo giá sỉ 4 con Leg Press cho chi nhánh mới',
    status: 'confirmed',
    userRole: 'user',
    createdAt: '09/08/2026'
  }
];

// Helper khởi tạo dữ liệu DB ban đầu nếu chưa có
const initDatabase = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENTS)) {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENTS, JSON.stringify(MOCK_EQUIPMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
};

// --- DATA ACCESS METHODS ---

export const getDBEquipments = (): Equipment[] => {
  initDatabase();
  if (typeof window === 'undefined') return MOCK_EQUIPMENTS;
  const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENTS);
  return data ? JSON.parse(data) : MOCK_EQUIPMENTS;
};

export const getDBPosts = (): SocialPost[] => {
  initDatabase();
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.POSTS);
  return data ? JSON.parse(data) : [];
};

export const saveDBPost = (post: SocialPost): SocialPost[] => {
  const posts = getDBPosts();
  const updated = [post, ...posts];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  }
  return updated;
};

export const getDBBookings = (): BookingRequest[] => {
  initDatabase();
  if (typeof window === 'undefined') return SEED_BOOKINGS;
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : SEED_BOOKINGS;
};

export const saveDBBooking = (booking: BookingRequest): { success: boolean; message: string; booking: BookingRequest } => {
  const bookings = getDBBookings();
  const newBooking: BookingRequest = {
    ...booking,
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toLocaleDateString('vi-VN')
  };
  const updated = [newBooking, ...bookings];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }

  // Gửi thông báo Telegram Bot
  const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    const messageText = `🏋️‍♂️ **ĐƠN BOOKING TRẢI NGHIỆM MÁY GYM MỚI (DB persistent)!**\n\n` +
      `🆔 **Mã đơn**: ${newBooking.id}\n` +
      `👤 **Khách hàng**: ${newBooking.customerName}\n` +
      `📞 **SĐT**: ${newBooking.customerPhone}\n` +
      `✉️ **Email**: ${newBooking.customerEmail}\n` +
      `🏋️ **Thiết bị**: ${newBooking.equipmentName || newBooking.equipmentId}\n` +
      `📌 **Nhu cầu**: ${newBooking.bookingType}\n` +
      `🗓 **Ngày hẹn**: ${newBooking.preferredDate || 'Linh hoạt'}\n` +
      `📍 **Showroom**: ${newBooking.preferredLocation || 'Chưa chọn'}`;

    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    }).catch(err => console.error('Telegram error:', err));
  }

  return {
    success: true,
    message: `Đặt lịch thành công! Mã đơn ${newBooking.id} đã được lưu vào Database hệ thống.`,
    booking: newBooking
  };
};

export const updateDBBookingStatus = (id: string, status: BookingRequest['status']): BookingRequest[] => {
  const bookings = getDBBookings();
  const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }
  return updated;
};

// --- AUTH & USER DATABASE METHODS ---

export const getDBUsers = (): UserAuthor[] => {
  initDatabase();
  if (typeof window === 'undefined') return SEED_USERS;
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : SEED_USERS;
};

export const registerDBUser = (name: string, email: string, role: UserRole = 'user', roleTitle?: string): UserAuthor => {
  const users = getDBUsers();
  const newUser: UserAuthor = {
    id: `usr-${Date.now()}`,
    name,
    avatar: role === 'premium' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role,
    roleTitle: roleTitle || (role === 'premium' ? 'Hội viên VIP' : 'Thành viên'),
    isVerified: role === 'premium' || role === 'admin'
  };

  const updated = [...users, newUser];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
  }
  return newUser;
};

export const loginDBUser = (email: string): UserAuthor | null => {
  const users = getDBUsers();
  const user = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    }
    return user;
  }
  return null;
};

export const getDBCurrentSession = (): UserAuthor | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
};

export const logoutDBSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};
