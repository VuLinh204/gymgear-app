'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, Dumbbell, HeartPulse } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';

const articles = [
  {
    category: 'Cáp đa năng · Life Fitness Universal Cable',
    title: 'Chọn giàn cáp cho khu functional training: bắt đầu từ bài tập và mặt bằng',
    summary: 'Giàn cáp hai tay độc lập hỗ trợ nhiều hướng kéo và bài tập cho nhiều nhóm cơ. Khi lập kế hoạch, hãy đối chiếu tầm với, khoảng trống thao tác, tỷ lệ cáp và tải từng stack theo đúng cấu hình đặt hàng. Universal Cable có nhiều kích thước lắp đặt; thông số và giá tại Việt Nam cần xác nhận theo báo giá.',
    sourceTitle: 'Functional Strength Training eBook',
    source: 'https://www.lifefitness.com/en-us/customer-support/education-hub/ebooks',
    icon: Dumbbell,
  },
  {
    category: 'Cardio · Life Fitness Atmos Treadmill',
    title: 'Máy chạy bộ thương mại: kiểm tra không gian, dải tốc độ và độ dốc',
    summary: 'Trước khi chọn máy chạy cho khách sạn hoặc phòng tập, cần tính kích thước máy và vùng lưu thông xung quanh, đồng thời xem dải tốc độ, độ dốc, mặt chạy và công suất động cơ. Atmos có các tùy chọn console khác nhau; hãy so khớp thông số cấu hình với mục đích sử dụng và nguồn điện của cơ sở.',
    sourceTitle: 'Life Fitness Atmos Treadmill — thông số nhà sản xuất',
    source: 'https://www.lifefitness.com/en-us/catalog/cardio/treadmills/atmos-treadmill',
    icon: HeartPulse,
  },
  {
    category: 'Plate loaded · Hammer Strength Reverse V-Squat',
    title: 'Máy plate-loaded: cần đối chiếu tải trọng và cách bố trí lối vào',
    summary: 'Máy dùng bánh tạ giúp người tập tự chọn mức tải, nhưng khâu thiết kế cần tính cả tải cho phép, trọng lượng máy, diện tích chiếm chỗ và lối tiếp cận bánh tạ. Reverse V-Squat công bố mức tải tối đa theo mỗi tay đòn; mức tải khởi đầu và kỹ thuật sử dụng vẫn nên được PT hướng dẫn phù hợp với từng người.',
    sourceTitle: 'Hammer Strength Reverse V-Squat — thông số nhà sản xuất',
    source: 'https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/reverse-v-squat',
    icon: Dumbbell,
  },
  {
    category: 'Lập chương trình · Strength training',
    title: 'Xây dựng nền tảng sức mạnh và thói quen tập có thể duy trì lâu dài',
    summary: 'Hướng dẫn nhập môn của Life Fitness nhấn mạnh việc làm quen mẫu vận động, chọn mức kháng lực phù hợp và tiến triển dần. Kết hợp máy với bài tạ tự do hoặc trọng lượng cơ thể có thể giúp người mới thực hành kỹ thuật; người tập nên nhờ huấn luyện viên điều chỉnh bài theo năng lực và mục tiêu.',
    sourceTitle: 'Begin a Strength Training Program',
    source: 'https://www.lifefitness.com/en-us/customer-support/education-hub/blog/begin-strength-training-program',
    icon: BookOpen,
  },
  {
    category: 'Sức khỏe · Hammer Strength',
    title: 'Tập sức mạnh cho nhiều độ tuổi: thiết kế chương trình theo khả năng',
    summary: 'Bài viết Life Fitness bàn về vai trò của tập sức mạnh qua các giai đoạn cuộc sống và việc điều chỉnh cường độ, khối lượng, thời gian nghỉ theo thể trạng. Máy pin-loaded, plate-loaded, cáp và tạ tự do có thể được phối hợp; lựa chọn cụ thể cần dựa trên khả năng vận động và hướng dẫn chuyên môn.',
    sourceTitle: 'The Rise of Strength Training: Unlocking Longevity and Health Through the Decades',
    source: 'https://www.lifefitness.com/en-us/customer-support/education-hub/blog/rise-strength-training',
    icon: HeartPulse,
  },
];

export default function ArticlesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onSearch={() => {}} onOpenBooking={() => setBookingOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/equipment" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> Trở lại danh mục máy</Link>
        <header className="mb-8 mt-7 max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-blue-500/40 bg-blue-600 px-3 py-1 text-xs font-bold text-white">GYMGEAR · KIẾN THỨC THIẾT BỊ</p>
          <h1 className="text-3xl font-black sm:text-5xl">Bài viết chọn máy và tập luyện</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">Các nội dung dưới đây là phần tóm tắt và hướng dẫn do GymGear biên soạn, dựa trên thông tin nhà sản xuất. Mỗi thẻ dẫn tới nguồn gốc để bạn đọc chi tiết.</p>
        </header>
        <div className="grid gap-5 md:grid-cols-2">{articles.map((article) => {
          const Icon = article.icon;
          return <article key={article.title} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 ring-1 ring-inset ring-white/5">
            <div className="mb-4 flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wide text-blue-300">{article.category}</span><Icon className="h-5 w-5 text-slate-400" /></div>
            <h2 className="text-xl font-extrabold leading-snug">{article.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{article.summary}</p>
            <a href={article.source} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 border-t border-slate-800 pt-4 text-sm font-bold text-white hover:text-blue-300">Nguồn: {article.sourceTitle}<ArrowUpRight className="h-4 w-4 shrink-0" /></a>
          </article>;
        })}</div>
      </main>
      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
