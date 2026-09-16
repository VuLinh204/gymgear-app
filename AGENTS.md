<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GYMGEAR PROJECT RULES & DESIGN SYSTEM (BỘ QUY TẮC CHUNG CHO AGENT)

> **Mục tiêu:** Mọi AI Agent (Antigravity, Claude, Cursor, Windsurf, Copilot,...) khi tham gia phát triển dự án này **BẮT BUỘC** tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. QUY TẮC TƯƠNG PHẢN & MÀU SẮC (CRITICAL - KHÔNG ĐƯỢC PHẠM)
1. **Nền màu thì chữ phải màu trắng 100% (`#FFFFFF`):**
   - Bất kỳ phần tử nào có nền màu (Accent Blue `#0866FF`, Green `#10B981`, Red `#EF4444`, hoặc Gradient từ Amber/Orange) thì **chữ và icon SVG bên trong BẮT BUỘC là màu trắng tinh (`#FFFFFF`)**.
   - Tuyệt đối không để chữ tối màu (`#000000`, `text-slate-900`) hoặc màu mờ trên nền màu khiến người dùng khó đọc.
   - Ngoại lệ duy nhất: Nền màu vàng chanh chói (Volt `#CCFF00`), chữ bên trong bắt buộc là màu đen tuyền (`#000000`) để đạt chuẩn tương phản WCAG AAA.
2. **Cẩn trọng khi viết CSS Selector toàn cục:**
   - Chỉ target chính xác các class tạo nền như `[class*="bg-amber-"]`, `button[class*="from-amber-"]`.
   - **Tuyệt đối không** dùng selector lỏng lẻo như `a[class*="amber"]`, vì sẽ vô tình ghi đè màu chữ của các thẻ link chỉ có class hover như `hover:text-amber-400`.

---

## 2. HỆ THỐNG 3 THEME MÀU & NÚT ĐỔI THEME (ORIGINKIT STYLE)
Dự án hỗ trợ 3 bộ theme màu thể hình độc quyền, được quản lý bằng data attribute `data-theme` trên thẻ `<html>`:
* 🟢 **Theme 1: Cyber Volt (`data-theme="cyber-volt"`)**
  - Accent: `#CCFF00` / `#10B981` (Volt Lime / Hyper Green)
  - Dark Surface: `#0B0D11` / `#131720` (Carbon Obsidian)
  - Phong cách: Năng lượng thể thao, bùng nổ PR, xu hướng GymTok.
* 🔵 **Theme 2: Royal Meta (`data-theme="meta-blue"`)**
  - Accent: `#0866FF` (Facebook Primary Blue - Flat, không gradient)
  - Dark Surface: `#18191A` / `#242526` (Facebook Midnight Dark)
  - Phong cách: Mạng xã hội thân thuộc, uy tín, cộng đồng review & booking.
* 🔴 **Theme 3: Crimson Pulse (`data-theme="crimson-pulse"`)**
  - Accent: `#EF4444` / `#FF3B30` (Crimson Blaze)
  - Dark Surface: `#0E0E10` / `#18181C` (Cast Iron Raw)
  - Phong cách: Tạ nặng, hardcore bodybuilding, cỗ máy tập khối sắt.

**Yêu cầu kỹ thuật Theme Switcher:**
* Nút chuyển theme trên Navbar hiển thị một **Popover Dropdown** nằm ngay bên dưới nút bấm (`top-full mt-2 right-0`).
* Animation trượt êm ái kiểu [OriginKit](https://www.originkit.dev/) (`cubic-bezier(0.16, 1, 0.3, 1)`).
* Cả 3 theme đều phải hỗ trợ độc lập cả **Dark Mode** và **Light Mode** (`.theme-light`).
* Lưu trạng thái theme và mode vào `localStorage` và đồng bộ với thẻ `<html>` qua inline script để tránh chớp trắng (FOUC).

---

## 3. OVERLAY MỞ TRANG KIỂU FACEBOOK (APP LAUNCH SPLASH)
* Khi người dùng mở trang web lần đầu trong phiên:
  * Hiển thị overlay toàn màn hình với logo GymGear phát sáng nhẹ theo nhịp thở (`pulse`).
  * Có tên thương hiệu "GYMGEAR" và slogan.
  * Tự động mờ dần và unmount sau ~700ms - 800ms.
  * Sử dụng `sessionStorage` để không lặp lại gây khó chịu khi chuyển trang nội bộ.

---

## 4. TRIẾT LÝ THIẾT KẾ HALLMARK (CHỐNG GENERIC AI SLOP)
Hallmark (`nutlope/hallmark`) yêu cầu giao diện phải có linh hồn và DNA cơ khí thể thao thực thụ:
* **Không làm giao diện rập khuôn:** Tránh card trắng/xám vô hồn, gradient tím mờ nhạt đại trà.
* **HUD Thông Số Kỹ Thuật (Machine Spec Sheet):** Thẻ máy tập cần có badge kỹ thuật: Stack tạ tối đa (e.g. `120kg`), Nhóm cơ mục tiêu (`Chest`, `Back`), Phân hạng máy (`Commercial Grade`).
* **Tính Xúc Giác (Tactile Depth):** Nút bấm và card có viền kim loại nhẹ (`ring-1 ring-inset ring-white/10`), hiệu ứng bấm lún 1px (`active:translate-y-0.5`).
* **Bento Grid bất đối xứng:** Kết hợp giữa máy tập Spotlight, clip GymTok dạng dọc và feed bài viết thể hình.

---

## 5. CÔNG NGHỆ & LƯU Ý KỸ THUẬT
* **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Supabase JS, Lucide Icons.
* **Open Design System:** Toàn bộ đặc tả thiết kế 9 phân đoạn được lưu tại file `DESIGN.md`. Mọi Agent trước khi sinh UI bắt buộc phải đọc `DESIGN.md` và tuân thủ các semantic tokens và anti-patterns.
* **Hydration Safety:** Các component can thiệp DOM hoặc `localStorage` phải kiểm tra `typeof window !== 'undefined'` hoặc dùng inline script tại `layout.tsx`.
* **Google Translate:** Dự án có widget dịch đa ngôn ngữ. Tuyệt đối không xóa các class CSS xử lý thẻ `<font>` và iframe của Google Translate trong `globals.css` vì sẽ gây vỡ layout và crash React.
