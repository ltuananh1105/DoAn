import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const roleDestination = {
  student: { label: 'Khu vực học tập', to: '/student' },
  teacher: { label: 'Khu vực giảng dạy', to: '/teacher' },
  admin: { label: 'Trang quản trị', to: '/admin' },
};

const exploreLinks = [
  { label: 'Danh sách khóa học', to: '/courses' },
  { label: 'Về LearnUp', to: '/about' },
];

export default function Footer() {
  const { user } = useAuth();
  const accountLinks = user
    ? [roleDestination[user.role], { label: 'Cài đặt tài khoản', to: '/settings' }].filter(Boolean)
    : [{ label: 'Đăng nhập', to: '/login' }, { label: 'Tạo tài khoản', to: '/register' }];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="app-container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
        <div className="max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label="LearnUp - Trang chủ">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 font-bold text-white">L</span>
            <span className="text-lg font-bold tracking-tight text-slate-900">LearnUp</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Nền tảng học tiếng Anh trực tuyến giúp học viên theo dõi lộ trình, giáo viên quản lý nội dung và nhà trường kiểm soát chất lượng đào tạo.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-700">Học đúng lộ trình. Theo dõi đúng tiến độ.</p>
        </div>

        <FooterGroup title="Khám phá" links={exploreLinks} />
        <FooterGroup title={user ? 'Tài khoản của bạn' : 'Bắt đầu'} links={accountLinks} />
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="app-container flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} LearnUp. Phục vụ mục đích đào tạo.</span>
          <span>Nội dung được kiểm duyệt trước khi xuất bản</span>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <nav className="mt-4 space-y-3" aria-label={title}>
        {links.map(({ label, to }) => (
          <Link key={to} className="block w-fit text-sm text-slate-600 transition hover:text-blue-700" to={to}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
