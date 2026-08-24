import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
            }catch(e){}
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100" suppressHydrationWarning>
        <AuthProvider>
          {/* suppressHydrationWarning prevents Google Translate <font> injection from crashing React */}
          <div id="app-root" suppressHydrationWarning>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
