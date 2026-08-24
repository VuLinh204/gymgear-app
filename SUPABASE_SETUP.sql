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
-- PHẦN 2: CỘT is_deleted CHO XÓA MỀM BÀI VIẾT
-- ============================================================
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

UPDATE public.posts SET is_deleted = false WHERE is_deleted IS NULL;

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

