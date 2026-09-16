# DESIGN.md - GymGear Open Design System Specification
> **Ecosystem:** Open Design (`nexu-io/open-design`) & Hallmark (`nutlope/hallmark`)  
> **Schema Version:** Open Design 9-Segment Protocol  
> **Target:** Mạng Xã Hội Đánh Giá & Đặt Lịch Chạy Thử Máy Tập Gym (GymGear Platform)

---

## 1. COLOR (BẢNG MÀU & SEMANTIC TOKENS)

GymGear sử dụng kiến trúc 3 Theme màu chuyển đổi động qua thuộc tính `data-theme` trên thẻ `<html>`, hỗ trợ cả Dark Mode (mặc định) và Light Mode:

### 🟢 Theme 1: Cyber Volt (`data-theme="cyber-volt"`)
* **Mục đích:** Năng lượng thể thao bùng nổ, GymTok PRs, Crossfit & Powerlifting.
* **Accent Primary:** `#10B981` (Hyper Green) / `#CCFF00` (Electric Volt)
* **Accent Hover:** `#059669` / `#AEE600`
* **Dark Background:** `#0B0D11` (Carbon Obsidian)
* **Dark Card Surface:** `#131720` (Matte Graphite)
* **Dark Border / Inset:** `#1F2633`
* **Text on Accent:** `#FFFFFF` (hoặc `#000000` nếu nền Volt Lime chói)

### 🔵 Theme 2: Royal Meta (`data-theme="meta-blue"`) — *Mặc định*
* **Mục đích:** Mạng xã hội thân thuộc, uy tín, giao dịch đặt lịch và review tin cậy.
* **Accent Primary:** `#0866FF` (Facebook Primary Flat Blue - không gradient)
* **Accent Hover:** `#0055D4`
* **Dark Background:** `#18191A` (FB Midnight Dark)
* **Dark Card Surface:** `#242526` (FB Card Surface)
* **Dark Border / Divider:** `#3A3B3C`
* **Text on Accent:** `#FFFFFF` (100% chữ và icon trắng tinh khiết)

### 🔴 Theme 3: Crimson Pulse (`data-theme="crimson-pulse"`)
* **Mục đích:** Thể hình hardcore, cỗ máy khối sắt nặng, Gold's Gym vibe.
* **Accent Primary:** `#EF4444` (Crimson Blaze) / `#FF3B30`
* **Accent Hover:** `#DC2626`
* **Dark Background:** `#0E0E10` (Cast Iron Raw)
* **Dark Card Surface:** `#18181C` (Gunmetal Surface)
* **Dark Border / Divider:** `#2B2B33`
* **Text on Accent:** `#FFFFFF`

### ☀️ Chế độ Sáng Toàn Cục (.theme-light)
* **Light Background:** `#F0F2F5`
* **Light Card Surface:** `#FFFFFF` (Crisp Clean White)
* **Light Secondary / Button:** `#E4E6EB`
* **Light Border:** `#CED0D4`
* **Light Text Primary:** `#050505`
* **Light Text Secondary:** `#65676B`

---

## 2. TYPOGRAPHY (PHÂN CẤP CHỮ NĂNG ĐỘNG)

* **Font Family:** `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`.
* **Font Mono:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas` (dùng cho Model Number, Technical HUD).
* **Hierarchy:**
  * **Brand / Hero Title:** Font-weight `900` (Black), tracking `-0.02em` đến `+0.05em` (uppercase).
  * **Section Headings (H2/H3):** Font-weight `800` (Extrabold), leading snug.
  * **Machine Spec Sheet:** Font-mono, text `xs` / `11px`, font-bold cho giá trị số.
  * **Body / Feed Text:** Text `13px` - `14px`, leading relaxed (`1.5` - `1.6`), màu `text-slate-300` (Dark) hoặc `text-slate-800` (Light).

---

## 3. SPACING (KHOẢNG CÁCH & TỶ LỆ NHỊP ĐIỆU)

Tuân thủ thang đo 4px / 8px chuẩn Tailwind v4:
* **Micro-gap:** `gap-1.5` (6px) cho icon + label inline.
* **Card Padding:** `p-4` (16px) cho mobile, `p-5` (20px) đến `p-6` (24px) cho desktop.
* **Section Rhythm:** `mb-6` đến `mb-10` giữa các phân đoạn feed và bento grid.
* **Touch Targets:** Nút bấm tối thiểu `h-9` (36px) hoặc `h-10` (40px) để dễ chạm trên thiết bị di động.

---

## 4. LAYOUT (BENTO GRID BẤT ĐỐI XỨNG & SOCIAL FEED)

* **3-Column Social Macrostructure:**
  * **Left Sidebar (Desktop):** Navigation & Danh mục máy tập (`w-64` cố định).
  * **Center Main Feed:** Feed bài viết, clip GymTok dọc, bento máy tập Spotlight (`flex-1 max-w-2xl lg:max-w-3xl`).
  * **Right Sidebar (Desktop):** Showroom gần bạn, máy tập hot, lịch thử máy cá nhân (`w-72` - `w-80`).
* **Asymmetrical Bento:** Kết hợp linh hoạt giữa máy tập Hero lớn (chiếm 2 cột) và các mini-card thông số kỹ thuật.

---

## 5. COMPONENTS (THƯ VIỆN THÀNH PHẦN CHUẨN)

### 1. EquipmentCard (Hallmark Machine Spec Sheet)
* Card viền kép xúc giác: `ring-1 ring-white/10` kết hợp viền mờ `border-slate-800`.
* HUD badges đè ảnh: Brand, Phân hạng (`Commercial Grade` / `Home Gym Pro`), Rating, Nhóm cơ tác động (`Biomechanics Pill`), Trọng lượng tạ.
* Nút CTA: "Book Thử Máy" dùng `btn-theme-accent` với chữ trắng 100% và hiệu ứng lún `active:translate-y-0.5`.

### 2. ThemeSwitcherPopover (OriginKit Style)
* Nút Trigger trên Navbar với chấm tròn hiển thị màu Theme hiện hành.
* Popover dropdown nổi phía dưới (`top-full mt-2 right-0`) với nền kính mờ `backdrop-blur-xl`.
* Danh sách 3 Theme dạng swatch kép kèm checkmark active.
* Segmented Control chọn chế độ Tối (Dark) / Sáng (Light).

### 3. AppSplashOverlay (Facebook Launch Screen)
* Màn hình mở app toàn cảnh với logo GymGear đập nhịp thở (`pulse`).
* Slogan thương hiệu và thanh chạy tiến trình.
* Tự động unmount sau 700ms - 1000ms, lưu cờ vào `sessionStorage`.

---

## 6. MOTION (CHUYỂN ĐỘNG & VẬT LÝ ORIGINKIT)

* **Spring Physics Popover:**
  * Animation bung menu: `scale 0.95 -> 1.0` + `opacity 0 -> 1` trong `180ms`.
  * Cubic-bezier: `cubic-bezier(0.16, 1, 0.3, 1)` (mượt mà, dừng êm không giật nảy).
* **Tactile Press Feedback:**
  * Nút bấm: `active:translate-y-0.5` (lún nhẹ 1px tạo cảm giác bấm cơ học).
* **Theme Switching Transition:**
  * Toàn bộ màu nền và viền chuyển đổi êm ái: `transition: background-color 200ms ease, border-color 200ms ease`.

---

## 7. VOICE (NGÔN NGỮ & GIỌNG ĐIỆU SẢN PHẨM)

* **Giọng điệu:** Chuyên nghiệp, am hiểu sâu về kỹ thuật máy tập, mang tinh thần thể thao nhiệt huyết và chân thành.
* **Thuật ngữ chuẩn:** Dùng chính xác các thuật ngữ thể hình: *Personal Record (PR), Stack tạ, Biomechanics, Commercial Grade, Showroom chạy thử*.
* **CTA Rõ ràng:** "Book Thử Máy Miễn Phí", "Xem Review Chi Tiết", "Đặt Lịch Showroom".

---

## 8. BRAND (TRIẾT LÝ & DNA THƯƠNG HIỆU GYMGEAR)

* **Sứ mệnh:** Kết nối người tập thể hình, huấn luyện viên PT và chủ phòng gym với các thương hiệu thiết bị thể thao hàng đầu, loại bỏ sự mù mờ khi mua sắm máy tập tiền triệu/trăm triệu thông qua review thực tế và trải nghiệm chạy thử tại showroom.
* **DNA Thiết Kế:** Cơ khí chính xác, thể thao đỉnh cao, tốc độ và tin cậy tuyệt đối.

---

## 9. ANTI-PATTERNS (NHỮNG ĐIỀU TUYỆT ĐỐI CẤM)

1. ❌ **Chữ tối màu trên nền màu:** Tuyệt đối không để chữ xám/đen (`text-slate-900`) trên nền Accent (`#0866FF`, `#EF4444`, `#10B981`). Chữ và icon bắt buộc là `#FFFFFF`.
2. ❌ **AI Slop Cards:** Tránh các card bo tròn vô nghĩa với gradient tím/hồng nhạt đại trà.
3. ❌ **Glow / Blur quá đà:** Không dùng các đốm sáng blur-3xl che khuất nội dung đọc.
4. ❌ **Chớp trắng khi tải trang (FOUC):** Mọi logic theme phải có inline script đọc trước tại `<head>`.
5. ❌ **Làm vỡ widget dịch Google Translate:** Không xóa class xử lý thẻ `<font>` trong `globals.css`.
