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
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80'
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
      },
      {
        id: 'c-2',
        author: {
          id: 'usr-3',
          name: 'Phạm Thu Trang',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          role: 'user',
          roleTitle: 'Home Gymer'
        },
        content: 'Con này dòng home gym dùng được không ạ hay chỉ dùng phòng commercial vậy anh?',
        createdAt: '45 phút trước',
        likesCount: 3
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
  }
];
