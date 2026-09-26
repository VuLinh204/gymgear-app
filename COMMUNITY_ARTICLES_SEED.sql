-- Seed four non-product community posts for the two existing Premium demo accounts.
-- Safe to run more than once: rows are skipped when the same account already has
-- the same post content. Run from Supabase SQL Editor as a database owner.

WITH seed_posts(email, content) AS (
  VALUES
    (
      'hung@gymgear.vn',
      'Mình quay lại tập sau một thời gian bận công việc. Tuần đầu mình chỉ đặt mục tiêu đến phòng tập ba buổi, khởi động kỹ và tập nhẹ để cơ thể quen nhịp. Giữ lịch vừa sức giúp mình dễ duy trì hơn là cố tập thật nặng ngay từ đầu. Mọi người thường làm gì để không bỏ buổi khi lịch làm việc dày?'
    ),
    (
      'hung@gymgear.vn',
      'Một điều mình học được khi tập cùng bạn mới là đừng ngại giảm mức tạ để làm đúng động tác. Bọn mình thường quay một set ngắn, xem lại tư thế rồi mới tăng tải. Tiến bộ chậm nhưng đều vẫn vui hơn là đau vì vội. Nếu bạn mới bắt đầu, hãy tìm người có kinh nghiệm hoặc PT để được hướng dẫn những buổi đầu nhé.'
    ),
    (
      'nam@gymgear.vn',
      'Dạo này mình chú ý ngủ đủ và dành ngày nghỉ giữa các buổi tập nặng. Trước đây mình cứ nghĩ phải tập liên tục mới tiến bộ, nhưng khi cơ thể được hồi phục thì các buổi sau cũng có chất lượng hơn. Anh em có thói quen nào giúp ngủ ngon sau buổi tập tối không?'
    ),
    (
      'nam@gymgear.vn',
      'Mình đang thử chia lịch tập theo nhóm cơ để buổi tập gọn hơn: hôm đẩy, hôm kéo và hôm chân. Mỗi buổi ghi lại vài bài chính cùng số lần lặp để tuần sau biết mình đang tiến bộ thế nào. Không cần lịch quá phức tạp; quan trọng là chọn lịch phù hợp thời gian và theo được lâu dài.'
    )
), resolved_posts AS (
  SELECT u.id AS author_id, s.content
  FROM seed_posts AS s
  JOIN public.users AS u ON lower(trim(u.email)) = lower(trim(s.email))
)
INSERT INTO public.posts (author_id, content, rating, equipment_id)
SELECT r.author_id, r.content, 0, NULL
FROM resolved_posts AS r
WHERE NOT EXISTS (
  SELECT 1
  FROM public.posts AS existing
  WHERE existing.author_id = r.author_id
    AND existing.content = r.content
);
