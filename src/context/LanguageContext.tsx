'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Language, Translations> = {
  vi: {
    // Navbar
    nav: {
      searchPlaceholder: "Tìm máy tập, bài review, PT...",
      adminPanel: "Admin Panel",
      vipMember: "Hội Viên VIP",
      bookShowroom: "Đặt Lịch Showroom",
      login: "Đăng nhập",
      register: "Đăng ký",
      myProfile: "Hồ sơ cá nhân",
      settings: "Cài đặt tài khoản",
      helpGuide: "Hướng dẫn & Phím tắt",
      logout: "Đăng xuất",
      quickBooking: "Đặt Lịch Thử Máy",
    },
    // Home feed & Sidebars
    feed: {
      stories: "Stories",
      myStory: "Story của bạn",
      addStory: "Thêm Story",
      createPost: "Đăng bài review mới...",
      totalPosts: "bài viết",
      sortLatest: "Mới Nhất",
      sortPopular: "Nhiều Like Nhất",
      sortComments: "Nhiều Bình Luận",
      allMuscles: "Tất cả nhóm cơ",
      allPrices: "Mọi mức giá",
      clearFilters: "Xoá Bộ Lọc",
      noPostsTitle: "Không có bài review nào phù hợp với bộ lọc",
      noPostsDesc: "Hãy thử chọn khoảng giá khác, đặt lại bộ lọc nhóm cơ hoặc bấm Xoá Bộ Lọc để xem toàn bộ feed.",
      ctaBookingTitle: "DỊCH VỤ BOOKING 0đ",
      ctaBookingHeadline: "Đặt Lịch Chạy Thử Máy Gym Tại Showroom",
      ctaBookingDesc: "Được trải nghiệm trực tiếp 30+ mẫu máy commercial tại 5 showroom trước khi quyết định mua hoặc mở phòng.",
      ctaBookingBtn: "Đặt Lịch Ngay (Miễn Phí)",
      topEquipments: "Top Máy Gym Hot Nhất",
      ranking: "Bảng Xếp Hạng",
      topReviewers: "Reviewer Uy Tín",
      viewAll: "Xem tất cả",
      followers: "người theo dõi",
      follow: "Theo dõi",
      following: "Đang theo dõi",
    },
    // Post Card & Comments
    post: {
      pinned: "Ghim",
      restore: "Khôi phục",
      delete: "Xóa",
      like: "Thích",
      liked: "Đã thích",
      comment: "Bình luận",
      share: "Chia sẻ",
      bookmark: "Lưu",
      bookmarked: "Đã lưu",
      taggedEquipment: "Thiết bị được review:",
      bookTrial: "Đặt Lịch Thử Máy (Free)",
      allComments: "Tất cả bình luận",
      bestMatch: "Phù hợp nhất",
      loadingComments: "Đang tải bình luận...",
      noComments: "Chưa có bình luận nào. Hãy là người đầu tiên!",
      reply: "Trả lời",
      replyingTo: "Đang trả lời",
      cancelReply: "Hủy",
      viewReplies: "Xem {count} câu trả lời",
      hideReplies: "Ẩn {count} câu trả lời",
      loginToComment: "Đăng nhập để bình luận",
      commentAs: "Bình luận với tư cách {name}...",
      replyAs: "Trả lời @{name}...",
      likes: "lượt thích",
      comments: "bình luận",
      copiedLink: "Đã sao chép liên kết!",
    },
    // Follow list modal
    followModal: {
      title: "Mạng Lưới Kết Nối",
      followersTab: "Người theo dõi",
      followingTab: "Đang theo dõi",
      searchPlaceholder: "Tìm theo tên gymer, PT, showroom...",
      noFollowers: "Chưa có ai theo dõi",
      noFollowersDesc: "Hãy tích cực chia sẻ bài viết review máy tập để kết nối cộng đồng!",
      noFollowing: "Chưa theo dõi người dùng nào",
      noFollowingDesc: "Hãy lướt bảng tin và theo dõi các gymer & HLV nổi bật!",
      noSearchMatch: "Không tìm thấy ai phù hợp",
      close: "Đóng",
    },
    // Notifications
    notif: {
      title: "Thông Báo",
      new: "mới",
      markAllRead: "Đã đọc hết",
      tabAll: "Tất cả",
      tabSocial: "Tương tác",
      tabBooking: "Lịch Showroom",
      noNotifs: "Không có thông báo nào",
      noNotifsDesc: "Bạn sẽ nhận thông báo khi có tương tác mới.",
    },
    // Profile
    profile: {
      myPosts: "Bài viết của tôi",
      saved: "Đã lưu",
      prTracker: "Kỷ lục PR",
      trash: "Thùng rác",
      noPosts: "Bạn chưa có bài viết nào",
      noPostsDesc: "Hãy chia sẻ cảm nhận trải nghiệm tập luyện & đánh giá máy gym với cộng đồng nhé!",
      backToFeed: "Về Bảng Tin Đăng Bài",
      back: "Quay Lại",
      notFoundTitle: "Không Tìm Thấy Người Dùng",
      notFoundDesc: "Tài khoản này không tồn tại hoặc đã đổi tên.",
      backHome: "Về Trang Chủ",
    },
    // Common
    common: {
      loading: "Đang tải...",
      justNow: "Vừa xong",
      minutesAgo: "phút trước",
      hoursAgo: "giờ trước",
      daysAgo: "ngày trước",
      language: "Ngôn ngữ",
      vietnamese: "Tiếng Việt",
      english: "English",
    }
  },
  en: {
    // Navbar
    nav: {
      searchPlaceholder: "Search machines, reviews, PTs...",
      adminPanel: "Admin Panel",
      vipMember: "VIP Member",
      bookShowroom: "Book Showroom",
      login: "Login",
      register: "Sign Up",
      myProfile: "My Profile",
      settings: "Account Settings",
      helpGuide: "Shortcuts & Guide",
      logout: "Log Out",
      quickBooking: "Book Machine Trial",
    },
    // Home feed & Sidebars
    feed: {
      stories: "Stories",
      myStory: "Your Story",
      addStory: "Add Story",
      createPost: "Create a new review post...",
      totalPosts: "posts",
      sortLatest: "Latest",
      sortPopular: "Most Liked",
      sortComments: "Most Discussed",
      allMuscles: "All Muscle Groups",
      allPrices: "All Price Ranges",
      clearFilters: "Clear Filters",
      noPostsTitle: "No reviews match your filters",
      noPostsDesc: "Try adjusting your price range, resetting muscle filters, or clicking Clear Filters to view the full feed.",
      ctaBookingTitle: "FREE BOOKING $0",
      ctaBookingHeadline: "Book a Commercial Gym Equipment Trial",
      ctaBookingDesc: "Test drive 30+ commercial gym machines directly at 5 showrooms before buying or opening your gym.",
      ctaBookingBtn: "Book Free Trial Now",
      topEquipments: "Top Trending Machines",
      ranking: "Leaderboard",
      topReviewers: "Top Reviewers",
      viewAll: "View All",
      followers: "followers",
      follow: "Follow",
      following: "Following",
    },
    // Post Card & Comments
    post: {
      pinned: "Pinned",
      restore: "Restore",
      delete: "Delete",
      like: "Like",
      liked: "Liked",
      comment: "Comment",
      share: "Share",
      bookmark: "Save",
      bookmarked: "Saved",
      taggedEquipment: "Reviewed Equipment:",
      bookTrial: "Book Free Trial",
      allComments: "All Comments",
      bestMatch: "Top Comments",
      loadingComments: "Loading comments...",
      noComments: "No comments yet. Be the first to comment!",
      reply: "Reply",
      replyingTo: "Replying to",
      cancelReply: "Cancel",
      viewReplies: "View {count} replies",
      hideReplies: "Hide {count} replies",
      loginToComment: "Log in to comment",
      commentAs: "Comment as {name}...",
      replyAs: "Reply to @{name}...",
      likes: "likes",
      comments: "comments",
      copiedLink: "Link copied to clipboard!",
    },
    // Follow list modal
    followModal: {
      title: "Connections Network",
      followersTab: "Followers",
      followingTab: "Following",
      searchPlaceholder: "Search by gymer, PT, showroom...",
      noFollowers: "No followers yet",
      noFollowersDesc: "Share gym machine reviews and fitness tips to build your community!",
      noFollowing: "Not following anyone yet",
      noFollowingDesc: "Explore the feed and follow featured gymers and coaches!",
      noSearchMatch: "No matching members found",
      close: "Close",
    },
    // Notifications
    notif: {
      title: "Notifications",
      new: "new",
      markAllRead: "Mark all read",
      tabAll: "All",
      tabSocial: "Social",
      tabBooking: "Showroom",
      noNotifs: "No notifications",
      noNotifsDesc: "You will receive updates when people interact with your profile.",
    },
    // Profile
    profile: {
      myPosts: "My Reviews",
      saved: "Saved Posts",
      prTracker: "PR Tracker",
      trash: "Trash",
      noPosts: "You haven't posted any reviews yet",
      noPostsDesc: "Share your workout experience & equipment reviews with the gym community!",
      backToFeed: "Back to Feed",
      back: "Back",
      notFoundTitle: "User Not Found",
      notFoundDesc: "This user profile does not exist or has been renamed.",
      backHome: "Back to Home",
    },
    // Common
    common: {
      loading: "Loading...",
      justNow: "Just now",
      minutesAgo: "m ago",
      hoursAgo: "h ago",
      daysAgo: "d ago",
      language: "Language",
      vietnamese: "Tiếng Việt",
      english: "English",
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (path: string) => path,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('gymgear_lang') as Language;
      if (savedLang === 'vi' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    } catch (_) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('gymgear_lang', lang);
      document.documentElement.lang = lang;
    } catch (_) {}
  };

  const toggleLanguage = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Vietnamese if key not found
        let fallback: any = translations.vi;
        for (const fKey of keys) {
          if (fallback && typeof fallback === 'object' && fKey in fallback) {
            fallback = fallback[fKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') return path;

    if (params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }, current);
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
