# GYMGEAR PROJECT RULES & DESIGN SYSTEM

> **Mục tiêu:** Quy tắc cốt lõi về Thiết Kế, Giao Diện và Kỹ Thuật cho dự án GymGear. Mọi Agent đều phải tuân thủ.

---

## 1. QUY TẮC TƯƠNG PHẢN & MÀU SẮC (CRITICAL)
- **Nền màu thì chữ phải màu trắng 100% (`#FFFFFF`):**
  - Mọi nút, badge, header có nền màu Accent (Xanh Meta `#0866FF`, Green `#10B981`, Red `#EF4444`, Amber/Orange) thì **chữ và icon SVG bên trong BẮT BUỘC là màu trắng tinh (`#FFFFFF`)**.
  - Không để chữ tối màu (`#000000`, `text-slate-900`) hoặc màu mờ trên nền màu.
  - Ngoại lệ: Nền màu vàng chanh Volt `#CCFF00` thì chữ bên trong là màu đen tuyền `#000000` (WCAG AAA).
- **CSS Selector an toàn:**
  - Chỉ target chính xác các class tạo nền như `[class*="bg-amber-"]`, `button[class*="from-amber-"]`.
  - Không dùng selector lỏng lẻo như `a[class*="amber"]`.

---

## 2. HỆ THỐNG 3 THEME MÀU & NÚT ĐỔI THEME (ORIGINKIT STYLE)
- 🟢 **Theme 1: Cyber Volt (`data-theme="cyber-volt"`)**
  - Accent: `#CCFF00` / `#10B981` (Volt Lime / Hyper Green)
  - Dark Surface: `#0B0D11` / `#131720` (Carbon Obsidian)
- 🔵 **Theme 2: Royal Meta (`data-theme="meta-blue"`)**
  - Accent: `#0866FF` (Facebook Primary Blue - Flat)
  - Dark Surface: `#18191A` / `#242526` (Facebook Midnight Dark)
- 🔴 **Theme 3: Crimson Pulse (`data-theme="crimson-pulse"`)**
  - Accent: `#EF4444` / `#FF3B30` (Crimson Blaze)
  - Dark Surface: `#0E0E10` / `#18181C` (Cast Iron Raw)

**Theme Switcher Popover:**
- Nút bấm trên Navbar mở một Popover nằm ngay bên dưới nút (`top-full mt-2 right-0`).
- Animation trượt êm ái kiểu OriginKit (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Hỗ trợ cả Dark Mode và Light Mode cho cả 3 theme.
- Lưu trạng thái vào `localStorage` và xử lý chống FOUC ở `layout.tsx`.

---

## 3. OVERLAY MỞ TRANG KIỂU FACEBOOK (APP LAUNCH SPLASH)
- Khi mở trang lần đầu trong phiên: Hiện overlay toàn màn hình với logo GymGear phát sáng nhẹ dạng nhịp thở (`pulse`).
- Tự động mờ dần sau ~700ms - 800ms. Dùng `sessionStorage` để không lặp lại khi chuyển trang.

---

## 4. TRIẾT LÝ THIẾT KẾ HALLMARK (CHỐNG GENERIC AI SLOP)
- Loại bỏ card bo góc mờ nhạt đại trà.
- Thẻ máy tập có HUD thông số kỹ thuật: Stack tạ tối đa (kg), Nhóm cơ mục tiêu, Phân hạng máy (`Commercial Grade`).
- Nút bấm có chiều sâu xúc giác (tactile depress 1px, ring-inset, viền kim loại nhẹ).

---

## 5. KỸ THUẬT
- Next.js 16 (App Router), React 19, Tailwind CSS v4, Supabase JS, Lucide Icons.
- Bảo toàn code Google Translate trong `globals.css` (không để thẻ `<font>` làm vỡ layout).
