import { Equipment, CategoryType, SocialPost } from '@/types';

export const CATEGORIES: { id: CategoryType; name: string; description: string; iconName: string }[] = [
  { id: 'all', name: 'Tất cả bài viết', description: 'Toàn bộ bài review & chia sẻ kinh nghiệm máy tập', iconName: 'Grid' },
  { id: 'cardio', name: 'Máy Cardio', description: 'Máy chạy bộ, xe đạp trượt tuyết, máy chèo thuyền', iconName: 'Activity' },
  { id: 'strength', name: 'Máy Sức Mạnh', description: 'Máy ép ngực, kéo xô, leg press, đạp đùi chuyên sâu', iconName: 'Dumbbell' },
  { id: 'home-gym', name: 'Thiết Bị Home Gym', description: 'Khung gánh đa năng, máy tập tổng hợp gia đình', iconName: 'Home' },
  { id: 'racks-benches', name: 'Khung Gánh & Ghế', description: 'Power rack, Smith machine, ghế tập bụng & tạ', iconName: 'Layers' },
  { id: 'accessories', name: 'Phụ Kiện Gym', description: 'Tạ đơn, tạ đĩa, thảm cao su chuyên dụng', iconName: 'Disc' },
];

export const MOCK_EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Máy Chạy Bộ Thương Mại Impulse PT300H',
    slug: 'may-chay-bo-impulse-pt300h',
    brand: 'Impulse Fitness',
    brandLogo: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=100&auto=format&fit=crop&q=80',
    category: 'cardio',
    type: 'commercial',
    modelNumber: 'PT300H-2026',
    priceRange: '42.000.000đ - 48.000.000đ',
    vipPrice: '38.500.000đ (Chiết khấu VIP 15%)',
    estimatedPrice: 45000000,
    rating: 4.9,
    reviewCount: 38,
    thumbnail: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Dòng máy chạy bộ công suất khủng 4.0 HP AC chuyên dùng cho các phòng Gym thương mại mở 24/7. Thảm chạy siêu rộng, hệ thống giảm chấn kép tối ưu cho khớp gối.',
    fullDescription: 'Impulse PT300H là "vua bền bỉ" trong phân khúc máy chạy bộ phòng gym thương mại tại Việt Nam. Khung thép sơn tĩnh điện chống gỉ sét, động cơ AC 4.0 HP liên tục cho phép hoạt động liên tục 18 tiếng/ngày mà không nóng máy.',
    specifications: {
      powerOutput: '4.0 HP AC (Peak 6.0 HP)',
      weightCapacity: '180 kg',
      dimensions: '2140 x 930 x 1480 mm',
      machineWeight: '210 kg',
      targetMuscles: ['Tim mạch', 'Cơ đùi', 'Cơ bắp chân', 'Giảm mỡ toàn thân'],
      warranty: '5 năm Động cơ & Khung, 2 năm Linh kiện điện tử'
    },
    pros: [
      'Động cơ AC 4.0HP cực kỳ êm ái và siêu bền',
      'Băng tải rộng 56cm thoải mái bứt tốc sprint',
      'Hệ thống giảm chấn PuraCushion bảo vệ khớp gối'
    ],
    cons: [
      'Trọng lượng máy nặng (210kg), khó di chuyển đơn lẻ'
    ],
    isFeatured: true,
    availableForBooking: true,
    showroomLocations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 10', 'Showroom Đà Nẵng']
  },
  {
    id: 'eq-2',
    name: 'Máy Đạp Đùi Nghiêng Leg Press 45 Độ DHZ Fusion',
    slug: 'may-dap-dui-nghieng-leg-press-dhz-fusion',
    brand: 'DHZ Fitness',
    category: 'strength',
    type: 'commercial',
    modelNumber: 'DHZ-E3056',
    priceRange: '36.000.000đ - 41.000.000đ',
    vipPrice: '32.900.000đ (Chiết khấu VIP 12%)',
    estimatedPrice: 38500000,
    rating: 4.8,
    reviewCount: 29,
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Máy đạp đùi 45 độ chịu lực tới 600kg tạ đĩa. Đường ray con lăn công nghiệp ổ bi kép mượt mà tuyệt đối, an toàn tối đa cho bài tập chân đùi nặng.',
    fullDescription: 'DHZ Fusion Leg Press 45 độ là thiết bị không thể thiếu cho khu vực tập chân đùi heavy-duty. Thiết kế tựa lưng điều chỉnh 4 góc độ, bàn đạp đùi bọc cao su chống trượt cỡ lớn giúp người tập linh hoạt tác động vào cơ đùi trước, đùi sau hoặc cơ mông.',
    specifications: {
      weightCapacity: 'Chịu tải 600 kg tạ đĩa',
      dimensions: '2200 x 1420 x 1500 mm',
      machineWeight: '245 kg',
      targetMuscles: ['Cơ đùi trước (Quadriceps)', 'Cơ mông (Glutes)', 'Cơ đùi sau (Hamstrings)'],
      warranty: '10 năm Khung thép, 3 năm Con lăn & Ổ bi'
    },
    pros: [
      'Chốt chặn an toàn 3 nấc chống sập tạ tuyệt đối',
      'Bàn đạp góc rộng cho phép đổi tư thế chân tác động đa nhóm cơ'
    ],
    cons: [
      'Tốn diện tích mặt sàn phòng gym'
    ],
    isFeatured: true,
    availableForBooking: true,
    showroomLocations: ['Showroom Hà Nội - Hà Đông', 'Showroom TP.HCM - Tân Bình']
  },
  {
    id: 'eq-3',
    name: 'Khung Gánh Tạ Đa Năng Smith Machine Matrix Versa',
    slug: 'khung-ganh-ta-smith-machine-matrix-versa',
    brand: 'Matrix Fitness',
    category: 'racks-benches',
    type: 'commercial',
    modelNumber: 'MX-V100',
    priceRange: '58.000.000đ - 65.000.000đ',
    vipPrice: '52.000.000đ (Chiết khấu VIP 15%)',
    estimatedPrice: 62000000,
    rating: 4.95,
    reviewCount: 45,
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Hệ thống khung gánh Smith kết hợp xà đơn đa năng và giá treo tạ. Trục dẫn hướng nghiêng 7 độ chuẩn giải phẫu học giúp Squat & Bench Press tự nhiên nhất.',
    fullDescription: 'Matrix Versa Smith Machine sở hữu công nghệ trợ lực thanh gánh giúp giảm trọng lượng khởi điểm xuống chỉ còn 6.8kg, phù hợp cho cả nữ giới tập luyện kỹ thuật lẫn nam giới tập tạ nặng.',
    specifications: {
      weightCapacity: '400 kg',
      dimensions: '1980 x 1400 x 2250 mm',
      machineWeight: '190 kg',
      targetMuscles: ['Squat đùi mông', 'Nằm đẩy ngực', 'Phát vai', 'Kéo xà đơn'],
      warranty: '7 năm Khung, 2 năm Cơ cấu trượt'
    },
    pros: [
      'Góc nghiêng 7 độ chuẩn sinh học giảm áp lực lên cột sống',
      'Tích hợp 6 sừng lưu trữ tạ đĩa gọn gàng'
    ],
    cons: [
      'Mức giá cao thuộc phân khúc thương mại cao cấp'
    ],
    isFeatured: true,
    availableForBooking: true,
    showroomLocations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 1']
  },
  {
    id: 'eq-4',
    name: 'Máy Chèo Thuyền Thể Lực Concept2 RowErg PM5',
    slug: 'may-cheo-thuyen-concept2-rowerg',
    brand: 'Concept2 USA',
    category: 'cardio',
    type: 'commercial',
    modelNumber: 'RowErg-PM5',
    priceRange: '28.000.000đ - 32.000.000đ',
    vipPrice: '25.500.000đ (Chiết khấu VIP 12%)',
    estimatedPrice: 29500000,
    rating: 4.95,
    reviewCount: 64,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Tiêu chuẩn vàng thế giới cho tập luyện sức bền tim mạch và đốt mỡ toàn thân. Kháng lực gió tự nhiên cực kỳ mượt mà, đồng hồ PM5 đo thông số chuẩn thi đấu.',
    fullDescription: 'Concept2 RowErg được các vận động viên Olympic và phòng tập CrossFit toàn cầu tin dùng. Vận hành bằng sức cản của bánh đà không khí, kiểm soát tải lực theo tốc độ kéo của người tập.',
    specifications: {
      powerOutput: 'Kháng lực quạt gió vô cấp',
      weightCapacity: '227 kg',
      dimensions: '2440 x 610 x 360 mm',
      machineWeight: '26 kg',
      targetMuscles: ['Toàn thân (86% nhóm cơ)', 'Lưng xô', 'Đùi mông', 'Tim mạch VO2 Max'],
      warranty: '5 năm Khung, 2 năm Màn hình PM5'
    },
    pros: ['Đốt calo khủng khiếp (lên đến 800 kcal/giờ)', 'Gập đôi cất gọn siêu tiện'],
    cons: ['Cần học đúng kỹ thuật chèo để tránh mỏi lưng dưới'],
    isFeatured: true,
    availableForBooking: true,
    showroomLocations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Quận 10']
  },
  {
    id: 'eq-5',
    name: 'Giàn Kéo Cáp Đa Năng Dual Adjustable Pulley Impulse IT9530',
    slug: 'gian-keo-cap-da-nang-impulse-it9530',
    brand: 'Impulse Fitness',
    category: 'strength',
    type: 'commercial',
    modelNumber: 'IT9530-Dual',
    priceRange: '68.000.000đ - 76.000.000đ',
    vipPrice: '61.200.000đ (Chiết khấu VIP 15%)',
    estimatedPrice: 72000000,
    rating: 4.9,
    reviewCount: 52,
    thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Cỗ máy đa năng tối thượng cho phòng gym với 2 block tạ độc lập 91kg x 2. Puly xoay 180 độ điều chỉnh 36 nấc chiều cao, tập được hàng trăm bài cô lập cơ.',
    fullDescription: 'Impulse IT9530 cho phép tập ép ngực cáp, kéo tay trước sau, phát vai ngang, kéo xô quỳ, kickback mông cực kỳ linh hoạt. Dây cáp chịu lực chuẩn quân đội hàng không bọc nylon chống mài mòn.',
    specifications: {
      weightCapacity: '2 chồng tạ x 91 kg (Tổng 182 kg)',
      dimensions: '1680 x 1450 x 2280 mm',
      machineWeight: '345 kg',
      targetMuscles: ['Ngực', 'Vai', 'Tay trước sau', 'Lưng xô', 'Cơ bụng'],
      warranty: '10 năm Khung, 3 năm Dây cáp & Puly'
    },
    pros: ['Độ êm mượt đỉnh cao, không bị giật cáp khi buông tạ', 'Tích hợp xà đơn đa góc bám'],
    cons: ['Trọng lượng rất nặng (345kg) cần mặt sàn chịu tải tốt'],
    isFeatured: true,
    availableForBooking: true,
    showroomLocations: ['Showroom Hà Nội - Cầu Giấy', 'Showroom TP.HCM - Tân Bình']
  },
  {
    id: 'eq-6',
    name: 'Máy Đạp Đùi Ngược Hack Squat Plate-Loaded Cybex Eagle',
    slug: 'may-dap-dui-nguoc-hack-squat-cybex',
    brand: 'Cybex International',
    category: 'strength',
    type: 'commercial',
    modelNumber: 'Cybex-HS800',
    priceRange: '52.000.000đ - 59.000.000đ',
    vipPrice: '46.800.000đ (Chiết khấu VIP 12%)',
    estimatedPrice: 55000000,
    rating: 4.88,
    reviewCount: 33,
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80'
    ],
    excerpt: 'Máy Hack Squat góc nghiêng 35 độ cô lập tối đa cơ đùi trước (Quads). Đệm vai công thái học chống đau mỏi khi gánh tạ nặng trên 300kg.',
    fullDescription: 'Cybex Hack Squat giúp Gymer tập Squat sâu chạm đáy mà không gây áp lực lên lưng dưới như Squat tự do. Bàn đạp hợp kim nhôm đúc vân kim cương chống trượt tuyệt đối.',
    specifications: {
      weightCapacity: 'Chịu tải 500 kg',
      dimensions: '2180 x 1500 x 1460 mm',
      machineWeight: '225 kg',
      targetMuscles: ['Cơ đùi trước (Quads)', 'Cơ đùi sau', 'Cơ mông (Glutes)'],
      warranty: '10 năm Khung, 3 năm Con lăn chịu lực'
    },
    pros: ['Khoá chốt an toàn thao tác 1 chạm cực kỳ nhạy', 'Tập đùi trước bùng nổ mà không đau cột sống'],
    cons: ['Yêu cầu diện tích đặt máy rộng'],
    isFeatured: true,
    availableForBooking: true,
    showroomLocations: ['Showroom TP.HCM - Quận 10', 'Showroom Đà Nẵng']
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    userName: 'Nguyễn Văn Hùng',
    userRole: 'Chủ chuỗi Gym FitPlus (3 cơ sở)',
    rating: 5,
    date: '15/07/2026',
    title: 'PT300H xứng đáng là máy chạy bền nhất!',
    comment: 'Tôi đã sắm 8 con Impulse PT300H cho 2 chi nhánh ở Cầu Giấy và Hà Đông. Máy chạy êm ru, hội viên chạy ngày 16 tiếng không thấy hỏng vặt bao giờ.',
    verifiedBooking: true
  },
  {
    id: 'rev-2',
    userName: 'Trần Hoàng Nam',
    userRole: 'HLV Cá Nhân (Personal Trainer)',
    rating: 5,
    date: '02/08/2026',
    title: 'Leg Press DHZ đạp cực êm, chuẩn form',
    comment: 'Con Leg Press DHZ Fusion này góc đạp 45 độ chuẩn đét, đệm lưng ôm sát cột sống nên khách hàng tớ đạp 300kg vẫn an toàn khớp gối.',
    verifiedBooking: true
  }
];

export const MOCK_POSTS: SocialPost[] = [];
