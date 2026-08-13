'use client';

import React from 'react';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand (minimal) */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <img src="/LogoGymGear.png" alt="GymGear" className="h-10 object-contain" />
            </div>
            <p className="text-sm text-slate-400">Chọn máy chuẩn — Tập luyện an toàn</p>
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

          {/* Col 4: Contact (updated) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Liên Hệ</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-slate-200">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="font-bold">Hotline: 0364704715</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>linhlg2004@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>268 Nguyễn Thái Sơn, Gò Vấp, TP.HCM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-400">
          <p>© 2026 GymGear Review & Booking Platform. Bản quyền thuộc về GymGearVN.</p>
        </div>

      </div>
    </footer>
  );
};
