import Link from "next/link";
import { ArrowLeft, Dumbbell, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-700/70 to-transparent"
      />

      <section className="relative w-full max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-emerald-400 shadow-xl shadow-black/20">
          <Dumbbell size={30} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <p className="font-mono text-sm font-bold tracking-[0.3em] text-emerald-400">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Không tìm thấy trang
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
          Đường dẫn này có thể đã thay đổi hoặc không còn tồn tại. Hãy quay lại
          trang chủ hoặc khám phá thiết bị và bài viết mới nhất.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white transition hover:bg-emerald-600 active:translate-y-0.5"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Về trang chủ
          </Link>
          <Link
            href="/equipment"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 active:translate-y-0.5"
          >
            <Search size={17} aria-hidden="true" />
            Khám phá thiết bị
          </Link>
        </div>
      </section>
    </main>
  );
}
