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

export const MOCK_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: {
      id: 'usr-1',
      name: 'Nguyễn Văn Hùng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Chủ chuỗi Gym FitPlus (3 cơ sở)',
      isVerified: true
    },
    createdAt: '2 giờ trước',
    content: 'Vừa hoàn tất chạy thử 2 tuần con máy Impulse PT300H ở cơ sở Cầu Giấy. Phải công nhận động cơ 4.0 AC cực kỳ trâu bò, khách hội viên chạy bứt tốc 18km/h liên tục 16 tiếng/ngày không thấy máy bị nóng nảy gì! Ai chuẩn bị mở phòng gym recommend đi book lịch thử máy trực tiếp tại Showroom nhé.',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[0],
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 142,
    commentsCount: 28,
    sharesCount: 15,
    isLiked: true,
    comments: [
      {
        id: 'c-1',
        author: {
          id: 'usr-2',
          name: 'Lê Minh Tuấn',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'user',
          roleTitle: 'HLV Chuyên Nghiệp (PT)'
        },
        content: 'Băng tải 56cm chạy đằm chân lắm anh Hùng ơi! Em dẫn học viên qua thử tại Showroom Quận 10 tuần trước cũng vừa chốt 2 con.',
        createdAt: '1 giờ trước',
        likesCount: 12
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      id: 'usr-4',
      name: 'Trần Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Reviewer Độc Lập / Fitness Influencer',
      isVerified: true
    },
    createdAt: '5 giờ trước',
    content: 'So sánh góc đạp Leg Press DHZ Fusion 45 độ vs các dòng Leg Press thông thường: DHZ làm bàn đạp cực rộng, cho phép đổi vị trí chân tác động chuyên sâu vào mông hoặc đùi trước mà không sợ trượt tạ. Chịu tải 600kg tạ đĩa đằm đét!',
    rating: 4.8,
    taggedEquipment: MOCK_EQUIPMENTS[1],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 98,
    commentsCount: 14,
    sharesCount: 9,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-3',
    author: {
      id: 'usr-5',
      name: 'Vũ Quốc Khánh',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      roleTitle: 'Quản Lý Hệ Thống IronCenter',
      isVerified: true
    },
    createdAt: '1 ngày trước',
    content: 'Review nhanh Smith Machine Matrix Versa: Trục ray nghiêng 7 độ chuẩn sinh học giúp anh em đẩy ngực & squat không bị đau cổ tay. Giá hơi chát chút nhưng sắt dày 3mm yên tâm 10 năm không xước móp!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[2],
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 215,
    commentsCount: 42,
    sharesCount: 23,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-4',
    author: {
      id: 'usr-6',
      name: 'Hoàng Lan Bikini',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Vận Động Viên Bikini Fitness',
      isVerified: true
    },
    createdAt: '1 ngày trước',
    content: 'Hôm nay test bài Hip Thrust và Kéo cáp Glute Kickback trên giàn Dual Pulley Impulse IT9530. Cáp mượt kinh khủng, không có độ trễ hay sượng bi ở điểm co cơ đỉnh! Chị em nào muốn tập mông căng tròn mà sợ to đùi thì nên tận dụng giàn cáp này nhé 🍑✨',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[4],
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 312,
    commentsCount: 56,
    sharesCount: 41,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-5',
    author: {
      id: 'usr-7',
      name: 'Dũng Powerlifter',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Vận động viên Powerlifting 83kg',
      isVerified: true
    },
    createdAt: '2 ngày trước',
    content: 'Chinh phục mức tạ 380kg trên máy Hack Squat Cybex! Cảm giác đệm vai êm như nhung, chốt an toàn gạt ra vào bằng một tay cực kỳ chắc chắn. Đây là máy Hack Squat ngon nhất mình từng tập ở Việt Nam.',
    rating: 4.9,
    taggedEquipment: MOCK_EQUIPMENTS[5],
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 189,
    commentsCount: 31,
    sharesCount: 18,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-6',
    author: {
      id: 'usr-8',
      name: 'HLV Tuấn Anh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Master Trainer / Chuyên Gia Phục Hồi',
      isVerified: true
    },
    createdAt: '2 ngày trước',
    content: 'Máy chèo thuyền Concept2 RowErg PM5 là bài khởi động tim mạch và hạ nhiệt tuyệt vời nhất cho học viên sau giờ tạ nặng. Kháng lực gió tự động điều chỉnh theo lực kéo, không gây chấn thương khớp gối hay cổ chân.',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[3],
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 174,
    commentsCount: 22,
    sharesCount: 14,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-7',
    author: {
      id: 'usr-9',
      name: 'Minh Hoàng Gym',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Chủ phòng Gym Tân Bình',
      isVerified: false
    },
    createdAt: '3 ngày trước',
    content: 'Kinh nghiệm cho anh em mới mở phòng: Đừng tiếc tiền mua máy chạy bộ rẻ tiền động cơ DC. Đầu tư luôn con Impulse PT300H động cơ AC 4.0HP này dùng 5-7 năm không lo bảo dưỡng, tính ra tiết kiệm tiền triệu mỗi tháng.',
    rating: 4.8,
    taggedEquipment: MOCK_EQUIPMENTS[0],
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 88,
    commentsCount: 19,
    sharesCount: 11,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-8',
    author: {
      id: 'usr-10',
      name: 'Bảo Ngọc Fitness',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Hội viên VIP GymGear',
      isVerified: false
    },
    createdAt: '3 ngày trước',
    content: 'Vừa đặt lịch thử máy qua app GymGear đến Showroom Cầu Giấy trải nghiệm. Các bạn nhân viên kỹ thuật hướng dẫn chi tiết cách chỉnh độ dốc và nhịp tim. Dịch vụ đặt lịch 0đ thực sự rất tiện!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[0],
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 65,
    commentsCount: 8,
    sharesCount: 5,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-9',
    author: {
      id: 'usr-1',
      name: 'Nguyễn Văn Hùng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Chủ chuỗi Gym FitPlus (3 cơ sở)',
      isVerified: true
    },
    createdAt: '4 ngày trước',
    content: 'Đã bổ sung thêm 2 dàn Dual Pulley Impulse IT9530 vào khu vực Free Weight. Giờ cao điểm từ 17h-20h hội viên không còn phải xếp hàng đợi kéo cáp nữa. Đầu tư xứng đáng từng đồng!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[4],
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 124,
    commentsCount: 16,
    sharesCount: 8,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-10',
    author: {
      id: 'usr-4',
      name: 'Trần Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Reviewer Độc Lập / Fitness Influencer',
      isVerified: true
    },
    createdAt: '4 ngày trước',
    content: 'Tips tập mông đùi trên máy Hack Squat: Hãy đặt bàn chân ở nửa trên của tấm đạp và mở rộng bằng vai, hạ tạ chậm trong 3 giây để cảm nhận cơ đùi trước căng xé. Đừng khoá khớp gối khi lên đỉnh nhé!',
    rating: 4.9,
    taggedEquipment: MOCK_EQUIPMENTS[5],
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 245,
    commentsCount: 38,
    sharesCount: 30,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-11',
    author: {
      id: 'usr-11',
      name: 'Khánh Linh Yoga & Gym',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'HLV Thể Hình Nữ',
      isVerified: false
    },
    createdAt: '5 ngày trước',
    content: 'Khung Smith Matrix Versa hỗ trợ bài Hip Thrust siêu an toàn cho các bạn nữ mới tập. Thanh đòn có trợ lực ban đầu chỉ 6.8kg nên rất dễ căn chỉnh tư thế trước khi tăng tạ nặng.',
    rating: 4.8,
    taggedEquipment: MOCK_EQUIPMENTS[2],
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 92,
    commentsCount: 11,
    sharesCount: 7,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-12',
    author: {
      id: 'usr-5',
      name: 'Vũ Quốc Khánh',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      roleTitle: 'Quản Lý Hệ Thống IronCenter',
      isVerified: true
    },
    createdAt: '5 ngày trước',
    content: 'Đợt bảo trì định kỳ 6 tháng toàn bộ hệ thống cáp và puly của Impulse. Dây cáp bọc nhựa polyurethane vẫn nguyên vẹn 100%, không bị tưa chỉ hay gãy gập. Độ hoàn thiện cơ khí rất ấn tượng!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[4],
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 167,
    commentsCount: 25,
    sharesCount: 13,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-13',
    author: {
      id: 'usr-12',
      name: 'Thanh Tùng Calisthenics',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Vận động viên Thể Dục Đường Phố',
      isVerified: false
    },
    createdAt: '6 ngày trước',
    content: 'Thanh xà đa năng gắn trên khung Smith Matrix có độ bám nhám kim cương rất tốt, đu xà đeo tạ 40kg không hề có cảm giác rung lắc hay kêu cọt kẹt.',
    rating: 4.7,
    taggedEquipment: MOCK_EQUIPMENTS[2],
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 78,
    commentsCount: 9,
    sharesCount: 6,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-14',
    author: {
      id: 'usr-8',
      name: 'HLV Tuấn Anh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Master Trainer / Chuyên Gia Phục Hồi',
      isVerified: true
    },
    createdAt: '6 ngày trước',
    content: 'Bảng so sánh nhịp tim khi chạy bền trên Impulse PT300H vs chạy ngoài trời: Nhờ hệ thống giảm xóc PuraCushion, áp lực dội ngược lên sụn chêm đầu gối giảm tới 35%. Cực kỳ phù hợp cho người có tiền sử đau gối.',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[0],
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 198,
    commentsCount: 34,
    sharesCount: 22,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-15',
    author: {
      id: 'usr-6',
      name: 'Hoàng Lan Bikini',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Vận Động Viên Bikini Fitness',
      isVerified: true
    },
    createdAt: '1 tuần trước',
    content: 'Buổi tập Leg Day hôm nay trọn vẹn với 5 hiệp Leg Press DHZ Fusion. Đạp 240kg mà lưng dưới vẫn ép chặt vào đệm, không bị cong gập thắt lưng. Recommend 10/10 cho anh chị em tập chân chuyên sâu!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[1],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 340,
    commentsCount: 62,
    sharesCount: 45,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-16',
    author: {
      id: 'usr-13',
      name: 'Phúc Long Crossfit',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'CrossFit Athlete',
      isVerified: false
    },
    createdAt: '1 tuần trước',
    content: 'Thử thách chèo 2000m trên Concept2 RowErg: Thành tích hôm nay đạt 6 phút 45 giây. Màn hình PM5 đo chỉ số Split/500m cực nhạy và đồng bộ thẳng vào điện thoại qua Bluetooth.',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[3],
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 115,
    commentsCount: 18,
    sharesCount: 12,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-17',
    author: {
      id: 'usr-7',
      name: 'Dũng Powerlifter',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Vận động viên Powerlifting 83kg',
      isVerified: true
    },
    createdAt: '1 tuần trước',
    content: 'Đẩy ngực trên Bench Press kết hợp giàn Smith Matrix: Khung ray thép đúc nguyên khối chống vặn xoắn khi đẩy mức tạ 160kg. Anh em tập một mình không có người đỡ tạ (spotter) vẫn yên tâm tuyệt đối nhờ móc khoá xoay cổ tay.',
    rating: 4.9,
    taggedEquipment: MOCK_EQUIPMENTS[2],
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 156,
    commentsCount: 21,
    sharesCount: 10,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-18',
    author: {
      id: 'usr-14',
      name: 'Quang Huy PT',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      roleTitle: 'Personal Trainer Hà Đông',
      isVerified: false
    },
    createdAt: '2 tuần trước',
    content: 'Bài tập kéo mặt (Face Pull) trên giàn cáp Impulse IT9530 giúp khắc phục tật gù lưng và đau mỏi vai gáy cho dân văn phòng cực kỳ hiệu quả. Hãy cài nấc puly ngang tầm mắt và dùng dây thừng đôi nhé!',
    rating: 4.8,
    taggedEquipment: MOCK_EQUIPMENTS[4],
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 89,
    commentsCount: 14,
    sharesCount: 9,
    isLiked: false,
    comments: []
  },
  {
    id: 'post-19',
    author: {
      id: 'usr-4',
      name: 'Trần Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Reviewer Độc Lập / Fitness Influencer',
      isVerified: true
    },
    createdAt: '2 tuần trước',
    content: 'Tổng kết 1 tháng trải nghiệm phòng tập full combo thiết bị thương mại Impulse & DHZ: Máy chạy đầm, máy khối kéo mượt, máy tạ đĩa chịu lực tốt. Đánh giá chung 9.5/10 trong tầm giá!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[0],
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 278,
    commentsCount: 49,
    sharesCount: 36,
    isLiked: true,
    comments: []
  },
  {
    id: 'post-20',
    author: {
      id: 'usr-1',
      name: 'Nguyễn Văn Hùng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'premium',
      roleTitle: 'Chủ chuỗi Gym FitPlus (3 cơ sở)',
      isVerified: true
    },
    createdAt: '2 tuần trước',
    content: 'Chào mừng chi nhánh thứ 3 của FitPlus tại Hà Đông chính thức đi vào hoạt động! Toàn bộ khu Cardio và Strength đều trang bị dòng máy mới nhất từ GymGear VN. Anh em hội viên ghé tập thử miễn phí tuần đầu nhé!',
    rating: 5,
    taggedEquipment: MOCK_EQUIPMENTS[1],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
    ],
    likesCount: 410,
    commentsCount: 88,
    sharesCount: 52,
    isLiked: true,
    comments: []
  }
];
