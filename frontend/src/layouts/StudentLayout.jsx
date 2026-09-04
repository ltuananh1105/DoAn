import { Link, NavLink, Outlet } from 'react-router-dom';

export default function StudentLayout() {
  const navClass = ({ isActive }) => `block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`;
  return <div className="flex min-h-screen bg-slate-50"><aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Học tập</p><nav className="mt-2 space-y-1"><NavLink to="/student" end className={navClass}>Tổng quan</NavLink><NavLink to="/student/courses" className={navClass}>Khóa học của tôi</NavLink></nav><Link to="/" className="mt-8 block border-t px-3 py-4 text-sm text-slate-500 hover:text-blue-700">Về trang chủ</Link></aside><main className="min-w-0 flex-1"><Outlet /></main></div>;
}
