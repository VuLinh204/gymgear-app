import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc trực tiếp .env.local
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) envVars[k.trim()] = v.join('=').trim();
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://htwsrvixpvauhhngxzso.supabase.co';
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Không tìm thấy Supabase Key trong .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ========================================================
// 1. DANH SÁCH 6 SẢN PHẨM LIFE FITNESS ĐỈNH CAO
// ========================================================
const LIFE_FITNESS_EQUIPMENTS = [
  {
    id: 'eq-lf-1',
    name: 'Máy Chạy Bộ Thông Minh Flagship Life Fitness Symbio Runner™',
    slug: 'may-chay-bo-life-fitness-symbio-runner',
    brand: 'Life Fitness USA',
    brand_logo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100&auto=format&fit=crop&q=80',
    category: 'cardio',
    type: 'commercial',
    model_number: 'Symbio-Runner-2026',
    price_range: '185.000.000đ - 215.000.000đ',
    vip_price: '168.000.000đ (Chiết khấu VIP 15%)',
    estimated_price: 195000000,
    rating: 5.0,
    review_count: 42,
    thumbnail: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Siêu phẩm máy chạy bộ cardio thông minh thế hệ mới từ Life Fitness. Màn hình cảm ứng 24 inch, công nghệ đệm hấp thụ lực thích ứng sinh học và ánh sáng thông minh Smart Lighting.',
    full_description: 'Life Fitness Symbio Runner™ định nghĩa lại trải nghiệm chạy bộ thương mại đỉnh cao toàn cầu. Sự kết hợp hoàn mỹ giữa cơ sinh học chính xác, bề mặt chạy FlexDeck® tự điều chỉnh độ đàn hồi theo sải chân, và màn hình đa phương tiện 24-inch 4K tương tác ảo. Động cơ công nghiệp 4.5 HP AC siêu êm ái, hoạt động bền bỉ 24/7 tại các resort 5 sao và phòng gym hạng sang.',
    is_featured: true,
    available_for_booking: true,
    showroom_locations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 10', 'Showroom Đà Nẵng'],
    pros: [
      'Màn hình cảm ứng 24-inch 4K tích hợp streaming và cung đường thực tế ảo',
      'Hệ thống đệm thích ứng sinh học giảm chấn động đến 35% cho khớp gối',
      'Khung hợp kim nhôm đúc nguyên khối siêu chịu lực, tải trọng lên đến 205kg'
    ],
    cons: [
      'Phân khúc siêu cao cấp dành cho phòng gym thương mại hạng sang và biệt thự tư nhân'
    ],
    specifications: {
      powerOutput: '4.5 HP AC Continuous Duty (Đạt đỉnh 7.0 HP)',
      weightCapacity: '205 kg',
      dimensions: '2180 x 950 x 1620 mm',
      machineWeight: '235 kg',
      targetMuscles: ['Tim mạch sức bền', 'Cơ đùi trước & sau', 'Cơ bắp chân', 'Đốt mỡ toàn thân'],
      resistanceType: 'Độ dốc điện tử -3% đến +15%',
      warranty: '10 năm Khung & Động cơ, 3 năm Bảng điều khiển cảm ứng'
    }
  },
  {
    id: 'eq-lf-2',
    name: 'Máy Chạy Bộ Thương Mại Life Fitness Integrity+ Series (Discover SE4)',
    slug: 'may-chay-bo-life-fitness-integrity-plus',
    brand: 'Life Fitness USA',
    brand_logo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100&auto=format&fit=crop&q=80',
    category: 'cardio',
    type: 'commercial',
    model_number: 'Integrity-SE4',
    price_range: '125.000.000đ - 145.000.000đ',
    vip_price: '115.000.000đ (Chiết khấu VIP 12%)',
    estimated_price: 135000000,
    rating: 4.95,
    review_count: 58,
    thumbnail: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Cỗ máy chạy bộ "nồi đồng cối đá" huyền thoại của mọi phòng gym lớn trên thế giới. Tích hợp màn hình Discover SE4 24 inch 1080p, đệm FlexDeck® độc quyền bảo vệ khớp gối.',
    full_description: 'Life Fitness Integrity+ Series là biểu tượng của độ bền và hiệu suất hoạt động liên tục trong ngành thể hình quốc tế. Hệ thống giảm chấn FlexDeck Shock Absorption System đã được cấp bằng sáng chế giúp giảm tới 30% áp lực phản chấn lên khớp gối và mắt cá chân. Màn hình Discover SE4 kết nối Internet không dây, hỗ trợ quản trị thiết bị từ xa qua nền tảng đám mây Halo Facility.',
    is_featured: true,
    available_for_booking: true,
    showroom_locations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Tân Bình'],
    pros: [
      'Hệ thống đệm giảm chấn FlexDeck độc quyền chống thoái hóa khớp',
      'Động cơ AC 4.0 HP MagnaDrive siêu bền bỉ hoạt động 20 tiếng/ngày',
      'Bảng điều khiển Discover SE4 kết nối Bluetooth, Apple Watch, Samsung Galaxy Watch'
    ],
    cons: [
      'Cần nguồn điện tiếp đất chuyên dụng cho thiết bị công suất cao'
    ],
    specifications: {
      powerOutput: '4.0 HP AC MagnaDrive™ Motor',
      weightCapacity: '181 kg',
      dimensions: '2090 x 920 x 1420 mm',
      machineWeight: '197 kg',
      targetMuscles: ['Sức bền tim mạch', 'Cơ đùi', 'Cơ mông', 'Cơ bụng'],
      warranty: '7 năm Khung & Motor, 2 năm Màn hình Discover SE4'
    }
  },
  {
    id: 'eq-lf-3',
    name: 'Máy Đẩy Ngực Tạ Khối Life Fitness Insignia Series Chest Press',
    slug: 'may-day-nguc-life-fitness-insignia-chest-press',
    brand: 'Life Fitness USA',
    brand_logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=80',
    category: 'strength',
    type: 'commercial',
    model_number: 'Insignia-SS-CP',
    price_range: '88.000.000đ - 98.000.000đ',
    vip_price: '79.000.000đ (Chiết khấu VIP 15%)',
    estimated_price: 92000000,
    rating: 4.95,
    review_count: 36,
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Dòng máy đẩy ngực tạ khối cao cấp nhất với quỹ đạo đẩy hội tụ độc lập (Converging Motion). Giúp ép sâu lồng ngực mà không gây kẹt khớp vai, tích hợp bộ đếm rep điện tử.',
    full_description: 'Life Fitness Insignia Series Chest Press mang lại trải nghiệm phát triển cơ ngực hoàn hảo nhờ quỹ đạo chuyển động hội tụ mô phỏng chính xác sự co thắt tự nhiên của sợi cơ ngực lớn (Pectoralis Major). Hệ thống trợ lực đệm hơi Gas-Spring giúp người tập tùy chỉnh độ cao ghế ngồi êm ái chỉ với 1 tay. Chồng tạ khối đúc chính xác lên tới 130kg vận hành mượt mà không gây tiếng ồn.',
    is_featured: true,
    available_for_booking: true,
    showroom_locations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 10'],
    pros: [
      'Quỹ đạo chuyển động hội tụ độc lập tự nhiên, cô lập toàn diện ngực trong và ngực giữa',
      'Tích hợp màn hình điện tử đếm số lần lặp (Reps) và thời gian nghỉ giữa hiệp',
      'Tay nắm đa vị trí cho phép đẩy ngực ngang và ngực dốc linh hoạt'
    ],
    cons: [
      'Trọng lượng máy đầm chắc (285kg) cần xe đẩy chuyên dụng khi lắp đặt'
    ],
    specifications: {
      weightCapacity: 'Chồng tạ khối 130 kg (Tùy chọn nâng cấp 150 kg)',
      dimensions: '1450 x 1440 x 1880 mm',
      machineWeight: '285 kg',
      targetMuscles: ['Cơ ngực lớn (Pectoralis Major)', 'Cơ vai trước (Anterior Deltoid)', 'Cơ tay sau (Triceps)'],
      resistanceType: 'Tạ khối Selectorized với chốt ghim từ tính thông minh',
      warranty: '10 năm Khung thép, 3 năm Dây cáp chịu lực 1.2 tấn & Puly'
    }
  },
  {
    id: 'eq-lf-4',
    name: 'Máy Đẩy Ngực Dốc Tạ Đĩa Hammer Strength by Life Fitness ISO-Lateral Super Incline Press',
    slug: 'hammer-strength-iso-lateral-super-incline-press',
    brand: 'Hammer Strength by Life Fitness',
    brand_logo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=100&auto=format&fit=crop&q=80',
    category: 'strength',
    type: 'commercial',
    model_number: 'IL-SIP-Hammer',
    price_range: '75.000.000đ - 85.000.000đ',
    vip_price: '68.000.000đ (Chiết khấu VIP 12%)',
    estimated_price: 79000000,
    rating: 5.0,
    review_count: 73,
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Huyền thoại thể hình thế giới dành cho bài tập ngực trên. Công nghệ ISO-Lateral chuyển động độc lập từng tay, tải trọng khủng 300kg cho vận động viên chuyên nghiệp.',
    full_description: 'Hammer Strength là thương hiệu số 1 thế giới về máy tập tạ đĩa (Plate-Loaded), thuộc sở hữu của Life Fitness. Mẫu ISO-Lateral Super Incline Press tập trung kích hoạt tối đa sợi cơ ngực trên (Clavicular Head) và vai trước. Nhờ thiết kế 2 tay đòn chuyển động độc lập, máy giúp triệt tiêu hoàn toàn tình trạng lệch cơ ngực trái - phải. Khung thép hộp 11-gauge siêu dày chịu tải trọng đĩa tạ lên tới 300kg.',
    is_featured: true,
    available_for_booking: true,
    showroom_locations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 10', 'Showroom Đà Nẵng'],
    pros: [
      'Công nghệ ISO-Lateral chuyển động độc lập chống lệch ngực 100%',
      'Góc đẩy 30 độ công thái học cô lập hoàn hảo cơ ngực trên sát xương quai xanh',
      'Độ bền gần như vĩnh cửu theo tiêu chuẩn phòng tập Olympic'
    ],
    cons: [
      'Cần trang bị thêm tạ đĩa phi 50mm lỗ Olympic'
    ],
    specifications: {
      weightCapacity: 'Chịu tải 300 kg tạ đĩa Olympic',
      dimensions: '1350 x 1400 x 1750 mm',
      machineWeight: '175 kg',
      targetMuscles: ['Cơ ngực trên (Upper Chest)', 'Cơ vai trước', 'Cơ tam đầu tay sau'],
      resistanceType: 'Plate-Loaded (Tạ đĩa Olympic 50mm)',
      warranty: '15 năm Khung thép, Trọn đời Ổ bi con lăn công nghiệp'
    }
  },
  {
    id: 'eq-lf-5',
    name: 'Giàn Kéo Cáp Đôi Đa Năng Life Fitness Signature Series Dual Adjustable Pulley (DAP)',
    slug: 'gian-keo-cap-doi-life-fitness-signature-dap',
    brand: 'Life Fitness USA',
    brand_logo: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=100&auto=format&fit=crop&q=80',
    category: 'strength',
    type: 'commercial',
    model_number: 'CMDAP-Signature',
    price_range: '135.000.000đ - 155.000.000đ',
    vip_price: '124.000.000đ (Chiết khấu VIP 15%)',
    estimated_price: 142000000,
    rating: 4.98,
    review_count: 61,
    thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Giàn cáp đôi đa năng tiêu chuẩn vàng của ngành fitness. Tỷ lệ kháng lực cáp 4:1 cho phép tập bùng nổ tốc độ cao, 2 cột tạ 175kg mỗi bên, xà đơn đa góc bám.',
    full_description: 'Life Fitness Signature Series Dual Adjustable Pulley (DAP) là cỗ máy tập luyện chức năng (Functional Training) toàn diện nhất. Hệ thống puly xoay 360 độ điều chỉnh linh hoạt theo từng nấc chiều cao, phục vụ từ các bài tập phục hồi chức năng thể thao, bài tập phát triển cơ bắp bodybuilding đến các bài bứt tốc bùng nổ năng lượng cho cầu thủ và VĐV điền kinh.',
    is_featured: true,
    available_for_booking: true,
    showroom_locations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 10'],
    pros: [
      'Tỷ lệ cáp 4:1 tạo chuyển động siêu mượt và cho phép thực hiện bài tập tốc độ cao',
      '2 block tạ 175kg mỗi bên (Tổng trọng lượng tạ 350kg) đáp ứng mọi cấp độ sức mạnh',
      'Tích hợp tay xà đơn đa góc bám và giá đỡ phụ kiện tay nắm tiện lợi'
    ],
    cons: [
      'Chiều cao máy 2300mm yêu cầu trần phòng gym tối thiểu 2.6m'
    ],
    specifications: {
      weightCapacity: '2 chồng tạ x 175 kg (Tổng 350 kg)',
      dimensions: '1720 x 1500 x 2300 mm',
      machineWeight: '415 kg',
      targetMuscles: ['Toàn bộ nhóm cơ trên cơ thể (Hơn 100 bài tập biến thể)'],
      resistanceType: 'Cáp thép bọc nhựa Nylon tiêu chuẩn hàng không vũ trụ',
      warranty: '10 năm Khung, 3 năm Dây cáp & Puly xoay'
    }
  },
  {
    id: 'eq-lf-6',
    name: 'Máy Móc Đùi Sau Ngồi Life Fitness Insignia Series Seated Leg Curl',
    slug: 'may-moc-dui-sau-life-fitness-insignia-leg-curl',
    brand: 'Life Fitness USA',
    brand_logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&auto=format&fit=crop&q=80',
    category: 'strength',
    type: 'commercial',
    model_number: 'Insignia-SLC-2026',
    price_range: '82.000.000đ - 92.000.000đ',
    vip_price: '74.000.000đ (Chiết khấu VIP 15%)',
    estimated_price: 86000000,
    rating: 4.9,
    review_count: 28,
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Máy móc đùi sau tư thế ngồi chuẩn giải phẫu cơ học. Đệm tự điều chỉnh theo sải chân, góc tựa lưng nghiêng hỗ trợ gân khoeo co rút tối đa mà không gây đau lưng dưới.',
    full_description: 'Life Fitness Insignia Seated Leg Curl giúp cô lập trọn vẹn nhóm cơ đùi sau (Hamstrings) một cách an toàn và chuẩn xác nhất. Góc tựa lưng nghiêng 100 độ mở rộng cơ gân khoeo để đạt biên độ chuyển động lớn nhất. Con lăn đệm bắp chân tự động điều chỉnh theo độ dài chân người tập mà không cần thao tác gài chốt phức tạp.',
    is_featured: false,
    available_for_booking: true,
    showroom_locations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Tân Bình', 'Showroom Đà Nẵng'],
    pros: [
      'Cơ chế tự căn chỉnh con lăn đệm bắp chân ôm sát cổ chân tự nhiên',
      'Đai giữ đùi trên đệm mút dày chống nảy người khi kéo mức tạ nặng',
      'Tích hợp bộ đếm Reps và thời gian nghỉ thông minh'
    ],
    cons: [
      'Dành riêng cho bài tập đùi sau ngồi'
    ],
    specifications: {
      weightCapacity: 'Chồng tạ khối 115 kg',
      dimensions: '1550 x 1120 x 1480 mm',
      machineWeight: '240 kg',
      targetMuscles: ['Cơ đùi sau (Hamstrings: Biceps Femoris, Semitendinosus)', 'Cơ bắp chân'],
      resistanceType: 'Tạ khối Selectorized với chốt ghim từ tính thông minh',
      warranty: '10 năm Khung, 3 năm Dây cáp chịu lực'
    }
  }
];

// ========================================================
// 2. DANH SÁCH 4 BÀI VIẾT (ARTICLES) CHUYÊN MÔN LIFE FITNESS
// ========================================================
const LIFE_FITNESS_ARTICLES = [
  {
    id: `post-lf-1`,
    content: `📐 TIÊU CHUẨN THIẾT KẾ & BỐ TRÍ MẶT SÀN PHÒNG GYM THƯƠNG MẠI THEO CHUẨN LIFE FITNESS TOÀN CẦU\n\nMột phòng gym thành công không chỉ nằm ở số lượng máy tập, mà nằm ở trải nghiệm dòng chảy di chuyển (Gym Floor Flow) của hội viên:\n\n1. Quy tắc phân vùng 40-40-20:\n- 40% diện tích cho khu vực Cardio (hướng về phía có ánh sáng tự nhiên hoặc cửa kính lớn).\n- 40% diện tích cho khu vực Kháng lực: Chia tách rõ ràng giữa máy tạ khối (Selectorized) cho người mới và khu tạ đĩa/tự do (Plate-Loaded/Free Weights) cho gymer hardcore.\n- 20% diện tích cho Functional Training, giãn cơ và lối đi thông thoáng tối thiểu 1.2m.\n\n2. Khoảng cách an toàn giữa các thiết bị:\n- Giữa 2 máy chạy bộ cần khoảng hở tối thiểu 40cm, phía sau đuôi máy chạy cần vùng thoát hiểm an toàn 1.5m.\n\n👉 Hãy đến ngay Showroom GymGear để được chuyên gia tư vấn thiết kế 3D layout phòng gym miễn phí!`,
    rating: 5.0,
    likesCount: 142,
    commentsCount: 28,
    sharesCount: 35,
    isPinned: true,
    taggedEquipmentId: 'eq-lf-1'
  },
  {
    id: `post-lf-2`,
    content: `💥 CƠ SINH HỌC TRONG HUẤN LUYỆN KHÁNG LỰC: VÌ SAO HAMMER STRENGTH ISO-LATERAL LÀ SỰ LỰA CHỌN SỐ 1 CỦA CÁC VĐV OLYMPIC?\n\nBạn có biết hầu hết 90% gymer đều bị lệch cơ ngực hoặc vai mà không hề hay biết?\n\nKhi đẩy tạ đòn thẳng thông thường, tay thuận sẽ tự động bù lực cho tay yếu hơn, khiến tình trạng lệch cơ ngày càng trầm trọng. Công nghệ ISO-Lateral độc quyền được Gary Jones phát minh cùng Life Fitness đã giải quyết triệt để vấn đề này:\n\n✅ 2 Cánh tay đòn chuyển động độc lập: Bắt buộc ngực trái và ngực phải phải sinh công lực bằng nhau 100%.\n✅ Quỹ đạo hội tụ tự nhiên (Converging Arc): Không đi thẳng mà khép nhẹ dần về đỉnh chuyển động, trùng khớp hoàn toàn với hướng đi của sợi cơ ngực lớn.\n✅ Cảm giác mượt mà cơ khí: Không bị giật khựng ở điểm đổi chiều tạ, bảo vệ khớp vai tuyệt đối.\n\nTrải nghiệm ngay siêu phẩm Hammer Strength ISO-Lateral Super Incline Press tại Showroom GymGear ngay hôm nay!`,
    rating: 5.0,
    likesCount: 215,
    commentsCount: 43,
    sharesCount: 62,
    isPinned: true,
    taggedEquipmentId: 'eq-lf-4'
  },
  {
    id: `post-lf-3`,
    content: `🛡️ CÔNG NGHỆ GIẢM CHẤN FLEXDECK® SHOCK ABSORPTION TRÊN LIFE FITNESS INTEGRITY+: BẢO VỆ KHỚP GỐI ĐẾN 30%\n\nChạy bộ là phương pháp cardio đốt mỡ tuyệt vời, nhưng chạy trên bề mặt cứng hoặc máy chạy bộ rẻ tiền tạo áp lực phản chấn gấp 3-5 lần trọng lượng cơ thể lên sụn chêm khớp gối.\n\nHệ thống đệm giảm chấn FlexDeck® của Life Fitness sử dụng các đệm đàn hồi cao su tổng hợp Lifespring™ mật độ cao độc quyền:\n\n🔹 Giảm tới 30% lực xung kích truyền lên mắt cá chân, đầu gối và cột sống so với chạy trên đường nhựa.\n🔹 Độ đàn hồi đồng đều trên toàn bộ chiều dài thảm chạy 152cm.\n🔹 Độ bền thử nghiệm vượt mốc 5 triệu bước chạy mà không bị xẹp lún.\n\nĐầu tư cho thiết bị Life Fitness chính là đầu tư cho sức khỏe bền vững dài lâu của hội viên phòng tập!`,
    rating: 4.9,
    likesCount: 98,
    commentsCount: 19,
    sharesCount: 24,
    isPinned: false,
    taggedEquipmentId: 'eq-lf-2'
  },
  {
    id: `post-lf-4`,
    content: `⚙️ CHECKLIST QUY TRÌNH BẢO DƯỠNG ĐỊNH KỲ CHO PHÒNG GYM THƯƠNG MẠI CHUẨN LIFE FITNESS\n\nĐể máy tập luôn vận hành trơn tru và kéo dài tuổi thọ lên tới 15 - 20 năm, các chủ phòng gym cần tuân thủ lịch bảo trì sau:\n\n📅 HÀNG NGÀY:\n- Vệ sinh mồ hôi trên da bọc ghế và tay cầm bằng dung dịch chuyên dụng không chứa cồn ăn mòn.\n- Kiểm tra tình trạng dây an toàn trên máy chạy bộ.\n\n📅 HÀNG TUẦN:\n- Kiểm tra độ căng và độ cân của băng tải máy chạy bộ.\n- Thử nghiệm độ nhạy của chốt từ tính trên các máy tạ khối Insignia.\n\n📅 HÀNG THÁNG:\n- Tra dầu bôi trơn chuyên dụng (100% Silicone) cho bề mặt ván chạy.\n- Kiểm tra độ mòn của dây cáp thép bọc nylon trên giàn Dual Adjustable Pulley (DAP).\n\nGymGear cung cấp gói bảo trì định kỳ chính hãng trọn đời cho toàn bộ khách hàng đặt mua thiết bị tại hệ thống!`,
    rating: 4.95,
    likesCount: 167,
    commentsCount: 31,
    sharesCount: 48,
    isPinned: false,
    taggedEquipmentId: 'eq-lf-5'
  }
];

// ========================================================
// 3. TÀI LIỆU KHO TRI THỨC AI (KIẾN THỨC VỀ BOOKING & LIFE FITNESS)
// ========================================================
const AI_BOOKING_KNOWLEDGE_DOCS = [
  {
    id: 'doc-booking-full-policy',
    title: 'Chính sách & Quy trình Đặt lịch Trải nghiệm Showroom (Booking Guide)',
    category: 'policy',
    keywords: ['dat lich', 'booking', 'trai nghiem', 'showroom', 'tap thu', 'quy trinh', 'lich hen'],
    content: `Quy trình và đặc quyền khi khách hàng Đặt lịch trải nghiệm máy tập tại Showroom GymGear:
1. ĐẶC QUYỀN KHÁCH HÀNG:
- Trải nghiệm thực tế hoàn toàn MIỄN PHÍ 100% trên các dòng máy cao cấp nhất như Life Fitness Symbio, Integrity+, Hammer Strength, Impulse PT300H,...
- Chuyên viên kỹ thuật và Huấn luyện viên (PT) 1-1 đồng hành phân tích cơ sinh học, hướng dẫn sử dụng và tư vấn setup phòng tập.
- Miễn phí đo chỉ số cơ - mỡ InBody chuyên sâu và tư vấn dinh dưỡng tại chỗ.
- Đầy đủ tiện ích 5 sao: Nước khoáng đóng chai, khăn tập vô trùng, phòng tắm nóng lạnh, bãi đỗ xe ô tô và xe máy rộng rãi miễn phí.

2. CÁCH THỨC ĐẶT LỊCH:
- Khách hàng có thể đặt lịch trực tiếp qua Chatbot AI GymGear, qua website hoặc hotline 0988.234.567.
- Chỉ cần cung cấp: Họ tên, Số điện thoại, Showroom mong muốn, Ngày giờ và Dòng máy muốn trải nghiệm.
- Hệ thống sẽ cấp ngay Mã Lịch Hẹn dạng "BK-xxxxx" và gửi tin nhắn xác nhận.

3. CHÍNH SÁCH ĐỔI / HỦY LỊCH:
- Khách hàng có thể đổi hoặc hủy lịch hẹn hoàn toàn miễn phí bất cứ lúc nào, vui lòng báo trước ít nhất 2 giờ qua bot hoặc hotline để nhân viên chuẩn bị máy.`
  },
  {
    id: 'doc-showroom-locations-hours',
    title: 'Địa chỉ & Giờ mở cửa Hệ thống Showroom GymGear Toàn Quốc',
    category: 'custom',
    keywords: ['dia chi', 'showroom', 'ha noi', 'ho chi minh', 'hcm', 'da nang', 'gio mo cua', 'o dau'],
    content: `Thông tin địa chỉ và giờ đón tiếp khách hàng của các Showroom GymGear:
1. SHOWROOM HÀ NỘI:
- Địa chỉ: Tầng 1-2, Tòa nhà GymGear Tower, Số 68 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội.
- Hotline: 024.3999.8888 / 0988.234.567.
- Giờ mở cửa: 08:00 - 21:00 (Từ Thứ 2 đến Chủ Nhật, mở cửa cả ngày lễ).
- Thiết bị sẵn sàng lái thử: Life Fitness Symbio Runner, Life Fitness Integrity+, Hammer Strength Super Incline Press, Impulse PT300H, Concept2 RowErg, Dual Cable DAP.

2. SHOWROOM TP. HỒ CHÍ MINH (CHI NHÁNH 1 - TRUNG TÂM):
- Địa chỉ: Số 120 Đường 3 Tháng 2, Phường 12, Quận 10, TP. Hồ Chí Minh.
- Hotline: 028.3888.9999 / 0977.345.678.
- Giờ mở cửa: 08:00 - 21:30 (Tất cả các ngày trong tuần).

3. SHOWROOM TP. HỒ CHÍ MINH (CHI NHÁNH 2 - TÂN BÌNH):
- Địa chỉ: Số 45 Đường Hoàng Hoa Thám, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh.
- Giờ mở cửa: 08:30 - 20:30.

4. SHOWROOM ĐÀ NẴNG:
- Địa chỉ: Số 86 Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng.
- Hotline: 0236.3777.666.
- Giờ mở cửa: 08:30 - 20:30.`
  },
  {
    id: 'doc-lifefitness-brand-overview',
    title: 'Tổng quan Thương hiệu Life Fitness & Hammer Strength USA',
    category: 'equipment',
    keywords: ['life fitness', 'hammer strength', 'thuong hieu', 'xuat xu', 'my', 'usa', 'symbio', 'insignia'],
    content: `Life Fitness là tập đoàn sản xuất thiết bị thể dục thương mại số 1 thế giới có trụ sở tại Rosemont, Illinois, Hoa Kỳ với hơn 55 năm lịch sử.
Các dòng sản phẩm nổi bật của Life Fitness được GymGear phân phối chính hãng:
1. Dòng Cardio Cao Cấp:
- Symbio Series: Dòng máy chạy bộ và đạp xe thông minh đa giác quan cao cấp nhất thế giới hiện nay.
- Integrity+ Series: Máy chạy bộ thương mại bền bỉ hàng đầu với màn hình cảm ứng Discover SE4 24 inch.
2. Dòng Kháng Lực Tạ Khối (Selectorized):
- Insignia Series: Quỹ đạo đẩy hội tụ/phân kỳ tự nhiên, đệm hơi Gas-Spring, bộ đếm rep điện tử.
3. Dòng Tạ Đĩa Chuyên Nghiệp (Plate-Loaded):
- Hammer Strength: Tiêu chuẩn vàng cho các vận động viên thể thao và phòng tập thể hình chuyên nghiệp trên toàn thế giới với công nghệ ISO-Lateral chuyển động độc lập từng tay.`
  }
];

async function seedData() {
  console.log('🚀 Bắt đầu nạp dữ liệu Life Fitness & Booking Knowledge vào Supabase...');

  // 1. NẠP EQUIPMENTS
  console.log('📦 1/3. Đang cập nhật 6 thiết bị Life Fitness...');
  for (const eq of LIFE_FITNESS_EQUIPMENTS) {
    const { error } = await supabase.from('equipments').upsert({
      id: eq.id,
      name: eq.name,
      slug: eq.slug,
      brand: eq.brand,
      brand_logo: eq.brand_logo,
      category: eq.category,
      type: eq.type,
      model_number: eq.model_number,
      price_range: eq.price_range,
      vip_price: eq.vip_price,
      estimated_price: eq.estimated_price,
      rating: eq.rating,
      review_count: eq.review_count,
      thumbnail: eq.thumbnail,
      gallery: eq.gallery,
      excerpt: eq.excerpt,
      full_description: eq.full_description,
      is_featured: eq.is_featured,
      available_for_booking: eq.available_for_booking,
      showroom_locations: eq.showroom_locations,
      pros: eq.pros,
      cons: eq.cons,
      specifications: eq.specifications
    }, { onConflict: 'id' });

    if (error) {
      console.warn(`Lỗi khi nạp ${eq.id}:`, error.message);
    } else {
      console.log(`✅ Đã nạp thiết bị: ${eq.name}`);
    }
  }

  // 2. NẠP ARTICLES VÀO POSTS
  console.log('📰 2/3. Đang nạp 4 Articles Life Fitness vào bảng posts...');
  for (const art of LIFE_FITNESS_ARTICLES) {
    const { error } = await supabase.from('posts').upsert({
      id: art.id,
      content: art.content,
      rating: art.rating,
      likes_count: art.likesCount,
      comments_count: art.commentsCount,
      shares_count: art.sharesCount,
      is_pinned: art.isPinned,
      equipment_id: art.taggedEquipmentId,
      author_id: 'a0000000-0000-0000-0000-000000000001' // ID Admin mặc định
    }, { onConflict: 'id' });

    if (error) {
      console.warn(`Lỗi nạp bài viết ${art.id}:`, error.message);
    } else {
      console.log(`✅ Đã nạp bài viết: ${art.id}`);
    }
  }

  // 3. NẠP KNOWLEDGE DOCS
  console.log('🧠 3/3. Đang nạp tài liệu Kho tri thức AI về Life Fitness & Booking...');
  for (const doc of AI_BOOKING_KNOWLEDGE_DOCS) {
    const { error } = await supabase.from('ai_knowledge_docs').upsert({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      keywords: doc.keywords,
      content: doc.content,
      author_name: 'Life Fitness & GymGear Expert',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (error) {
      console.warn(`Lỗi nạp doc ${doc.id}:`, error.message);
    } else {
      console.log(`✅ Đã nạp kho tri thức: ${doc.title}`);
    }
  }

  console.log('🎉 TOÀN BỘ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ THÀNH CÔNG VÀO SUPABASE!');
}

seedData().catch(console.error);
