-- ============================================================
-- SEED_DATA.sql  (v3 - compatible với schema thực tế)
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- ============================================================

-- ============================================================
-- BƯỚC 0: Tạo các bảng còn thiếu (nếu chưa tồn tại)
-- ============================================================

-- Bảng categories
CREATE TABLE IF NOT EXISTS public.categories (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  icon_name     TEXT NOT NULL DEFAULT 'Grid',
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Bảng showrooms
CREATE TABLE IF NOT EXISTS public.showrooms (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  address    TEXT NOT NULL,
  phone      TEXT NOT NULL,
  hours      TEXT NOT NULL,
  machines   INTEGER DEFAULT 0,
  rating     NUMERIC DEFAULT 4.8,
  brands     JSONB DEFAULT '[]'::jsonb,
  image      TEXT,
  tags       JSONB DEFAULT '[]'::jsonb,
  is_open    BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "showrooms_select_all" ON public.showrooms FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Bảng reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id     TEXT NOT NULL,
  user_id          TEXT,
  user_name        TEXT NOT NULL,
  user_role        TEXT,
  user_avatar      TEXT,
  rating           NUMERIC NOT NULL,
  title            TEXT NOT NULL,
  comment          TEXT NOT NULL,
  verified_booking BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "reviews_insert_all" ON public.reviews FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- BƯỚC 1: Thêm các cột còn thiếu vào bảng equipments
-- ============================================================

ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS slug             TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS brand_logo       TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS model_number     TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS price_range      TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS vip_price        TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS estimated_price  NUMERIC;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS rating           NUMERIC DEFAULT 5.0;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS review_count     INTEGER DEFAULT 0;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS thumbnail        TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS excerpt          TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS is_featured      BOOLEAN DEFAULT false;
ALTER TABLE public.equipments ADD COLUMN IF NOT EXISTS available_for_booking BOOLEAN DEFAULT true;

-- Các cột array/jsonb: kiểm tra kiểu đã tồn tại
-- gallery, pros, cons, showroom_locations có thể là text[] hoặc jsonb tuỳ schema
-- Dùng DO block để thêm an toàn
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipments' AND column_name='gallery') THEN
    ALTER TABLE public.equipments ADD COLUMN gallery text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipments' AND column_name='pros') THEN
    ALTER TABLE public.equipments ADD COLUMN pros text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipments' AND column_name='cons') THEN
    ALTER TABLE public.equipments ADD COLUMN cons text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipments' AND column_name='showroom_locations') THEN
    ALTER TABLE public.equipments ADD COLUMN showroom_locations text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipments' AND column_name='specifications') THEN
    ALTER TABLE public.equipments ADD COLUMN specifications jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- ============================================================
-- BƯỚC 2: INSERT 6 EQUIPMENTS
-- Dùng UPDATE riêng để tránh conflict kiểu dữ liệu
-- ============================================================

-- eq-1: Máy Chạy Bộ Impulse PT300H
INSERT INTO public.equipments (id, name, slug, brand, brand_logo, category, type, model_number, price_range, vip_price, estimated_price, rating, review_count, thumbnail, excerpt, full_description, is_featured, available_for_booking)
VALUES ('eq-1','Máy Chạy Bộ Thương Mại Impulse PT300H','may-chay-bo-impulse-pt300h','Impulse Fitness','https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100&auto=format&fit=crop&q=80','cardio','commercial','PT300H-2026','42.000.000đ - 48.000.000đ','38.500.000đ (Chiết khấu VIP 15%)',45000000,4.9,38,'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80','Dòng máy chạy bộ công suất khủng 4.0 HP AC chuyên dùng cho các phòng Gym thương mại mở 24/7. Thảm chạy siêu rộng, hệ thống giảm chấn kép tối ưu cho khớp gối.','Impulse PT300H là "vua bền bỉ" trong phân khúc máy chạy bộ phòng gym thương mại tại Việt Nam. Khung thép sơn tĩnh điện chống gỉ sét, động cơ AC 4.0 HP liên tục cho phép hoạt động liên tục 18 tiếng/ngày mà không nóng máy.',true,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,brand=EXCLUDED.brand,brand_logo=EXCLUDED.brand_logo,category=EXCLUDED.category,model_number=EXCLUDED.model_number,price_range=EXCLUDED.price_range,vip_price=EXCLUDED.vip_price,estimated_price=EXCLUDED.estimated_price,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,thumbnail=EXCLUDED.thumbnail,excerpt=EXCLUDED.excerpt,full_description=EXCLUDED.full_description,is_featured=EXCLUDED.is_featured,available_for_booking=EXCLUDED.available_for_booking;

UPDATE public.equipments SET
  gallery = ARRAY['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'],
  pros = ARRAY['Động cơ AC 4.0HP cực kỳ êm ái và siêu bền','Băng tải rộng 56cm thoải mái bứt tốc sprint','Hệ thống giảm chấn PuraCushion bảo vệ khớp gối'],
  cons = ARRAY['Trọng lượng máy nặng (210kg), khó di chuyển đơn lẻ'],
  showroom_locations = ARRAY['Showroom Hà Nội - Cầu Giấy','Showroom TP.HCM - Quận 10','Showroom Đà Nẵng'],
  specifications = '{"powerOutput":"4.0 HP AC (Peak 6.0 HP)","weightCapacity":"180 kg","dimensions":"2140 x 930 x 1480 mm","machineWeight":"210 kg","targetMuscles":["Tim mạch","Cơ đùi","Cơ bắp chân","Giảm mỡ toàn thân"],"warranty":"5 năm Động cơ & Khung, 2 năm Linh kiện điện tử"}'::jsonb
WHERE id = 'eq-1';

-- eq-2: Máy Đạp Đùi DHZ Fusion
INSERT INTO public.equipments (id, name, slug, brand, category, type, model_number, price_range, vip_price, estimated_price, rating, review_count, thumbnail, excerpt, full_description, is_featured, available_for_booking)
VALUES ('eq-2','Máy Đạp Đùi Nghiêng Leg Press 45 Độ DHZ Fusion','may-dap-dui-nghieng-leg-press-dhz-fusion','DHZ Fitness','strength','commercial','DHZ-E3056','36.000.000đ - 41.000.000đ','32.900.000đ (Chiết khấu VIP 12%)',38500000,4.8,29,'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80','Máy đạp đùi 45 độ chịu lực tới 600kg tạ đĩa. Đường ray con lăn công nghiệp ổ bi kép mượt mà tuyệt đối, an toàn tối đa cho bài tập chân đùi nặng.','DHZ Fusion Leg Press 45 độ là thiết bị không thể thiếu cho khu vực tập chân đùi heavy-duty.',true,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,brand=EXCLUDED.brand,category=EXCLUDED.category,model_number=EXCLUDED.model_number,price_range=EXCLUDED.price_range,vip_price=EXCLUDED.vip_price,estimated_price=EXCLUDED.estimated_price,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,thumbnail=EXCLUDED.thumbnail,excerpt=EXCLUDED.excerpt,full_description=EXCLUDED.full_description,is_featured=EXCLUDED.is_featured;

UPDATE public.equipments SET
  gallery = ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'],
  pros = ARRAY['Chốt chặn an toàn 3 nấc chống sập tạ tuyệt đối','Bàn đạp góc rộng cho phép đổi tư thế chân tác động đa nhóm cơ'],
  cons = ARRAY['Tốn diện tích mặt sàn phòng gym'],
  showroom_locations = ARRAY['Showroom Hà Nội - Hà Đông','Showroom TP.HCM - Tân Bình'],
  specifications = '{"weightCapacity":"Chịu tải 600 kg tạ đĩa","dimensions":"2200 x 1420 x 1500 mm","machineWeight":"245 kg","targetMuscles":["Cơ đùi trước (Quadriceps)","Cơ mông (Glutes)","Cơ đùi sau (Hamstrings)"],"warranty":"10 năm Khung thép, 3 năm Con lăn & Ổ bi"}'::jsonb
WHERE id = 'eq-2';

-- eq-3: Smith Machine Matrix Versa
INSERT INTO public.equipments (id, name, slug, brand, category, type, model_number, price_range, vip_price, estimated_price, rating, review_count, thumbnail, excerpt, full_description, is_featured, available_for_booking)
VALUES ('eq-3','Khung Gánh Tạ Đa Năng Smith Machine Matrix Versa','khung-ganh-ta-smith-machine-matrix-versa','Matrix Fitness','racks-benches','commercial','MX-V100','58.000.000đ - 65.000.000đ','52.000.000đ (Chiết khấu VIP 15%)',62000000,4.95,45,'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80','Hệ thống khung gánh Smith kết hợp xà đơn đa năng và giá treo tạ. Trục dẫn hướng nghiêng 7 độ chuẩn giải phẫu học giúp Squat & Bench Press tự nhiên nhất.','Matrix Versa Smith Machine sở hữu công nghệ trợ lực thanh gánh giúp giảm trọng lượng khởi điểm xuống chỉ còn 6.8kg.',true,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,brand=EXCLUDED.brand,category=EXCLUDED.category,model_number=EXCLUDED.model_number,price_range=EXCLUDED.price_range,vip_price=EXCLUDED.vip_price,estimated_price=EXCLUDED.estimated_price,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,thumbnail=EXCLUDED.thumbnail,excerpt=EXCLUDED.excerpt,full_description=EXCLUDED.full_description,is_featured=EXCLUDED.is_featured;

UPDATE public.equipments SET
  gallery = ARRAY['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'],
  pros = ARRAY['Góc nghiêng 7 độ chuẩn sinh học giảm áp lực lên cột sống','Tích hợp 6 sừng lưu trữ tạ đĩa gọn gàng'],
  cons = ARRAY['Mức giá cao thuộc phân khúc thương mại cao cấp'],
  showroom_locations = ARRAY['Showroom Hà Nội - Cầu Giấy','Showroom TP.HCM - Quận 1'],
  specifications = '{"weightCapacity":"400 kg","dimensions":"1980 x 1400 x 2250 mm","machineWeight":"190 kg","targetMuscles":["Squat đùi mông","Nằm đẩy ngực","Phát vai","Kéo xà đơn"],"warranty":"7 năm Khung, 2 năm Cơ cấu trượt"}'::jsonb
WHERE id = 'eq-3';

-- eq-4: Concept2 RowErg PM5
INSERT INTO public.equipments (id, name, slug, brand, category, type, model_number, price_range, vip_price, estimated_price, rating, review_count, thumbnail, excerpt, full_description, is_featured, available_for_booking)
VALUES ('eq-4','Máy Chèo Thuyền Thể Lực Concept2 RowErg PM5','may-cheo-thuyen-concept2-rowerg','Concept2 USA','cardio','commercial','RowErg-PM5','28.000.000đ - 32.000.000đ','25.500.000đ (Chiết khấu VIP 12%)',29500000,4.95,64,'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80','Tiêu chuẩn vàng thế giới cho tập luyện sức bền tim mạch và đốt mỡ toàn thân. Kháng lực gió tự nhiên cực kỳ mượt mà, đồng hồ PM5 đo thông số chuẩn thi đấu.','Concept2 RowErg được các vận động viên Olympic và phòng tập CrossFit toàn cầu tin dùng.',true,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,brand=EXCLUDED.brand,category=EXCLUDED.category,model_number=EXCLUDED.model_number,price_range=EXCLUDED.price_range,vip_price=EXCLUDED.vip_price,estimated_price=EXCLUDED.estimated_price,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,thumbnail=EXCLUDED.thumbnail,excerpt=EXCLUDED.excerpt,full_description=EXCLUDED.full_description,is_featured=EXCLUDED.is_featured;

UPDATE public.equipments SET
  gallery = ARRAY['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'],
  pros = ARRAY['Đốt calo khủng khiếp (lên đến 800 kcal/giờ)','Gập đôi cất gọn siêu tiện'],
  cons = ARRAY['Cần học đúng kỹ thuật chèo để tránh mỏi lưng dưới'],
  showroom_locations = ARRAY['Showroom Hà Nội - Cầu Giấy','Showroom TP.HCM - Quận 10'],
  specifications = '{"powerOutput":"Kháng lực quạt gió vô cấp","weightCapacity":"227 kg","dimensions":"2440 x 610 x 360 mm","machineWeight":"26 kg","targetMuscles":["Toàn thân (86% nhóm cơ)","Lưng xô","Đùi mông","Tim mạch VO2 Max"],"warranty":"5 năm Khung, 2 năm Màn hình PM5"}'::jsonb
WHERE id = 'eq-4';

-- eq-5: Impulse IT9530 Dual Pulley
INSERT INTO public.equipments (id, name, slug, brand, category, type, model_number, price_range, vip_price, estimated_price, rating, review_count, thumbnail, excerpt, full_description, is_featured, available_for_booking)
VALUES ('eq-5','Giàn Kéo Cáp Đa Năng Dual Adjustable Pulley Impulse IT9530','gian-keo-cap-da-nang-impulse-it9530','Impulse Fitness','strength','commercial','IT9530-Dual','68.000.000đ - 76.000.000đ','61.200.000đ (Chiết khấu VIP 15%)',72000000,4.9,52,'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80','Cỗ máy đa năng tối thượng cho phòng gym với 2 block tạ độc lập 91kg x 2. Puly xoay 180 độ điều chỉnh 36 nấc chiều cao, tập được hàng trăm bài cô lập cơ.','Impulse IT9530 cho phép tập ép ngực cáp, kéo tay trước sau, phát vai ngang, kéo xô quỳ, kickback mông cực kỳ linh hoạt.',true,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,brand=EXCLUDED.brand,category=EXCLUDED.category,model_number=EXCLUDED.model_number,price_range=EXCLUDED.price_range,vip_price=EXCLUDED.vip_price,estimated_price=EXCLUDED.estimated_price,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,thumbnail=EXCLUDED.thumbnail,excerpt=EXCLUDED.excerpt,full_description=EXCLUDED.full_description,is_featured=EXCLUDED.is_featured;

UPDATE public.equipments SET
  gallery = ARRAY['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'],
  pros = ARRAY['Độ êm mượt đỉnh cao, không bị giật cáp khi buông tạ','Tích hợp xà đơn đa góc bám'],
  cons = ARRAY['Trọng lượng rất nặng (345kg) cần mặt sàn chịu tải tốt'],
  showroom_locations = ARRAY['Showroom Hà Nội - Cầu Giấy','Showroom TP.HCM - Tân Bình'],
  specifications = '{"weightCapacity":"2 chồng tạ x 91 kg (Tổng 182 kg)","dimensions":"1680 x 1450 x 2280 mm","machineWeight":"345 kg","targetMuscles":["Ngực","Vai","Tay trước sau","Lưng xô","Cơ bụng"],"warranty":"10 năm Khung, 3 năm Dây cáp & Puly"}'::jsonb
WHERE id = 'eq-5';

-- eq-6: Cybex Hack Squat
INSERT INTO public.equipments (id, name, slug, brand, category, type, model_number, price_range, vip_price, estimated_price, rating, review_count, thumbnail, excerpt, full_description, is_featured, available_for_booking)
VALUES ('eq-6','Máy Đạp Đùi Ngược Hack Squat Plate-Loaded Cybex Eagle','may-dap-dui-nguoc-hack-squat-cybex','Cybex International','strength','commercial','Cybex-HS800','52.000.000đ - 59.000.000đ','46.800.000đ (Chiết khấu VIP 12%)',55000000,4.88,33,'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80','Máy Hack Squat góc nghiêng 35 độ cô lập tối đa cơ đùi trước (Quads). Đệm vai công thái học chống đau mỏi khi gánh tạ nặng trên 300kg.','Cybex Hack Squat giúp Gymer tập Squat sâu chạm đáy mà không gây áp lực lên lưng dưới như Squat tự do.',true,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,brand=EXCLUDED.brand,category=EXCLUDED.category,model_number=EXCLUDED.model_number,price_range=EXCLUDED.price_range,vip_price=EXCLUDED.vip_price,estimated_price=EXCLUDED.estimated_price,rating=EXCLUDED.rating,review_count=EXCLUDED.review_count,thumbnail=EXCLUDED.thumbnail,excerpt=EXCLUDED.excerpt,full_description=EXCLUDED.full_description,is_featured=EXCLUDED.is_featured;

UPDATE public.equipments SET
  gallery = ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80'],
  pros = ARRAY['Khoá chốt an toàn thao tác 1 chạm cực kỳ nhạy','Tập đùi trước bùng nổ mà không đau cột sống'],
  cons = ARRAY['Yêu cầu diện tích đặt máy rộng'],
  showroom_locations = ARRAY['Showroom TP.HCM - Quận 10','Showroom Đà Nẵng'],
  specifications = '{"weightCapacity":"Chịu tải 500 kg","dimensions":"2180 x 1500 x 1460 mm","machineWeight":"225 kg","targetMuscles":["Cơ đùi trước (Quads)","Cơ đùi sau","Cơ mông (Glutes)"],"warranty":"10 năm Khung, 3 năm Con lăn chịu lực"}'::jsonb
WHERE id = 'eq-6';

-- ============================================================
-- BƯỚC 3: SEED CATEGORIES
-- ============================================================
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
-- BƯỚC 4: SEED REVIEWS
-- ============================================================
INSERT INTO public.reviews (equipment_id, user_name, user_role, rating, title, comment, verified_booking)
VALUES
  ('eq-1', 'Nguyễn Văn Hùng', 'Chủ chuỗi Gym FitPlus (3 cơ sở)', 5, 'PT300H xứng đáng là máy chạy bền nhất!', 'Tôi đã sắm 8 con Impulse PT300H cho 2 chi nhánh ở Cầu Giấy và Hà Đông. Máy chạy êm ru, hội viên chạy ngày 16 tiếng không thấy hỏng vặt bao giờ.', true),
  ('eq-1', 'Phạm Thị Minh Tú', 'Huấn luyện viên Marathon', 5, 'Máy chạy tốt nhất tôi từng dùng', 'Sau 6 tháng tập marathon trên PT300H, tốc độ 5K của tôi giảm từ 28 xuống 23 phút. Thảm chạy êm, không cảm thấy đau khớp gối dù chạy 1 tiếng.', true),
  ('eq-2', 'Trần Hoàng Nam', 'HLV Cá Nhân (Personal Trainer)', 5, 'Leg Press DHZ đạp cực êm, chuẩn form', 'Con Leg Press DHZ Fusion này góc đạp 45 độ chuẩn đét, đệm lưng ôm sát cột sống nên khách hàng tớ đạp 300kg vẫn an toàn khớp gối.', true),
  ('eq-2', 'Lê Đức Anh', 'Chủ phòng gym Body Power', 4, 'Chất lượng xứng giá tiền', 'Mua 2 cái đặt ở 2 chi nhánh, khách dùng rất hài lòng. Con lăn êm, khóa an toàn hoạt động tốt. Chỉ tiếc là tốn quá nhiều diện tích.', true),
  ('eq-3', 'Ngô Thanh Bình', 'Powerlifter quốc gia', 5, 'Smith Machine hoàn hảo cho training', 'Góc nghiêng 7 độ y hệt squat tự do, xài 3 tháng chưa thấy lỏng chốt hay kẹt ray bao giờ. Đáng mua hơn nhiều so với các hãng Trung Quốc giá rẻ.', true),
  ('eq-4', 'Vũ Hoàng Long', 'CrossFit Coach', 5, 'Chuẩn Olympic, không cần bàn cãi', 'Concept2 là gold standard thế giới. Mua cho box CrossFit 30 người, dùng 2 năm không có vấn đề gì. Monitor PM5 chính xác, đồng bộ app ngon.', true),
  ('eq-4', 'Trịnh Lan Anh', 'Vận động viên Rowing', 5, 'Chèo thuyền trong nhà chuẩn thi đấu', 'Tôi dùng RowErg để duy trì sức bền mùa đông. Cảm giác cánh tay kéo hoàn toàn như chèo thuyền thật, rất hài lòng với PM5 monitor.', true),
  ('eq-5', 'Đinh Quốc Bảo', 'PT tại phòng gym cao cấp', 5, 'Giàn kéo cáp đa năng nhất thị trường', 'Một thiết bị thay thế được gần 10 bài tập cô lập. Puly xoay 180 độ không bị rơ, dây cáp sau 1 năm vẫn như mới. Đáng đầu tư!', true),
  ('eq-6', 'Hồ Văn Tuấn', 'Bodybuilder chuyên nghiệp', 5, 'Hack Squat tốt nhất cho cơ đùi trước', 'Dùng được 8 tháng, cơ đùi trước phát triển rõ rệt. Góc nghiêng 35 độ chuẩn, bàn đạp rộng thoải mái đặt chân đa vị trí.', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- BƯỚC 5: SEED SHOWROOMS (chỉ insert nếu bảng trống)
-- ============================================================
INSERT INTO public.showrooms (name, address, phone, hours, machines, rating, brands, image, tags, is_open)
SELECT name, address, phone, hours, machines::int, rating::numeric, brands::jsonb, image, tags::jsonb, is_open::boolean
FROM (VALUES
  ('GymGear Showroom Hà Nội - Cầu Giấy','12 Trần Thái Tông, Cầu Giấy, Hà Nội','024 3789 1234','T2-T7: 8:00-21:00 | CN: 9:00-18:00','45','4.8','["Impulse","Matrix","Technogym"]','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80','["Thương mại","Home Gym","Máy Cardio"]','true'),
  ('GymGear Showroom TP.HCM - Bình Thạnh','290 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM','028 3895 6789','T2-T7: 8:00-21:00 | CN: 9:00-18:00','60','4.9','["DHZ","Panatta","BH Fitness"]','https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80','["Thương mại","Máy Sức Mạnh","Khung Gánh"]','true'),
  ('GymGear Showroom Đà Nẵng','45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng','0236 3892 345','T2-T6: 8:30-20:00 | T7-CN: 9:00-17:00','30','4.7','["Life Fitness","Matrix","Impulse"]','https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80','["Thương mại","Máy Cardio","Đa Năng"]','false'),
  ('GymGear Showroom TP.HCM - Quận 7','168 Nguyễn Thị Thập, Tân Phú, Quận 7, TP.HCM','028 5412 3698','T2-T7: 8:00-22:00 | CN: 9:00-18:00','50','4.8','["Technogym","Cybex","Precor"]','https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=80','["VIP Cao Cấp","Thương mại","Cardio","Sức Mạnh"]','true'),
  ('GymGear Showroom Hà Nội - Long Biên','58 Ngô Gia Tự, Long Biên, Hà Nội','024 3762 9087','T2-T7: 8:00-20:00 | CN: Đóng cửa','35','4.6','["DHZ","Impulse","BH Fitness"]','https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80','["Home Gym","Tiết Kiệm","Máy Sức Mạnh"]','true')
) AS v(name, address, phone, hours, machines, rating, brands, image, tags, is_open)
WHERE NOT EXISTS (SELECT 1 FROM public.showrooms LIMIT 1);

-- ============================================================
-- KIỂM TRA KẾT QUẢ
-- ============================================================
SELECT 'equipments' AS table_name, COUNT(*) AS row_count FROM public.equipments
UNION ALL
SELECT 'categories', COUNT(*) FROM public.categories
UNION ALL
SELECT 'showrooms', COUNT(*) FROM public.showrooms
UNION ALL
SELECT 'reviews', COUNT(*) FROM public.reviews;
