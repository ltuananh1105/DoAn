import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const roleLinks = {
  student: { label: 'Khu vực học tập', to: '/student' },
  teacher: { label: 'Khu vực giảng dạy', to: '/teacher' },
  admin: { label: 'Trang quản trị', to: '/admin' },
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const roleLink = user ? roleLinks[user.role] : null;

  useEffect(() => { setMobileOpen(false); setAccountOpen(false); }, [location.pathname]);
  useEffect(() => {
    const close = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setAccountOpen(false); };
    document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const navClass = ({ isActive }) => `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`;

  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
    <nav className="app-container flex h-16 items-center justify-between gap-6">
      <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="LearnUp - Trang chủ">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-base font-bold text-white">L</span>
        <span className="text-lg font-bold tracking-tight text-slate-900">LearnUp</span>
      </Link>
      <div className="hidden items-center gap-1 md:flex">
        <NavLink to="/" end className={navClass}>Trang chủ</NavLink>
        <NavLink to="/courses" className={navClass}>Khóa học</NavLink>
        <NavLink to="/about" className={navClass}>Về LearnUp</NavLink>
      </div>
      <div className="ml-auto hidden items-center gap-2 md:flex">
        {!user ? <><Link to="/login" className="ui-button ui-button-secondary">Đăng nhập</Link><Link to="/register" className="ui-button ui-button-primary">Đăng ký</Link></> : <>
          {roleLink && !location.pathname.startsWith(roleLink.to) && <Link to={roleLink.to} className="ui-button ui-button-primary">{roleLink.label}</Link>}
          <div className="relative" ref={menuRef}>
            <button type="button" onClick={() => setAccountOpen(v => !v)} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50" aria-expanded={accountOpen}>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-700">{user.name?.trim()?.charAt(0)?.toUpperCase() || 'U'}</span>
              <span className="max-w-32 truncate text-sm font-medium text-slate-700">{user.name}</span><span className="text-xs text-slate-400">⌄</span>
            </button>
            {accountOpen && <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-semibold text-slate-900">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
              {roleLink && <Link to={roleLink.to} className="mt-1 block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{roleLink.label}</Link>}
              <Link to="/settings" className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Cài đặt tài khoản</Link>
              <button type="button" onClick={handleLogout} className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Đăng xuất</button>
            </div>}
          </div>
        </>}
      </div>
      <button type="button" onClick={() => setMobileOpen(v => !v)} className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden" aria-label="Mở menu"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </nav>
    {mobileOpen && <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"><div className="space-y-1"><NavLink to="/" end className={navClass}>Trang chủ</NavLink><NavLink to="/courses" className={navClass}>Khóa học</NavLink><NavLink to="/about" className={navClass}>Về LearnUp</NavLink>{user && roleLink && <NavLink to={roleLink.to} className={navClass}>{roleLink.label}</NavLink>}<NavLink to={user ? '/settings' : '/login'} className={navClass}>{user ? 'Cài đặt tài khoản' : 'Đăng nhập'}</NavLink>{!user && <NavLink to="/register" className={navClass}>Đăng ký</NavLink>}{user && <button onClick={handleLogout} className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600">Đăng xuất</button>}</div></div>}
  </header>;
}
