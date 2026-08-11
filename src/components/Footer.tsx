'use client';

import React from 'react';
import { Dumbbell, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-white">GymGear Review</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nền tảng review độc lập & hỗ trợ đặt lịch trải nghiệm thực tế các dòng máy tập Gym commercial & home gym hàng đầu tại Việt Nam.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hạ tầng 100% Free Stack (Vercel + Supabase)</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chuyên Mục Máy Gym</h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Máy chạy bộ Commercial (Impulse, Technogym)</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Máy đạp đùi Leg Press 45 độ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Khung gánh Smith Machine & Power Rack</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Máy cáp đôi Home Gym đa năng</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Xe đạp tập Spin Bike công nghiệp</a></li>
            </ul>
          </div>

          {/* Col 3: Showroom Network */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hệ Thống Showroom Đối Tác</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Showroom Hà Nội: Cầu Giấy & Thanh Xuân</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Showroom TP.HCM: Quận 10 & Tân Bình</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Showroom Đà Nẵng: Quận Hải Châu</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hỗ Trợ Booking 24/7</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-slate-200">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="font-bold">Hotline: 1900 6868 (Phím 1)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>booking@gymgear-review.vn</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-400">
          <p>© 2026 GymGear Review & Booking Platform. Bản quyền thuộc về cộng đồng Gym Việt Nam.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using Next.js 14 & Tailwind CSS</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
