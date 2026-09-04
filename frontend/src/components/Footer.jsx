import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="app-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">L</span><span className="text-lg font-bold text-white">LearnUp</span></div><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Nền tảng quản lý học tiếng Anh trực tuyến, giúp học viên theo dõi lộ trình và giáo viên tổ chức nội dung giảng dạy hiệu quả.</p></div>
      <FooterGroup title="Khám phá" links={[["Khóa học", "/courses"], ["Về LearnUp", "/about"]]} />
      <FooterGroup title="Dành cho bạn" links={[["Khu vực học viên", "/student"], ["Khu vực giáo viên", "/teacher"]]} />
      <FooterGroup title="Tài khoản" links={[["Đăng nhập", "/login"], ["Đăng ký", "/register"], ["Cài đặt", "/settings"]]} />
    </div>
    <div className="border-t border-slate-800"><div className="app-container flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 LearnUp. Nền tảng phục vụ mục đích đào tạo.</span><span>Học tập rõ ràng · Nội dung có kiểm duyệt</span></div></div>
  </footer>;
}

function FooterGroup({ title, links }) {
  return <div><h3 className="text-sm font-semibold text-white">{title}</h3><nav className="mt-4 space-y-3">{links.map(([label, to]) => <Link key={to} className="block text-sm text-slate-400 transition hover:text-white" to={to}>{label}</Link>)}</nav></div>;
}
