export type UserRole = 'guest' | 'user' | 'premium' | 'admin';

export type CategoryType = 'all' | 'cardio' | 'strength' | 'home-gym' | 'racks-benches' | 'accessories';

export type EquipmentType = 'commercial' | 'home' | 'light-commercial';

export interface Specifications {
  powerOutput?: string;        // Công suất motor (VD: 4.0 HP AC)
  weightCapacity: string;       // Tải trọng tối đa
  dimensions: string;           // Kích thước D x R x C
  machineWeight: string;        // Trọng lượng máy
  targetMuscles?: string[];     // Nhóm cơ tác động
  resistanceType?: string;      // Loại kháng lực
  warranty: string;             // Bảo hành
}

export interface Equipment {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandLogo?: string;
  category: CategoryType;
  type: EquipmentType;
  modelNumber: string;
  priceRange: string;
  vipPrice?: string;            // Giá ưu đãi đặc quyền cho tài khoản Premium / Admin
  estimatedPrice: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  gallery: string[];
  excerpt: string;
  fullDescription: string;
  specifications: Specifications;
  pros: string[];
  cons: string[];
  isFeatured?: boolean;
  availableForBooking: boolean;
  showroomLocations?: string[];
}

export interface UserAuthor {
  id: string;
  name: string;
  email?: string;               // Địa chỉ Email người dùng
  phone?: string;               // Số điện thoại
  avatar: string;
  role: UserRole;               // 'guest' | 'user' | 'premium' | 'admin'
  roleTitle?: string;           // Danh xưng: VD "Chủ Gym FitPlus", "HLV Chuyên Nghiệp"
  isVerified?: boolean;
}

export interface PostComment {
  id: string;
  author: UserAuthor;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface SocialPost {
  id: string;
  author: UserAuthor;
  createdAt: string;
  content: string;
  rating: number;
  taggedEquipment?: Equipment;  // Gắn thẻ máy tập trong bài đăng
  images?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isReposted?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isPinned?: boolean;           // Đặc quyền ghim bài của Premium/Admin
  comments?: PostComment[];
}

export interface BookingRequest {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  equipmentId: string;
  equipmentName?: string;
  bookingType: 'try-showroom' | 'request-quote' | 'rent-equipment' | 'gym-setup-consulting';
  preferredDate?: string;
  preferredLocation?: string;
  note?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  userRole?: UserRole;
  createdAt?: string;
}
