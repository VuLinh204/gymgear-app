-- ============================================================
-- FILE NÀY TỔNG HỢP TẤT CẢ CÁC LỆNH SQL CẦN THIẾT
-- CHẠY TOÀN BỘ FILE NÀY TRONG SUPABASE SQL EDITOR
-- ============================================================

-- ============================================================
-- PHẦN 1: TẠO STORAGE BUCKET (Lưu ảnh)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies (bỏ qua lỗi nếu đã tồn tại)
DO $$ BEGIN
  CREATE POLICY "Cho phep moi nguoi xem anh" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Chi nguoi dung dang nhap duoc tai anh len" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Nguoi dung tu xoa anh cua minh" ON storage.objects FOR DELETE USING ( bucket_id = 'images' AND auth.uid() = owner );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Nguoi dung tu cap nhat anh cua minh" ON storage.objects FOR UPDATE USING ( bucket_id = 'images' AND auth.uid() = owner );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 2: CỘT is_deleted CHO XÓA MỀM BÀI VIẾT & CỘT CHO COMMENT LỒNG NHAU
-- ============================================================
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

UPDATE public.posts SET is_deleted = false WHERE is_deleted IS NULL;

-- Cột cho bình luận lồng nhau (TikTok/Facebook Nested Comments)
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS reply_to_user TEXT;

-- ============================================================
-- PHẦN 3: BẢNG BOOKMARKS (Lưu bài viết)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL,  -- auth.uid()
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "bookmarks_select_own" ON public.bookmarks FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bookmarks_insert_auth" ON public.bookmarks FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bookmarks_delete_own" ON public.bookmarks FOR DELETE USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 4: CHÍNH SÁCH RLS CHO POSTS (Xóa bài viết)
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE USING (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (author_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 5: BẢNG FOLLOWS (Theo dõi người dùng)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.follows (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_auth UUID NOT NULL, -- auth.uid() of follower
  following_auth UUID NOT NULL, -- auth.uid() of the user being followed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (follower_auth, following_auth)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "follows_select_public" ON public.follows FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Xoá policy cũ nếu tồn tại (chạy lần đầu hoặc re-run)
DO $$ BEGIN
  DROP POLICY IF EXISTS "follows_select_own" ON public.follows;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "follows_insert_auth" ON public.follows FOR INSERT WITH CHECK (follower_auth = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE USING (follower_auth = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 6: BẢNG REPOSTS (Chia sẻ / đăng lại bài viết)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reposts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_auth UUID NOT NULL, -- auth.uid() of the user who reposted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, author_auth)
);

ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "reposts_select_own" ON public.reposts FOR SELECT USING (author_auth = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "reposts_insert_auth" ON public.reposts FOR INSERT WITH CHECK (author_auth = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "reposts_delete_own" ON public.reposts FOR DELETE USING (author_auth = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 7: BẢNG STORIES (Stories 24 giờ)
-- ============================================================

-- Bảng lưu stories
CREATE TABLE IF NOT EXISTS public.stories (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_auth  TEXT,                                                       -- auth.uid()
  author_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,         -- users.id
  image_url    TEXT NOT NULL,                                              -- URL ảnh
  caption      TEXT,                                                       -- Caption ngắn
  equipment_id TEXT REFERENCES public.equipments(id) ON DELETE SET NULL,  -- gắn thẻ máy tập (optional)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Đảm bảo cột author_auth luôn tồn tại nếu bảng đã được tạo trước đó
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS author_auth TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.users(id) ON DELETE CASCADE;


ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Mọi người đều xem được stories còn hạn
DO $$ BEGIN
  CREATE POLICY "stories_select_all" ON public.stories
    FOR SELECT USING (expires_at > NOW());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Chỉ người đã đăng nhập mới tạo được story
DO $$ BEGIN
  CREATE POLICY "stories_insert_auth" ON public.stories
    FOR INSERT WITH CHECK (auth.uid()::text = author_auth);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Chỉ chủ story mới xoá được
DO $$ BEGIN
  CREATE POLICY "stories_delete_own" ON public.stories
    FOR DELETE USING (auth.uid()::text = author_auth);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Bảng tracking ai đã xem story nào
CREATE TABLE IF NOT EXISTS public.story_views (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id   UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  viewer_id  UUID NOT NULL,                                               -- auth.uid() của người xem
  viewed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (story_id, viewer_id)
);

ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

-- Mọi người đều đọc được (để đếm views)
DO $$ BEGIN
  CREATE POLICY "story_views_select_all" ON public.story_views
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Chỉ người đã đăng nhập mới mark viewed được
DO $$ BEGIN
  CREATE POLICY "story_views_insert_auth" ON public.story_views
    FOR INSERT WITH CHECK (viewer_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 8: BẢNG NOTIFICATIONS (Trung tâm thông báo)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     TEXT NOT NULL,                                              -- Người nhận (auth_id hoặc users.id)
  actor_id    TEXT,                                                       -- Người tạo hành động
  actor_name  TEXT,
  actor_avatar TEXT,
  type        TEXT NOT NULL,                                              -- 'like', 'comment', 'follow', 'booking', 'system'
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  target_id   TEXT,                                                       -- ID bài viết, booking hoặc link
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "notifications_select_all" ON public.notifications
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "notifications_insert_all" ON public.notifications
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "notifications_update_all" ON public.notifications
    FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 9: BẢNG CHAT & TIN NHẮN (Direct Gym Chat)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id       TEXT NOT NULL,
  sender_name     TEXT,
  sender_avatar   TEXT,
  receiver_id     TEXT NOT NULL,
  text            TEXT NOT NULL,
  image_url       TEXT,
  equipment_id    TEXT,
  is_read         BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "chat_messages_select_all" ON public.chat_messages
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "chat_messages_insert_all" ON public.chat_messages
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "chat_messages_update_all" ON public.chat_messages
    FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 10: BẢNG KỶ LỤC TẬP LUYỆN PR (Personal Records)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_prs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT NOT NULL,
  exercise_name TEXT NOT NULL,                                            -- 'Bench Press', 'Leg Press', 'Squat', v.v.
  weight_kg     NUMERIC NOT NULL,
  reps          INTEGER DEFAULT 1,
  notes         TEXT,
  equipment_id  TEXT,
  achieved_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_prs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "user_prs_select_all" ON public.user_prs
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "user_prs_insert_all" ON public.user_prs
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "user_prs_delete_all" ON public.user_prs
    FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 11: BẢNG EQUIPMENTS (Thiết bị máy tập gym)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.equipments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT DEFAULT 'commercial',
  model_number TEXT,
  price_range TEXT,
  vip_price TEXT,
  estimated_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  thumbnail TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  excerpt TEXT,
  full_description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  available_for_booking BOOLEAN DEFAULT true,
  showroom_locations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "equipments_select_all" ON public.equipments FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "equipments_insert_auth" ON public.equipments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "equipments_update_auth" ON public.equipments FOR UPDATE USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 12: BẢNG CATEGORIES (Danh mục thiết bị)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed Categories
INSERT INTO public.categories (id, name, description, icon_name, display_order)
VALUES
  ('all', 'Tất cả bài viết', 'Toàn bộ bài review & chia sẻ kinh nghiệm máy tập', 'Grid', 1),
  ('cardio', 'Máy Cardio', 'Máy chạy bộ, xe đạp trượt tuyết, máy chèo thuyền', 'Activity', 2),
  ('strength', 'Máy Sức Mạnh', 'Máy ép ngực, kéo xô, leg press, đạp đùi chuyên sâu', 'Dumbbell', 3),
  ('home-gym', 'Thiết Bị Home Gym', 'Khung gánh đa năng, máy tập tổng hợp gia đình', 'Home', 4),
  ('racks-benches', 'Khung Gánh & Ghế', 'Power rack, Smith machine, ghế tập bụng & tạ', 'Layers', 5),
  ('accessories', 'Phụ Kiện Gym', 'Tạ đơn, tạ đĩa, thảm cao su chuyên dụng', 'Disc', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order;

-- ============================================================
-- PHẦN 13: BẢNG SHOWROOMS (Hệ thống chi nhánh Showroom)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.showrooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  machines INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 4.8,
  brands JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "showrooms_select_all" ON public.showrooms FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed Showrooms
INSERT INTO public.showrooms (name, address, phone, hours, machines, rating, brands, image, tags, is_open)
VALUES
  ('GymGear Showroom Hà Nội - Cầu Giấy', '12 Trần Thái Tông, Cầu Giấy, Hà Nội', '024 3789 1234', 'T2-T7: 8:00-21:00 | CN: 9:00-18:00', 45, 4.8, '["Impulse", "Matrix", "Technogym"]'::jsonb, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', '["Thương mại", "Home Gym", "Máy Cardio"]'::jsonb, true),
  ('GymGear Showroom TP.HCM - Bình Thạnh', '290 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM', '028 3895 6789', 'T2-T7: 8:00-21:00 | CN: 9:00-18:00', 60, 4.9, '["DHZ", "Panatta", "BH Fitness"]'::jsonb, 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800', '["Thương mại", "Máy Sức Mạnh", "Khung Gánh"]'::jsonb, true),
  ('GymGear Showroom Đà Nẵng', '45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng', '0236 3892 345', 'T2-T6: 8:30-20:00 | T7-CN: 9:00-17:00', 30, 4.7, '["Life Fitness", "Matrix", "Impulse"]'::jsonb, 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', '["Thương mại", "Máy Cardio", "Đa Năng"]'::jsonb, false),
  ('GymGear Showroom TP.HCM - Quận 7', '168 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM', '028 5412 3698', 'T2-T7: 8:00-22:00 | CN: 9:00-18:00', 50, 4.8, '["Technogym", "Cybex", "Precor"]'::jsonb, 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800', '["VIP Cao Cấp", "Thương mại", "Cardio", "Sức Mạnh"]'::jsonb, true),
  ('GymGear Showroom Hà Nội - Long Biên', '58 Ngô Gia Tự, Long Biên, Hà Nội', '024 3762 9087', 'T2-T7: 8:00-20:00 | CN: Đóng cửa', 35, 4.6, '["DHZ", "Impulse", "BH Fitness"]'::jsonb, 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800', '["Home Gym", "Tiết Kiệm", "Máy Sức Mạnh"]'::jsonb, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PHẦN 14: BẢNG REVIEWS (Đánh giá thiết bị máy tập)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT,
  user_avatar TEXT,
  rating NUMERIC NOT NULL,
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  verified_booking BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "reviews_insert_all" ON public.reviews FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed Reviews mẫu ban đầu
INSERT INTO public.reviews (id, equipment_id, user_name, user_role, rating, title, comment, verified_booking)
VALUES
  ('3c11f44a-9b16-4df1-872e-0a562ef2a001', 'eq-1', 'Nguyễn Văn Hùng', 'Chủ chuỗi Gym FitPlus (3 cơ sở)', 5, 'PT300H xứng đáng là máy chạy bền nhất!', 'Tôi đã sắm 8 con Impulse PT300H cho 2 chi nhánh ở Cầu Giấy và Hà Đông. Máy chạy êm ru, hội viên chạy ngày 16 tiếng không thấy hỏng vặt bao giờ.', true),
  ('3c11f44a-9b16-4df1-872e-0a562ef2a002', 'eq-2', 'Trần Hoàng Nam', 'HLV Cá Nhân (Personal Trainer)', 5, 'Leg Press DHZ đạp cực êm, chuẩn form', 'Con Leg Press DHZ Fusion này góc đạp 45 độ chuẩn đét, đệm lưng ôm sát cột sống nên khách hàng tớ đạp 300kg vẫn an toàn khớp gối.', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PHẦN 15: CHÍNH SÁCH RLS BOOKINGS CHO KHÁCH & SEED BOOKINGS
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "bookings_insert_public" ON public.bookings FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bookings_select_public" ON public.bookings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "bookings_update_all" ON public.bookings FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- PHẦN 16: BẢNG AI_KNOWLEDGE_DOCS (Kho Tri Thức Cho Chatbot AI)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_knowledge_docs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom',
  content TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  author_name TEXT DEFAULT 'Admin GymGear',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_knowledge_docs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "ai_knowledge_docs_select_all" ON public.ai_knowledge_docs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ai_knowledge_docs_insert_all" ON public.ai_knowledge_docs FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ai_knowledge_docs_update_all" ON public.ai_knowledge_docs FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "ai_knowledge_docs_delete_all" ON public.ai_knowledge_docs FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed dữ liệu kho tri thức mẫu ban đầu
INSERT INTO public.ai_knowledge_docs (id, title, category, content, keywords, author_name)
VALUES
  (
    'doc-ppl-schedule',
    'Cẩm nang Lịch tập Push-Pull-Legs (PPL) Chuẩn Khoa Học',
    'workout',
    'Lịch tập Push-Pull-Legs (PPL) là phương pháp tối ưu hóa khối lượng cơ bắp (Hypertrophy) hàng đầu: Buổi 1 (Push - Đẩy) tập Ngực/Vai/Tay Sau; Buổi 2 (Pull - Kéo) tập Lưng xô/Vai sau/Tay Trước; Buổi 3 (Legs) tập Đùi trước/sau/Bắp chân/Bụng. Nghỉ 1 ngày hoặc lặp lại chu kỳ 6 buổi/tuần.',
    '["lịch tập", "push pull legs", "ppl", "ngực", "lưng", "chân", "tăng cơ"]'::jsonb,
    'Master Trainer GymGear'
  ),
  (
    'doc-showroom-policy',
    'Quy Trình & Chính Sách Đặt Lịch Trải Nghiệm Showroom 0đ',
    'policy',
    'Chính sách thử máy tại hệ thống Showroom GymGear: Chi phí hoàn toàn MIỄN PHÍ (0đ) cho mọi khách hàng. Khách được trực tiếp trải nghiệm máy tập với sự hướng dẫn 1-1 của Chuyên viên kỹ thuật & Master Trainer. Showroom Hà Nội (Cầu Giấy, Long Biên) & TP.HCM (Quận 10, Bình Thạnh, Quận 7).',
    '["showroom", "đặt lịch", "thử máy", "miễn phí", "trải nghiệm", "cầu giấy"]'::jsonb,
    'Bộ Phận Showroom GymGear'
  ),
  (
    'doc-premium-pricing',
    'Chính Sách Báo Giá Ưu Đãi Đại Lý & Hội Viên Premium',
    'pricing',
    'Chính sách chiết khấu đặc quyền cho tài khoản Premium và Chủ phòng Gym: Giảm trực tiếp từ 10% đến 15% so với giá niêm yết thương mại trên mọi đầu máy. Hỗ trợ miễn phí bản vẽ 2D/3D bố trí mặt bằng, miễn phí vận chuyển & lắp đặt toàn quốc, bảo trì định kỳ 6 tháng/lần trong 2 năm đầu.',
    '["giá", "báo giá", "chiết khấu", "premium", "đại lý", "ưu đãi"]'::jsonb,
    'Phòng Kinh Doanh GymGear'
  ),
  (
    'doc-warranty-service',
    'Chính Sách Bảo Hành 5 Năm & Hỗ Trợ Kỹ Thuật 24/7',
    'policy',
    'Cam kết hậu mãi: Khung sườn thép bảo hành 5 năm không gỉ sét. Động cơ motor AC máy chạy bộ bảo hành 5 năm. Bảng mạch điện tử & cáp kéo bảo hành 2 năm. Chính sách 1 đổi 1 trong 30 ngày nếu có lỗi sản xuất. Phản hồi xử lý kỹ thuật trong vòng 24h tại HN, TP.HCM, Đà Nẵng.',
    '["bảo hành", "sửa chữa", "hỏng", "linh kiện", "động cơ", "kỹ thuật"]'::jsonb,
    'Trung Tâm Kỹ Thuật GymGear'
  ),
  (
    'doc-nutrition-guide',
    'Hướng Dẫn Dinh Dưỡng Thể Hình Tăng Cơ Giảm Mỡ',
    'nutrition',
    'Nguyên tắc dinh dưỡng chuẩn thể hình: Nạp Protein 1.6g - 2.2g/kg thể trọng mỗi ngày (Ức gà, thịt bò, trứng, cá hồi, Whey Isolate). Tăng cơ (Bulking) thặng dư 300-500 kcal/ngày. Giảm mỡ (Cutting) thâm hụt 300-500 kcal/ngày. Bổ sung Whey Protein sau tập, Creatine 5g/ngày.',
    '["dinh dưỡng", "protein", "whey", "creatine", "ăn uống", "tăng cơ"]'::jsonb,
    'Chuyên Gia Dinh Dưỡng GymGear'
  )
ON CONFLICT (id) DO NOTHING;
