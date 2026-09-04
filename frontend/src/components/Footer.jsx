import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-white">
    <div className="app-container grid gap-8 py-10 sm:grid-cols-3">
      <div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-700 font-bold text-white">L</span><span className="font-bold text-slate-900">LearnUp</span></div><p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">Nền tảng học tiếng Anh trực tuyến dành cho học viên và giáo viên Việt Nam.</p></div>
      <div><h3 className="text-sm font-semibold text-slate-900">Khám phá</h3><div className="mt-3 space-y-2 text-sm text-slate-500"><Link className="block hover:text-blue-700" to="/courses">Danh sách khóa học</Link><Link className="block hover:text-blue-700" to="/about">Về LearnUp</Link></div></div>
      <div><h3 className="text-sm font-semibold text-slate-900">Tài khoản</h3><div className="mt-3 space-y-2 text-sm text-slate-500"><Link className="block hover:text-blue-700" to="/login">Đăng nhập</Link><Link className="block hover:text-blue-700" to="/register">Đăng ký</Link></div></div>
    </div>
    <div className="border-t border-slate-100"><div className="app-container py-4 text-xs text-slate-500">© 2026 LearnUp. Nền tảng phục vụ mục đích đào tạo.</div></div>
  </footer>;
}
