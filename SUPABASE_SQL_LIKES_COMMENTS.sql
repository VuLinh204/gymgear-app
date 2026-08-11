-- ============================================================
-- XOÁ BẢNG CŨ NẾU TỒN TẠI (để tránh conflict)
-- ============================================================
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;

-- ============================================================
-- BƯỚC 1: Tạo bảng LIKES (lưu tim/like bài viết)
-- ============================================================
CREATE TABLE public.likes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL,   -- auth.uid() của Supabase
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, author_id)  -- Mỗi user chỉ like 1 bài 1 lần
);

-- ============================================================
-- BƯỚC 2: Tạo bảng COMMENTS (lưu bình luận bài viết)
-- ============================================================
CREATE TABLE public.comments (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL,   -- auth.uid() của Supabase (dùng cho RLS)
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BƯỚC 3: Bật RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BƯỚC 4: Policies cho bảng LIKES
-- ============================================================
CREATE POLICY "likes_select_all" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "likes_insert_auth" ON public.likes
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "likes_delete_own" ON public.likes
  FOR DELETE USING (author_id = auth.uid());

-- ============================================================
-- BƯỚC 5: Policies cho bảng COMMENTS
-- ============================================================
CREATE POLICY "comments_select_all" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_auth" ON public.comments
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE USING (author_id = auth.uid());


