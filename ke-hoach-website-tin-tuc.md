# KỊCH BẢN XÂY DỰNG WEBSITE REVIEW & BOOKING MÁY MÓC, THIẾT BỊ GYM (100% FREE STACK)

## GIAI ĐOẠN 0 — Xác định mục tiêu & phạm vi

- **Chủ đề chính**: Review, đánh giá chi tiết và Booking (đặt lịch trải nghiệm, thuê, mua, bảo trì) các loại máy móc, thiết bị tập Gym (Cardio, Strength/Sức mạnh, Khung gánh, Máy tập đa năng, Thiết bị phòng Gym commercial & home gym...).
- **Tiêu chí hạ tầng**: Sử dụng **100% các công cụ, nền tảng và dịch vụ MIỄN PHÍ (Free Tier / Open Source)**, chi phí vận hành ban đầu bằng 0 VNĐ.
- **Đối tượng độc giả & khách hàng**:
  - Chủ phòng Gym / Quản lý Fitness center cần tìm hiểu, so sánh và đặt lịch tư vấn/mua/thuê thiết bị.
  - Người tập cá nhân (Home gymers) chọn mua/trải nghiệm máy tập tại nhà.
  - Các nhà cung cấp / Hãng phân phối máy tập gym cần kênh quảng bá và nhận booking lead.
- **Mô hình kiếm tiền (Monetization)**:
  - **Phí Booking / Lead Generation**: Hoa hồng khi giới thiệu khách đặt mua/thử máy/thuê thiết bị.
  - **Affiliate Marketing**: Link liên kết mua sắm máy tập, phụ kiện gym trên các sàn và nhà phân phối.
  - **Bài viết PR / Review tài trợ**: Hợp tác với các hãng thiết bị (Impulse, Technogym, Matrix, DHZ, Panatta...).
  - **Quảng cáo Banner & Google AdSense**: Khai thác traffic tìm kiếm.
- **Quy mô ban đầu**: MVP tập trung vào hệ thống Review bài viết chuẩn + Hệ thống Booking/Yêu cầu báo giá cho thiết bị Gym.

**Đầu ra**: Document định hướng mission statement — Nền tảng Review & Booking máy tập Gym hàng đầu Việt Nam (Chi phí vận hành 0đ).

---

## GIAI ĐOẠN 1 — Nghiên cứu & phân tích chuyên mục

- Khảo sát các trang đánh giá thiết bị gym quốc tế (Garage Gym Reviews, Treadmill Review Guru...) và các trang cung cấp thiết bị gym tại VN.
- Công cụ thiết kế Sitemap & Wireframe: **Figma Free Plan** (Miễn phí 100%).
- **5–8 Chuyên mục chính**:
  1. **Máy Cardio**: Máy chạy bộ (Treadmill), Xe đạp tập (Spin bike), Máy chèo thuyền (Rower), Máy trượt tuyết (Elliptical)...
  2. **Máy tập Sức mạnh (Strength Equipment)**: Máy ép ngực, Máy kéo xô, Máy đạp đùi (Leg Press), Khung gánh (Power Rack/Smith Machine)...
  3. **Thiết bị Home Gym**: Máy tập đa năng gia đình, Tạ đơn/Tạ đôi, Thảm & Phụ kiện.
  4. **Review & So sánh**: Đánh giá chuyên sâu (Ưu/Nhược điểm, Thông số kỹ thuật, Giá thành, Độ bền).
  5. **Booking & Thuê/Mua**: Đặt lịch trải nghiệm thực tế tại Showroom/Phòng tập, đăng ký tư vấn set up phòng gym.
  6. **Kinh nghiệm & Bảo trì**: Hướng dẫn bảo dưỡng máy móc, kinh nghiệm mở phòng gym, chọn máy tập chuẩn form.

**Đầu ra**: Danh sách chuyên mục + sơ đồ site (sitemap).

---

## GIAI ĐOẠN 2 — Thiết kế kiến trúc hệ thống (Dịch vụ 100% Free)

### Sơ đồ tổng quan
```
[Khách hàng] → [Vercel CDN (Free)] → [Frontend (Next.js)] → [Supabase API (Free)] → [PostgreSQL DB (Free)]
                                                                    ↓
                                                   [Cloudinary Storage (25GB Free)]
                                                                    ↓
                                                   [Telegram Bot API (Free) + Resend Email (Free)]
```

### Danh sách Công cụ & Dịch vụ Miễn phí (Free Tier Stack)
| Thành phần | Công nghệ / Dịch vụ | Chi tiết gói Free |
|---|---|---|
| Frontend Hosting | **Vercel Hobby Plan** | **100% Miễn phí**: Auto SSL, 100GB Băng thông/tháng, CI/CD tự động từ GitHub. |
| Backend & Database | **Supabase Free Tier** hoặc **Neon.tech** | **100% Miễn phí**: 500MB PostgreSQL, Auto REST/GraphQL API, Auth sẵn có cho 50,000 MAU. |
| Media Storage (Ảnh/Video) | **Cloudinary Free Plan** hoặc **ImageKit** | **100% Miễn phí**: 25GB dung lượng & credits/tháng, tự động nén WebP & resize ảnh máy gym. |
| Thông báo Booking tức thì | **Telegram Bot API** | **100% Miễn phí không giới hạn**: Báo ngay tin nhắn Booking có khách đặt về điện thoại Sales/Admin. |
| Email xác nhận | **Resend Free Tier** / **Brevo** | **100% Miễn phí**: 3,000 email/tháng (Resend) hoặc 300 email/ngày (Brevo). |
| Thiết kế UI/UX | **Figma Free Plan** | **100% Miễn phí**: Vẽ Wireframe, thiết kế giao diện web. |
| Mã nguồn & Quản lý code | **GitHub / GitLab** | **100% Miễn phí**: Lưu trữ repo private, tự động trigger deploy sang Vercel. |
| Analytics & SEO | **Google Analytics 4 & Search Console** | **100% Miễn phí**: Đo lường lượt truy cập, từ khóa tìm kiếm. |
| Tên miền (Domain) | Subdomain miễn phí `.vercel.app` | **100% Miễn phí** (Tùy chọn mua domain `.com` / `.vn` sau này nếu cần). |

---

## GIAI ĐOẠN 3 — Thiết kế Database (Tối ưu cho Supabase Free 500MB)

```sql
-- Người dùng & Hãng sản xuất / Sales (Tận dụng Supabase Auth)
users (id, name, email, phone, role [admin, editor, customer, supplier], created_at)

-- Danh mục máy tập
categories (id, name, slug, parent_id, description, icon)

-- Thương hiệu / Nhà sản xuất (Impulse, Technogym, Matrix...)
brands (id, name, slug, logo, website, description)

-- Thiết bị / Máy tập Gym
equipments (
  id, name, slug, brand_id, category_id, model_number,
  price_range, specifications (jsonb: công suất, trọng lượng, kích thước, tải trọng),
  features, rating_avg, thumbnail, gallery (jsonb), status, created_at
)

-- Bài viết Review & Tin tức
articles (
  id, title, slug, excerpt, content, thumbnail, equipment_id,
  category_id, author_id, is_featured, view_count, published_at, status
)

-- Đánh giá từ người dùng / Chuyên gia
reviews (
  id, equipment_id, user_id, rating, pros, cons, content, images (jsonb), status, created_at
)

-- Yêu cầu Booking / Đặt lịch thử & mua máy
bookings (
  id, booking_code, user_id, customer_name, customer_phone, customer_email,
  equipment_id, booking_type [thu_may_truc_tiep, tu_van_bao_gia, thue_thiet_bi],
  preferred_date, location_address, note, status [pending, confirmed, completed, cancelled], created_at
)
```

**Đầu ra**: File sơ đồ Database & script khởi tạo bảng SQL chạy trên Supabase SQL Editor.

---

## GIAI ĐOẠN 4 — Thiết kế UI/UX (Wireframe & Flows)

Các trang giao diện cốt lõi (Sử dụng TailwindCSS/Vanilla CSS nhẹ mượt):
1. **Trang chủ (Homepage)**:
   - Banner hero giới thiệu dịch vụ Review & Đặt lịch trải nghiệm máy gym.
   - Thanh tìm kiếm nhanh & Bộ lọc thông minh (Chủ đề, Loại máy, Hãng, Ngân sách).
   - Top máy tập gym được đánh giá cao nhất (Featured Gym Equipment).
   - Bài viết Review mới nhất & Form đăng ký tư vấn Setup phòng gym.
2. **Trang danh sách máy & bài Review (Equipment Directory & Reviews)**:
   - Lọc đa chiều: Theo nhóm cơ, Loại máy (Cardio/Strength), Thương hiệu, Mức giá.
   - So sánh thông số kỹ thuật trực quan giữa 2-3 loại máy tập.
3. **Trang chi tiết máy tập (Equipment Detail Page)**:
   - Thông số kỹ thuật chi tiết, ưu/nhược điểm, video review thực tế.
   - Điểm đánh giá (Rating breakdown: Độ bền, Mượt mà, Thiết kế, P/P).
   - **Nút hành động chính**: `[Đặt lịch thử máy tại Showroom]` hoặc `[Yêu cầu báo giá / Thuê máy]`.
4. **Popup / Trang Form Booking**:
   - Chọn ngày giờ trải nghiệm, vị trí showroom/phòng tập gần nhất, nhập thông tin liên hệ.
5. **Trang Quản trị (Admin / Supplier Dashboard)**:
   - Tận dụng luôn Supabase Studio (Free) hoặc tự viết 1 trang Dashboard Next.js đơn giản.

---

## GIAI ĐOẠN 5 — Lộ trình phát triển MVP 0đ (6 tuần)

**Tuần 1–2: Cơ sở dữ liệu & Supabase Setup**
- Tạo dự án Supabase Free, khởi tạo bảng DB qua SQL Editor.
- Cấu hình Supabase Auth & Storage / Cloudinary Free API key.

**Tuần 3: Frontend Trang Danh mục & Chi tiết Máy (Next.js)**
- Giao diện bài review máy tập gym chuẩn SEO (Deploy thử lên Vercel Free).
- Bộ lọc thông số máy tập và tính năng so sánh máy.

**Tuần 4: Chức năng Booking & Telegram Notification**
- Xây dựng Form Booking trải nghiệm/báo giá mượt mà trên Mobile & Desktop.
- Kết nối Telegram Bot API (100% Free) gửi thông báo về nhóm Telegram Sales ngay khi khách bấm Booking.
- Gửi mail xác nhận tự động qua Resend Free Tier.

**Tuần 5: Trang Quản trị (CMS) & Quản lý Booking**
- Quản lý bài review và trạng thái đơn Booking (Pending, Confirmed, Completed).

**Tuần 6: Tối ưu SEO, Speed & Launch**
- Tối ưu SEO Schema (Product, Review, AggregateRating), tối ưu nén ảnh WebP qua Cloudinary.
- Kiểm thử luồng Booking, responsive mobile và Deploy Production chính thức trên Vercel.

---

## GIAI ĐOẠN 6 — Kế hoạch nội dung & Booking Lead (Chi phí 0đ)

- **Nội dung mồi (Init Data)**:
  - 30+ bài Review các dòng máy tập phổ biến nhất (Máy chạy bộ Impulse, Khung gánh Smith, Leg Press DHZ, Xe đạp Spin Bike...).
  - Các bài viết so sánh: "Nên mua máy chạy bộ đơn năng hay đa năng?", "Top 5 máy tập ngực tốt nhất cho phòng gym commercial".
- **Chiến lược phủ Booking**:
  - Đăng ký liên kết hợp tác với 3-5 Showroom / Nhà phân phối thiết bị Gym lớn để dẫn khách đến trải nghiệm.
  - Cam kết phản hồi yêu cầu Booking trong vòng 15-30 phút qua Telegram Notification.

---

## GIAI ĐOẠN 7 — SEO & Performance (Miễn phí)

- **Structured Data**: Schema `Product`, `Review`, `AggregateRating`, `BreadcrumbList` giúp hiển thị số sao đánh giá trên Google.
- **Tối ưu hình ảnh**: Lazy loading & tự động tối ưu WebP qua Cloudinary Free URL transformation.
- **URL chuẩn SEO**: `/review/may-chay-bo-impulse-pt300`, `/danh-muc/may-tap-cardio`.

---

## GIAI ĐOẠN 8 — Vận hành & Mở rộng kinh doanh (Chi phí 0đ ban đầu)

- Khai thác hoa hồng từ các hợp đồng mua bán/cho thuê máy tập gym thành công qua Booking.
- Reinvest lợi nhuận từ hoa hồng để đăng ký tên miền riêng (`.com` / `.vn`) và quảng cáo khi đã có doanh thu.
- Xây dựng cộng đồng Review máy tập gym (cho phép người tập thực tế upload ảnh/đánh giá phòng gym & máy tập).