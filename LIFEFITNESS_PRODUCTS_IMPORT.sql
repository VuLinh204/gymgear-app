-- Run in Supabase SQL Editor to add a small, source-linked Life Fitness catalog
-- starter set. Prices and GymGear showroom availability are intentionally left
-- as unconfirmed because the manufacturer does not publish local Vietnam quotes.

ALTER TABLE public.equipments
  ADD COLUMN IF NOT EXISTS source_url TEXT;

INSERT INTO public.equipments (
  id, name, slug, brand, category, type, model_number, price_range,
  estimated_price, rating, review_count, thumbnail, gallery, excerpt,
  full_description, specifications, pros, cons, is_featured,
  available_for_booking, showroom_locations, source_url
) VALUES
(
  'lf-universal-cable',
  'Life Fitness Universal Cable',
  'life-fitness-universal-cable',
  'Life Fitness', 'strength', 'commercial', 'Universal Cable',
  'Liên hệ báo giá', 0, 0, 0,
  'https://www.lifefitness.com/Kentico13CoreBase/media/LFMedia/LifeFitnessImages/Equipment/Strength/Cable%20Motion/Universal/Universal-cable-arms-down.png?ext=.png',
  ARRAY['https://www.lifefitness.com/Kentico13CoreBase/media/LFMedia/LifeFitnessImages/Equipment/Strength/Cable%20Motion/Universal/Universal-cable-arms-down.png?ext=.png']::text[],
  'Giàn cáp thương mại hai tay điều chỉnh độc lập, thiết kế gọn và hỗ trợ nhiều bài tập toàn thân.',
  'Máy tập cáp đa năng của Life Fitness với hai tay cáp xoay độc lập, phù hợp cho khu tập chức năng và studio PT. Tỷ lệ cáp 3:1; thông số kích thước thay đổi theo cấu hình. Giá và tình trạng có hàng tại Việt Nam cần GymGear xác nhận.',
  '{"weightCapacity":"2 x 153.75 kg stack","dimensions":"Tối thiểu 105 x 175 x 181 cm; tối đa 177 x 264 x 228 cm","machineWeight":"537.5 kg","targetMuscles":["Toàn thân","Ngực","Lưng","Tay","Core"],"resistanceType":"Cáp đôi, tỷ lệ 3:1","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Hai tay cáp điều chỉnh độc lập','Phạm vi chuyển động rộng cho nhiều bài tập','Hỗ trợ không gian tập chức năng']::text[],
  ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/cable-machines-functional-trainers/universal-cable'
),
(
  'lf-atmos-treadmill',
  'Life Fitness Atmos Treadmill',
  'life-fitness-atmos-treadmill',
  'Life Fitness', 'cardio', 'commercial', 'Atmos Treadmill',
  'Liên hệ báo giá', 0, 0, 0,
  'https://support.lifefitness.com/hc/article_attachments/40685422876055',
  ARRAY['https://support.lifefitness.com/hc/article_attachments/40685422876055']::text[],
  'Máy chạy bộ thương mại có thiết kế gọn cho phòng gym khách sạn và khu căn hộ; có tùy chọn console SL hoặc SE4 16 inch.',
  'Atmos là máy chạy bộ thương mại hướng tới phòng tập có diện tích hạn chế. Hãng công bố tốc độ tối đa 19 km/h, độ dốc 0–15%, mặt chạy 56 x 152 cm và hệ thống giảm chấn FlexDeck. Giá và tình trạng có hàng tại Việt Nam cần GymGear xác nhận.',
  '{"powerOutput":"4 HP AC continuous duty (8 HP peak)","weightCapacity":"Người dùng tối đa 181 kg","dimensions":"208.3 x 81 x 155 cm (SL) hoặc 208.3 x 81 x 156 cm (SE4)","machineWeight":"168 kg","targetMuscles":["Tim mạch","Chân"],"resistanceType":"Tốc độ 0–19 km/h; dốc 0–15%","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Có hai lựa chọn console SL và SE4 16 inch','Mặt chạy 56 x 152 cm','Thiết kế hướng đến phòng tập khách sạn và căn hộ']::text[],
  ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/cardio/treadmills/atmos-treadmill'
),
(
  'lf-synrgy-system',
  'Life Fitness SYNRGY Training System',
  'life-fitness-synrgy',
  'Life Fitness', 'strength', 'commercial', 'SYNRGY (tùy cấu hình)',
  'Liên hệ báo giá', 0, 0, 0,
  'https://www.lifefitness.cl/cdn/shop/products/Synrgy-lifefitness.jpg?v=1706553227&width=3840',
  ARRAY['https://www.lifefitness.cl/cdn/shop/products/Synrgy-lifefitness.jpg?v=1706553227&width=3840']::text[],
  'Hệ thống tập luyện mô-đun, kết hợp các trạm tập và tùy chọn lưu trữ phụ kiện cho khu tập nhóm hoặc functional training.',
  'SYNRGY là hệ thống thiết bị có thể cấu hình theo mặt bằng và nhu cầu sử dụng. Hãng nêu các lựa chọn như khung cáp, trạm tập chức năng, khu tập Olympic và giải pháp lưu trữ. Kích thước, cấu hình, giá và tình trạng có hàng cần được xác nhận theo báo giá cụ thể.',
  '{"weightCapacity":"Theo cấu hình","dimensions":"Theo cấu hình; xác nhận với nhà phân phối","machineWeight":"Theo cấu hình","targetMuscles":["Toàn thân"],"resistanceType":"Cấu hình trạm tập tùy chọn","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Có thể cấu hình theo mặt bằng','Kết hợp nhiều khu vực tập và lưu trữ phụ kiện','Hướng đến tập nhóm và tập chức năng']::text[],
  ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/cable-machines-functional-trainers/synrgy'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  model_number = EXCLUDED.model_number,
  price_range = EXCLUDED.price_range,
  estimated_price = EXCLUDED.estimated_price,
  thumbnail = EXCLUDED.thumbnail,
  gallery = EXCLUDED.gallery,
  excerpt = EXCLUDED.excerpt,
  full_description = EXCLUDED.full_description,
  specifications = EXCLUDED.specifications,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  is_featured = EXCLUDED.is_featured,
  source_url = EXCLUDED.source_url;

-- Additional verified Hammer Strength products. The local placeholder is used
-- because a stable official image URL was not verified during this import.
INSERT INTO public.equipments (
  id, name, slug, brand, category, type, model_number, price_range,
  estimated_price, rating, review_count, thumbnail, gallery, excerpt,
  full_description, specifications, pros, cons, is_featured,
  available_for_booking, showroom_locations, source_url
) VALUES
(
  'hs-reverse-v-squat', 'Hammer Strength Reverse V-Squat', 'hammer-strength-reverse-v-squat',
  'Hammer Strength', 'strength', 'commercial', 'PL-RVSQ',
  'Liên hệ báo giá', 0, 0, 0, '/equipment-placeholder.svg', ARRAY['/equipment-placeholder.svg']::text[],
  'Máy squat plate-loaded hỗ trợ hai tư thế squat, có bàn đặt chân điều chỉnh và chốt dây kháng lực.',
  'Thông tin và thông số dựa trên trang sản phẩm Hammer Strength. Kích thước tiêu chuẩn 249 x 122 x 163 cm; trọng lượng máy 268 kg; tải tối đa 400 kg mỗi tay đòn và mức kháng lực khởi đầu 34 kg mỗi tay đòn. Giá và tình trạng tại Việt Nam cần xác nhận với nhà phân phối.',
  '{"weightCapacity":"Tải tối đa 400 kg mỗi tay đòn","dimensions":"249 x 122 x 163 cm; 305 x 122 x 163 cm khi lắp bàn mở rộng tùy chọn","machineWeight":"268 kg","targetMuscles":["Chân","Mông"],"resistanceType":"Plate-loaded; mức kháng lực khởi đầu 34 kg mỗi tay đòn","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Tập được hai biến thể squat theo thông tin nhà sản xuất','Bàn chân điều chỉnh và chốt dây kháng lực kép','Có bàn mở rộng tùy chọn']::text[],
  ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/reverse-v-squat'
),
(
  'hs-iso-lateral-tbar-row', 'Hammer Strength Iso-Lateral T-Bar Row', 'hammer-strength-iso-lateral-t-bar-row',
  'Hammer Strength', 'strength', 'commercial', 'IL-TBR',
  'Liên hệ báo giá', 0, 0, 0, '/equipment-placeholder.svg', ARRAY['/equipment-placeholder.svg']::text[],
  'Máy row plate-loaded có tựa ngực, tay đòn chuyển động độc lập, tay nắm nhiều vị trí và hai vị trí đặt bánh tạ.',
  'Thông tin và thông số dựa trên trang sản phẩm Hammer Strength. Kích thước 177 x 152 x 99 cm; trọng lượng máy 108 kg; tải tối đa 100 kg mỗi tay đòn và mức kháng lực khởi đầu 10 kg mỗi tay đòn. Giá và tình trạng tại Việt Nam cần xác nhận với nhà phân phối.',
  '{"weightCapacity":"Tải tối đa 100 kg mỗi tay đòn","dimensions":"177 x 152 x 99 cm","machineWeight":"108 kg","targetMuscles":["Lưng","Tay trước"],"resistanceType":"Plate-loaded; mức kháng lực khởi đầu 10 kg mỗi tay đòn","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Tay đòn hai bên chuyển động độc lập','Tựa ngực và tay nắm nhiều vị trí','Hai vị trí đặt tải cho từng tay đòn']::text[],
  ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/iso-lateral-t-bar-row'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  model_number = EXCLUDED.model_number,
  price_range = EXCLUDED.price_range,
  estimated_price = EXCLUDED.estimated_price,
  thumbnail = EXCLUDED.thumbnail,
  gallery = EXCLUDED.gallery,
  excerpt = EXCLUDED.excerpt,
  full_description = EXCLUDED.full_description,
  specifications = EXCLUDED.specifications,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  is_featured = EXCLUDED.is_featured,
  available_for_booking = EXCLUDED.available_for_booking,
  showroom_locations = EXCLUDED.showroom_locations,
  source_url = EXCLUDED.source_url;

-- Ten more catalog entries. Specs and image URLs below are from the linked
-- Life Fitness / Hammer Strength product or shop pages.
INSERT INTO public.equipments (
  id, name, slug, brand, category, type, model_number, price_range,
  estimated_price, rating, review_count, thumbnail, gallery, excerpt,
  full_description, specifications, pros, cons, is_featured,
  available_for_booking, showroom_locations, source_url
) VALUES
(
  'hs-plate-loaded-gripper', 'Hammer Strength Plate Loaded Gripper', 'hammer-strength-plate-loaded-gripper',
  'Hammer Strength', 'strength', 'commercial', 'PL-GRIP', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/hammer-strength-plate-loadedgripperbase-charcoal-black-1000x1000.jpg?v=1748945171&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/hammer-strength-plate-loadedgripperbase-charcoal-black-1000x1000.jpg?v=1748945171&width=1000']::text[],
  'Máy tập lực nắm với nhiều góc cầm, hỗ trợ tập cẳng tay và bàn tay.',
  'Thông tin theo trang Hammer Strength: khung thấp, ghế nghiêng về phía trước và nhiều vị trí cầm cho tư thế úp hoặc ngửa. Giá, bảo hành và tình trạng tại Việt Nam cần xác nhận với nhà phân phối.',
  '{"weightCapacity":"Tối đa 4 x 20 kg bánh tạ","dimensions":"119 x 74 x 86 cm","machineWeight":"30 kg","targetMuscles":["Cẳng tay","Bàn tay"],"resistanceType":"Plate-loaded; kháng lực khởi đầu 6.3 kg","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Nhiều góc cầm úp và ngửa','Thiết kế khung thấp','Có ghế nghiêng hỗ trợ tư thế']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/plate-loaded-gripper'
),
(
  'hs-plate-loaded-tbar-row', 'Hammer Strength T-Bar Row', 'hammer-strength-t-bar-row',
  'Hammer Strength', 'strength', 'commercial', 'T-Bar Row', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/HammerStrength-PlateLoaded-T-BarRow_PL-TBR-01_9__mr.jpg?v=1748945103&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/HammerStrength-PlateLoaded-T-BarRow_PL-TBR-01_9__mr.jpg?v=1748945103&width=1000']::text[],
  'Máy row tư thế đứng, tay nắm nhiều vị trí và điểm đặt tải kép.',
  'Thông tin theo trang Hammer Strength: thiết kế không tựa ngực để tập kéo ở tư thế đứng; các điểm đặt tải cho phép lựa chọn vị trí kháng lực. Giá và tình trạng tại Việt Nam cần xác nhận.',
  '{"weightCapacity":"Tối đa 5 x 20 kg bánh tạ tại trục trước","dimensions":"210 x 82 x 53 cm","machineWeight":"91 kg","targetMuscles":["Lưng","Tay trước","Core"],"resistanceType":"Plate-loaded; nhiều vị trí đặt tải","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Tay nắm nhiều vị trí','Bàn đặt chân chống trượt','Hai vị trí đặt tải']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/hammer-strength-plate-loaded-t-bar-row'
),
(
  'hs-ground-base-jammer', 'Hammer Strength Ground Base Jammer', 'hammer-strength-ground-base-jammer',
  'Hammer Strength', 'strength', 'commercial', 'GB-J', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/outlet-hammer-strength-ground-base-jammer-charcoal-1000x1000.jpg?v=1748945097&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/outlet-hammer-strength-ground-base-jammer-charcoal-1000x1000.jpg?v=1748945097&width=1000']::text[],
  'Máy đẩy plate-loaded với tay đòn hội tụ và phân kỳ, thiết kế cho bài tập sức mạnh bùng nổ.',
  'Thông tin theo trang Hammer Strength: tay đòn chuyển động hội tụ/phân kỳ, tay cầm công thái học và chốt gắn dây kháng lực. Tải tối đa theo hãng là 4 bánh 20 kg mỗi tay đòn; giá và tồn kho tại Việt Nam cần xác nhận.',
  '{"weightCapacity":"Tối đa 4 x 20 kg mỗi tay đòn","dimensions":"167 x 202 x 212 cm","machineWeight":"168 kg","targetMuscles":["Ngực","Vai","Tay","Core","Chân"],"resistanceType":"Plate-loaded; kháng lực khởi đầu 3.6 kg mỗi tay đòn","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Tay đòn hội tụ và phân kỳ','Tay cầm công thái học','Có chốt dây kháng lực']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/ground-base-jammer'
),
(
  'hs-linear-leg-press', 'Hammer Strength Plate Loaded Linear Leg Press', 'hammer-strength-linear-leg-press',
  'Hammer Strength', 'strength', 'commercial', 'HSLLP', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/plate-loaded-linear-leg-press-charcoalframe-blackuph_1000x1000_5c4d5373-804c-4c7c-9f66-9abcfbde43b8.jpg?v=1748945307&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/plate-loaded-linear-leg-press-charcoalframe-blackuph_1000x1000_5c4d5373-804c-4c7c-9f66-9abcfbde43b8.jpg?v=1748945307&width=1000']::text[],
  'Máy leg press góc 45 độ với thanh dẫn tuyến tính và bệ chân lớn.',
  'Thông tin theo trang Hammer Strength: hệ dẫn hướng dùng ổ bi kín, tựa lưng điều chỉnh và bệ chân chống trượt. Tải tối đa được hãng nêu là 10 bánh 20 kg trên mỗi trục; giá và điều kiện bán tại Việt Nam cần xác nhận.',
  '{"weightCapacity":"Tải tối đa 816 kg tổng theo mức hãng công bố","dimensions":"241 x 165 x 145 cm","machineWeight":"286 kg","targetMuscles":["Đùi trước","Đùi sau","Mông","Bắp chân"],"resistanceType":"Plate-loaded, chuyển động tuyến tính góc 45 độ; kháng lực khởi đầu 53 kg","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Bệ chân lớn chống trượt','Tựa lưng có thể điều chỉnh','Thanh dẫn với ổ bi kín']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/plate-loaded-linear-leg-press'
),
(
  'lf-insignia-row', 'Life Fitness Insignia Series Row', 'life-fitness-insignia-series-row',
  'Life Fitness', 'strength', 'commercial', 'SS-RW', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/LFInsignia-Row-charcoal-black.jpg?v=1759863395&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/LFInsignia-Row-charcoal-black.jpg?v=1759863395&width=1000']::text[],
  'Máy row selectorized với chuyển động tay độc lập theo hướng phân kỳ.',
  'Thông tin theo trang Life Fitness: máy row Insignia có chuyển động phân kỳ độc lập; hãng công bố mức stack tiêu chuẩn hoặc stack nặng tùy cấu hình. Giá, cấu hình và bảo hành tại Việt Nam cần báo giá xác nhận.',
  '{"weightCapacity":"Stack tiêu chuẩn 130 kg hoặc stack nặng 152 kg","dimensions":"124 x 141 x 148 cm","machineWeight":"296 kg","targetMuscles":["Lưng","Tay trước"],"resistanceType":"Selectorized; tay đòn chuyển động phân kỳ độc lập","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Chuyển động tay độc lập','Có tùy chọn stack tiêu chuẩn hoặc nặng','Thiết kế thuộc dòng Insignia']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/selectorized/insignia-series-row'
),
(
  'lf-smith-machine', 'Life Fitness Smith Machine', 'life-fitness-smith-machine',
  'Life Fitness', 'strength', 'commercial', 'SSM', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/outlet-signature-series-smith-charcoal-1000x1000.jpg?v=1748945161&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/outlet-signature-series-smith-charcoal-1000x1000.jpg?v=1748945161&width=1000']::text[],
  'Máy Smith với góc thanh dẫn 7 độ, phù hợp các bài đẩy và squat có thanh dẫn hướng.',
  'Thông tin theo trang Life Fitness: thanh đi theo góc 7 độ. Hãng công bố tải tập tối đa 285 kg, trọng lượng thanh 9 kg và các mức bảo hành giới hạn theo từng bộ phận; điều kiện bảo hành Việt Nam cần xác nhận với nhà phân phối.',
  '{"weightCapacity":"Tải tập tối đa 285 kg; thanh 9 kg","dimensions":"221 x 125 x 236 cm","machineWeight":"264 kg","targetMuscles":["Ngực","Vai","Tay","Chân"],"resistanceType":"Thanh dẫn góc 7 độ","warranty":"Theo hãng: khung 10 năm; puly, tạ và ty dẫn 5 năm; các bộ phận khác theo điều khoản. Xác nhận áp dụng tại Việt Nam."}'::jsonb,
  ARRAY['Thanh dẫn theo góc 7 độ','Có thể tập bài đẩy và squat','Tích hợp chốt đặt thanh']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/benches/life-fitness-smith-machine'
),
(
  'lf-dual-adjustable-pulley-stabilization', 'Life Fitness Dual Adjustable Pulley with Stabilization', 'life-fitness-dual-adjustable-pulley-stabilization',
  'Life Fitness', 'strength', 'commercial', 'DAP Stabilization', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/products/life-fitness-dual-adjustable-pulley-charcoal-1000x1000.jpg?v=1760455162&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/products/life-fitness-dual-adjustable-pulley-charcoal-1000x1000.jpg?v=1760455162&width=1000']::text[],
  'Giàn cáp điều chỉnh kép, có đệm ổn định hỗ trợ một số bài tập đứng hoặc đẩy.',
  'Thông tin theo trang Life Fitness: mỗi bên có stack 182 kg, 22 nấc điều chỉnh carriage và tỷ lệ cáp 4:1. Kích thước và cân nặng theo hãng; giá, cấu hình cuối cùng và tình trạng tại Việt Nam cần xác nhận.',
  '{"weightCapacity":"Stack 182 kg mỗi bên; kháng lực hiệu dụng 2.5–100.5 lb mỗi bên theo hãng","dimensions":"114 x 158 x 240 cm","machineWeight":"590 kg","targetMuscles":["Toàn thân","Ngực","Lưng","Tay","Core"],"resistanceType":"Cáp đôi, tỷ lệ 4:1; 22 nấc điều chỉnh mỗi bên","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['22 nấc điều chỉnh mỗi bên','Có đệm ổn định điều chỉnh','Hỗ trợ nhiều bài tập cáp']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/cable-machines-functional-trainers/dual-adjustable-pulley-with-stabilization'
),
(
  'lf-atmos-elliptical', 'Life Fitness Atmos Elliptical', 'life-fitness-atmos-elliptical',
  'Life Fitness', 'cardio', 'commercial', 'Atmos Elliptical', 'Liên hệ báo giá', 0, 0, 0,
  'https://shop.lifefitness.com/cdn/shop/files/Atmos_CrossTrainer_SE4_927f4f3a-206f-4403-ae19-b8e4b415ea91.webp?v=1789486959&width=1000', ARRAY['https://shop.lifefitness.com/cdn/shop/files/Atmos_CrossTrainer_SE4_927f4f3a-206f-4403-ae19-b8e4b415ea91.webp?v=1789486959&width=1000']::text[],
  'Máy elliptical thương mại nhỏ gọn với chuyển động low-impact và tùy chọn console SL hoặc SE4.',
  'Thông tin theo trang Life Fitness: thiết kế nhắm tới phòng tập khách sạn và căn hộ; kích thước tổng thể 208 x 77.9 x 169.16 cm và sải chân hoạt động 211.4 cm. Cân nặng, giá và tình trạng tại Việt Nam cần xác nhận theo cấu hình/báo giá.',
  '{"weightCapacity":"Chưa công bố trong thông số tham khảo","dimensions":"208 x 77.9 x 169.16 cm; sải chân 211.4 cm","machineWeight":"Chưa công bố trong thông số tham khảo","targetMuscles":["Tim mạch","Chân","Toàn thân"],"resistanceType":"Chuyển động elliptical low-impact; console SL hoặc SE4 16 inch","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Chuyển động low-impact','Có tùy chọn console SL hoặc SE4','Thiết kế gọn cho phòng gym khách sạn/căn hộ']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/cardio/ellipticals/atmos-elliptical'
),
(
  'lf-axiom-biceps-triceps', 'Life Fitness Axiom Series Biceps / Triceps', 'life-fitness-axiom-biceps-triceps',
  'Life Fitness', 'strength', 'commercial', 'OP-BT', 'Liên hệ báo giá', 0, 0, 0,
  'https://www.lifefitness.com/Kentico13CoreBase/media/LFMedia/LifeFitnessImages/MediaSync/209-223-op-bt-12-1-2020.png', ARRAY['https://www.lifefitness.com/Kentico13CoreBase/media/LFMedia/LifeFitnessImages/MediaSync/209-223-op-bt-12-1-2020.png']::text[],
  'Trạm selectorized hai chức năng cho biceps curl và triceps extension.',
  'Thông tin theo trang Life Fitness: đối trọng hỗ trợ mức khởi đầu thấp, tay nắm tự căn chỉnh, ghế và đệm tay nghiêng, cùng điểm tựa chân cho bài triceps. Hãng công bố stack 85.25 kg và tải người dùng tối đa 136 kg.',
  '{"weightCapacity":"Người dùng tối đa 136 kg; stack 85.25 kg","dimensions":"124 x 109 x 135 cm","machineWeight":"205 kg","targetMuscles":["Biceps","Triceps"],"resistanceType":"Selectorized hai chức năng","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Một trạm cho biceps và triceps','Tay nắm tự căn chỉnh','Có điểm tựa chân khi tập triceps']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/strength-training/selectorized/axiom-series-biceps-triceps'
),
(
  'lf-integrity-plus-treadmill', 'Life Fitness Integrity+ Treadmill', 'life-fitness-integrity-plus-treadmill',
  'Life Fitness', 'cardio', 'commercial', 'Integrity+', 'Liên hệ báo giá', 0, 0, 0,
  'https://support.lifefitness.com/hc/article_attachments/29330431788567', ARRAY['https://support.lifefitness.com/hc/article_attachments/29330431788567']::text[],
  'Máy chạy bộ thương mại có hệ giảm chấn FlexDeck và tùy chọn console SL hoặc SE4.',
  'Thông tin theo trang Life Fitness: tốc độ 0.8–23 km/h, độ dốc tối đa 15%, mặt chạy 56 x 152 cm và động cơ AC 4 HP (8 HP peak). Console, yêu cầu nguồn điện, giá và cấu hình bán tại Việt Nam cần được xác nhận.',
  '{"powerOutput":"4 HP AC (8 HP peak)","weightCapacity":"Người dùng tối đa khoảng 181 kg theo mức 400 lb hãng công bố","dimensions":"209 x 92 x 142 cm","machineWeight":"197 kg","targetMuscles":["Tim mạch","Chân"],"resistanceType":"Tốc độ 0.8–23 km/h; độ dốc 0–15%; mặt chạy 56 x 152 cm","warranty":"Liên hệ nhà phân phối tại Việt Nam"}'::jsonb,
  ARRAY['Hệ giảm chấn FlexDeck','Console SL hoặc SE4 16/24 inch tùy cấu hình','Dải tốc độ và độ dốc điều chỉnh']::text[], ARRAY[]::text[], true, false, ARRAY[]::text[],
  'https://www.lifefitness.com/en-us/catalog/cardio/treadmills/integrity-plus'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  model_number = EXCLUDED.model_number,
  price_range = EXCLUDED.price_range,
  estimated_price = EXCLUDED.estimated_price,
  thumbnail = EXCLUDED.thumbnail,
  gallery = EXCLUDED.gallery,
  excerpt = EXCLUDED.excerpt,
  full_description = EXCLUDED.full_description,
  specifications = EXCLUDED.specifications,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  is_featured = EXCLUDED.is_featured,
  available_for_booking = EXCLUDED.available_for_booking,
  showroom_locations = EXCLUDED.showroom_locations,
  source_url = EXCLUDED.source_url;
