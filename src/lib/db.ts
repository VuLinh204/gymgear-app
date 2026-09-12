// Unified Database Bridge (GymGear Supabase DB)
// Cầu nối truy cập dữ liệu Database thực tế cho toàn bộ dự án

export * from './supabaseDB';
export { supabase } from './supabase';

import {
  fetchEquipments,
  fetchPosts,
  fetchBookings,
  submitBooking,
  updateBookingStatus,
  fetchUsers,
  signUp,
  signIn,
  signOut,
  getCurrentUser
} from './supabaseDB';
import { Equipment, SocialPost, BookingRequest, UserAuthor, UserRole } from '@/types';

// Giữ các alias quen thuộc cho tương thích ngược
export const getDBEquipments = async (): Promise<Equipment[]> => {
  return await fetchEquipments();
};

export const getDBPosts = async (): Promise<SocialPost[]> => {
  return await fetchPosts();
};

export const getDBBookings = async (): Promise<BookingRequest[]> => {
  return await fetchBookings();
};

export const saveDBBooking = async (booking: BookingRequest) => {
  const res = await submitBooking(booking);
  return {
    success: res.success,
    message: res.success
      ? `Đặt lịch thành công! Mã đơn ${res.id} đã được lưu vào Database hệ thống.`
      : `Lỗi đặt lịch: ${res.error}`,
    booking: { ...booking, id: res.id }
  };
};

export const updateDBBookingStatus = async (id: string, status: string) => {
  return await updateBookingStatus(id, status);
};

export const getDBUsers = async (): Promise<UserAuthor[]> => {
  return await fetchUsers();
};
