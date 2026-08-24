import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "GymGear - Mạng Xã Hội Review & Booking Máy Tập Gym",
  description: "Nền tảng đánh giá chi tiết và đặt lịch chạy thử máy tập gym thương mại & home gym miễn phí 100%.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Inline script to apply saved theme before React hydration to avoid FOUC */}
        <link rel="icon" href="/LogoGymGear.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try{
              var t = localStorage.getItem('theme');
              if(t === 'light') document.documentElement.classList.add('theme-light');
              var l = localStorage.getItem('gymgear_lang');
              if(l) document.documentElement.lang = l;
            }catch(e){}
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
