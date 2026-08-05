import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";

const roleConfig = {
  student: { label: "Bắt đầu học", to: "/student" },
  teacher: { label: "Vào giảng dạy", to: "/teacher" },
  admin: { label: "Quản trị hệ thống", to: "/admin" },
};

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const roleInfo = user ? roleConfig[user.role] : null;
  const isAlreadyInDashboard =
    roleInfo && location.pathname.startsWith(roleInfo.to);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/5 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B2F87] to-[#3B82F6] flex items-center justify-center text-white font-extrabold text-sm">
            L
          </div>
          <span className="font-extrabold text-lg text-[#0F172A]">LearnUp</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {roleInfo && !isAlreadyInDashboard && (
                <Link
                  to={roleInfo.to}
                  className="bg-[#1E4FD8] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#173FB0] transition"
                >
                  {roleInfo.label}
                </Link>
              )}

              {/* WRAPPER RÊ CHUỘT (HOVER MENU) */}
              <div className="relative group py-1">
                {/* NÚT AVATAR */}
                <button className="w-9 h-9 rounded-full bg-[#1E4FD8] text-white flex items-center justify-center hover:bg-[#173FB0] transition focus:outline-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="white" />
                    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="white" />
                  </svg>
                </button>

                {/* DROPDOWN MENU (Chỉ hiện khi Hover) */}
                <div className="absolute right-0 top-full hidden group-hover:block pt-2 z-50">
                  <div className="w-64 bg-white rounded-2xl shadow-xl border border-black/5 p-5">
                    <div className="flex flex-col items-center text-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#1E4FD8] text-white flex items-center justify-center mb-2">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle cx="12" cy="8" r="4" fill="white" />
                          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="white" />
                        </svg>
                      </div>
                      <p className="font-bold text-[#0F172A]">{user.name}</p>
                      <p className="text-sm text-[#0F172A]/50">{user.email}</p>
                    </div>

                    <div className="border-t border-black/5 pt-3 space-y-1">
                      <Link
                        to="/settings"
                        className="w-full flex items-center gap-2 text-sm text-[#0F172A]/80 hover:bg-gray-50 rounded-lg px-2 py-2 transition"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" />
                        </svg>
                        Cài đặt
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 rounded-lg px-2 py-2 transition"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <path d="M16 17l5-5-5-5" />
                          <path d="M21 12H9" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1E4FD8] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#173FB0] transition"
            >
              Bắt đầu
            </button>
          )}
        </div>
      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </header>
  );
}
