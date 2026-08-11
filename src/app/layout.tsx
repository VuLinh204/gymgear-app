import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="vi" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
