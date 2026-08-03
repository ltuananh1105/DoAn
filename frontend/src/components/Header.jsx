import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/5 shadow-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B2F87] to-[#3B82F6] flex items-center justify-center text-white font-extrabold text-sm">
            L
          </div>
          <span className="font-extrabold text-lg text-[#0F172A]">LearnUp</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0F172A]/80">
          <Link to="/" className="hover:text-[#1E4FD8] transition">Trang chủ</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-[#0F172A]/70">
                Xin chào, <strong>{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-[#1E4FD8] hover:underline"
              >
                Đăng xuất
              </button>
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
  )
}