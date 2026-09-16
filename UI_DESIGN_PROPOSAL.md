# 🏆 BẢN ĐỀ XUẤT THIẾT KẾ GIAO DIỆN GYMGEAR (HALLMARK × ORIGINKIT × GYMTOK)
> **Dành cho:** Duyệt giao diện Mạng Xã Hội Máy Tập Gym & Review Thể Hình  
> **Áp dụng triết lý:** Hallmark Design DNA (Chống generic AI slop, layout đậm chất thể hình công nghiệp, micro-interactions xúc giác) & OriginKit (Animation mượt mà, popover đàn hồi).

---

## 📑 MỤC LỤC
1. [Triết lý thiết kế Hallmark áp dụng cho GymGear](#1-triết-lý-thiết-kế-hallmark-áp-dụng-cho-gymgear)
2. [3 Bộ Theme Màu Độc Quyền Cho Mạng Xã Hội Gym](#2-3-bộ-theme-màu-độc-quyền-cho-mạng-xã-hội-gym)
3. [Nút Đổi Theme & Popover Tương Tác (Theo Phong Cách OriginKit)](#3-nút-đổi-theme--popover-tương-tác-theo-phong-cách-originkit)
4. [Overlay Mở Trang Kiểu Facebook (App Launch Splash)](#4-overlay-mở-trang-kiểu-facebook-app-launch-splash)
5. [Nâng Cấp Giao Diện Thành Phần (Hallmark + TikTok GymTok)](#5-nâng-cấp-giao-diện-thành-phần-hallmark--tiktok-gymtok)
6. [Quy Tắc Tương Phản & Trải Nghiệm Người Dùng (UX/Accessibility)](#6-quy-tắc-tương-phản--trải-nghiệm-người-dùng-uxaccessibility)

---

## 1. TRIẾT LÝ THIẾT KẾ HALLMARK ÁP DỤNG CHO GYMGEAR

Hallmark (`nutlope/hallmark`) sinh ra nhằm loại bỏ hoàn toàn cảm giác "AI Slop" — các giao diện web mẫu rập khuôn, các khối bo góc vô hồn với gradient tím mờ nhạt. Đối với GymGear, Hallmark định hình một **DNA thiết kế đậm chất cơ khí & thể thao hiệu suất cao**:

* **Tính cơ học & Xúc giác (Tactile Depth):** Các nút bấm và card máy tập mang cảm giác "nhấn" thật (tactile depress), viền kim loại phay xước tinh tế (`border-slate-800/80` kết hợp `ring-1 ring-inset`), độ bóng vật lý nhẹ của thiết bị phòng gym thương mại.
* **Typographic Punch (Phân cấp chữ đanh thép):** Tiêu đề kỹ thuật, thông số tạ (Weight Stack, Biomechanics) dùng font số to bản, dứt khoát như màn hình điện tử trên máy tập Technogym / LifeFitness.
* **Bento Grid Bất đối xứng (Asymmetric Athletic Bento):** Thay vì lưới card đều tăm tắp, bố cục bài viết và máy tập phân tầng: máy Spotlight nổi bật lớn, thẻ thông số nhanh và video clip GymTok dạng dọc xen kẽ tự nhiên.
* **Micro-interactions có chủ đích:** Mọi hiệu ứng hover, active đều phản hồi tức thì (150ms - 200ms spring physics), không có hiệu ứng thừa làm chậm trải nghiệm duyệt feed.

---

## 2. 3 BỘ THEME MÀU ĐỘC QUYỀN CHO MẠNG XÃ HỘI GYM

Mỗi theme đều hỗ trợ cả **Dark Mode** (chủ đạo của phòng tập hiện đại) và **Light Mode** (sạch sẽ, thanh thoát ban ngày).

### 🟢 Theme 1: Cyber Volt / Gymshark Black (Hiệu Suất Vận Động Viên)
* **Ý nghĩa:** Lấy cảm hứng từ trang phục tập luyện Gymshark, Nike Pro và năng lượng bùng nổ của phòng tập Crossfit / Powerlifting. Màu xanh Volt kích thích dopamine và năng lượng tập luyện.
* **Bảng màu:**
  * **Accent chính:** `#CCFF00` (Electric Volt Lime) hoặc `#10B981` (Hyper Green)
  * **Accent Hover:** `#AEE600` / `#059669`
  * **Background Dark:** `#0B0D11` (Carbon Obsidian)
  * **Card Surface Dark:** `#131720` (Matte Graphite)
  * **Border / Inset:** `#1F2633`
  * **Text tương phản trên nút xanh:** `#000000` (chữ đen đậm trên nền Volt) hoặc `#FFFFFF` (trên nền Green 500)
* **Phong cách:** Trẻ trung, "cháy", đậm chất GymTokers khoe PR & form tập.

---

### 🔵 Theme 2: Royal Meta / Facebook Pro (Mạng Xã Hội Thân Thuộc & Thương Mại)
* **Ý nghĩa:** Thừa hưởng độ tin cậy và sự quen thuộc tối đa từ Facebook & Instagram. Người dùng lướt feed, nhắn tin đặt lịch chạy thử máy tập mà không thấy bỡ ngỡ.
* **Bảng màu:**
  * **Accent chính:** `#0866FF` (Facebook Primary Blue - Thiết kế phẳng, không gradient)
  * **Accent Hover:** `#0055D4`
  * **Background Dark:** `#18191A` (Facebook Midnight Dark)
  * **Card Surface Dark:** `#242526` (FB Post Surface)
  * **Border / Divider:** `#3A3B3C`
  * **Text tương phản:** Luôn là `#FFFFFF` (100% chữ trắng trên nền xanh, icon trắng tinh khôi)
* **Phong cách:** Mạng xã hội chuyên nghiệp, giao dịch booking rõ ràng, văn minh.

---

### 🔴 Theme 3: Crimson Pulse / Iron Beast (Heavy Duty & Thể Hình Đỉnh Cao)
* **Ý nghĩa:** Lấy cảm hứng từ phòng tập tạ nặng Gold's Gym, Rogue Fitness và tinh thần "No Pain No Gain". Màu đỏ lửa biểu trưng cho nhịp tim đập dồn dập (pulse) khi đẩy tạ nặng.
* **Bảng màu:**
  * **Accent chính:** `#EF4444` / `#FF3B30` (Crimson Blaze)
  * **Accent Hover:** `#DC2626`
  * **Background Dark:** `#0E0E10` (Cast Iron Raw)
  * **Card Surface Dark:** `#18181C` (Gunmetal Surface)
  * **Border / Divider:** `#2B2B33`
  * **Text tương phản:** Luôn là `#FFFFFF` (100% chữ trắng trên nền đỏ crimson)
* **Phong cách:** Mạnh mẽ, cơ bắp, hardcore, tôn vinh các cỗ máy khối tạ nặng và squat rack.

---

## 3. NÚT ĐỔI THEME & POPOVER TƯƠNG TÁC (THEO PHONG CÁCH ORIGINKIT)

Tham khảo từ [OriginKit](https://www.originkit.dev/) (Bộ UI component animation cao cấp):

### 🎯 Vị trí & Hành vi mở:
* Đặt tại vị trí nút đổi theme hiện tại trên **Navbar** (bên cạnh chuông thông báo & nút Đặt Lịch).
* Khi click, xuất hiện **Popover Dropdown** nằm ngay bên dưới nút bấm (`top-full mt-2 right-0`), có mũi tên chỉ nhẹ hoặc căn lề gọn gàng.
* **Hiệu ứng chuyển mượt (Spring Animation):**
  * Popover bung ra với hiệu ứng scale `0.95 -> 1.0` kết hợp opacity `0 -> 1` trong 180ms theo đường cong `cubic-bezier(0.16, 1, 0.3, 1)` không giật lag.
  * Khi chọn theme, toàn bộ màu nền và accent của website chuyển màu êm dịu (CSS transition `background-color 200ms ease, border-color 200ms ease`).

### 📦 Nội dung bên trong Popover:
1. **Tiêu đề mini:** "Bảng Màu Thể Hình" kèm icon palette.
2. **3 Thẻ Theme trực quan:**
   * Mỗi thẻ có chấm màu tròn đại diện (Volt Green / Meta Blue / Crimson Red) + tên theme + mô tả ngắn.
   * Thẻ đang active có viền sáng và dấu check `✓` nổi bật.
3. **Toggle Sáng / Tối (Dark / Light Mode):**
   * Công tắc trượt dạng Pill (Segmented Control) với icon Mặt Trời ☀️ và Mặt Trăng 🌙 để đổi tone sáng/tối độc lập cho từng theme.

---

## 4. OVERLAY MỞ TRANG KIỂU FACEBOOK (APP LAUNCH SPLASH)

Đúng theo yêu cầu giống Facebook Mobile / Facebook Web:

* **Trải nghiệm khi người dùng vừa truy cập website:**
  * Toàn màn hình hiển thị overlay nền đen (`#18191A` hoặc carbon tùy theme).
  * Ở chính giữa: **Logo GymGear** sắc nét kèm hiệu ứng nhịp thở nhẹ (subtle scale pulse `1.0 -> 1.05`).
  * Phía dưới: Tên thương hiệu **"GYMGEAR"** và dòng chữ nhỏ: **"Từ Đam Mê Đến Thể Hình Đỉnh Cao"** hoặc biểu tượng tải thanh mảnh dạng đường chạy.
* **Thời gian hiển thị:** Rất nhanh (khoảng 600ms - 800ms) để không làm phiền người dùng nhưng tạo ấn tượng như một ứng dụng Native App cao cấp.
* **Hiệu ứng kết thúc (Exit Animation):**
  * Overlay mờ dần (`opacity: 0`) và zoom nhẹ (`scale: 1.02`) rồi unmount hoàn toàn khỏi DOM, để lộ giao diện trang chính mượt mà.
  * Lưu vào `sessionStorage` để không lặp lại gây ức chế khi người dùng chuyển trang nội bộ, chỉ hiện khi mới mở phiên làm việc.

---

## 5. NÂNG CẤP GIAO DIỆN THÀNH PHẦN (HALLMARK + TIKTOK GYMTOK)

Kết hợp các xu hướng hot nhất từ TikTok thể hình và chuẩn mực Hallmark:

### 🏋️ Card Máy Tập (Equipment Card) - Hallmark Spec Sheet:
* **HUD Thông Số Kỹ Thuật:** Thêm các badge đo lường nhanh trực tiếp trên ảnh máy tập:
  * Trọng lượng khối tạ tối đa: e.g. `Stack: 120kg`
  * Nhóm cơ mục tiêu: `Chest / Triceps` với icon cơ bắp
  * Cấp độ thiết bị: `Commercial Grade` (Phòng tập lớn) hoặc `Home Gym Pro`
* **Nút bấm xúc giác (Tactile CTA):** Nút "Đặt Lịch Thử Máy" phẳng, chữ trắng rõ ràng, viền sáng micro-ring, hiệu ứng bấm sâu 1px.

### 📱 Dải Story & Video GymTok (Stories Bar & Reels Feed):
* Khung Story dạng đứng chuẩn tỉ lệ 9:16 như TikTok / Facebook Reels với vòng tròn hiển thị trạng thái xem.
* Huy hiệu "PR Mới" (Personal Record) dán góc ảnh clip (ví dụ: *Bench 120kg*, *Squat 180kg*).

### 💬 Khung Đăng Bài (Create Post Card) & Thẻ Bài Viết (PostCard):
* Thiết kế gọn gàng, thanh thoát như Facebook, tách biệt rõ ràng khu vực nhập liệu và nút đính kèm hình ảnh máy tập/video clip.
* Thống kê tương tác (Like, Bình luận, Chia sẻ, Bookmark lưu máy tập) với viền mỏng cao cấp, không gây rối mắt.

---

## 6. QUY TẮC TƯƠNG PHẢN & TRẢI NGHIỆM NGƯỜI DÙNG (UX/ACCESSIBILITY)

* **Quy tắc Vàng đã thiết lập:**
  * Mọi nút bấm có nền màu Accent (Xanh Meta `#0866FF`, Đỏ `#EF4444`, Xanh lá `#10B981`) **BẮT BUỘC có chữ trắng 100% (`#FFFFFF`) và icon trắng tinh**.
  * Riêng theme Cyber Volt nếu chọn nền vàng chanh `#CCFF00` thì chữ bên trong là đen tuyền `#000000` để đảm bảo độ tương phản tối đa (WCAG AAA).
* **Không làm chậm tốc độ web:**
  * Mọi animation viết bằng CSS thuần và Tailwind transitions tối ưu phần cứng GPU (`transform`, `opacity`).
  * Tránh các thư viện cồng kềnh gây nặng bundle.

---

### 👉 BƯỚC TIẾP THEO:
Bạn vui lòng xem qua các mẫu và phương án trên:
1. Bạn có duyệt phương án **3 Theme màu** và thiết kế **Theme Switcher Popover + Facebook Splash Overlay** này không?
2. Có điểm nào bạn muốn điều chỉnh riêng cho logo hoặc màu sắc trước khi tôi bắt tay vào code không?
