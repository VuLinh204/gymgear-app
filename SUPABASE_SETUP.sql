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
