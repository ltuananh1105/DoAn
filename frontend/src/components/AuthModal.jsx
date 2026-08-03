import { Link } from 'react-router-dom'

export default function AuthModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#0F172A]/40 hover:text-[#0F172A] text-xl"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B2F87] to-[#3B82F6] flex items-center justify-center text-white font-extrabold text-sm">
            L
          </div>
          <span className="font-extrabold text-lg text-[#0F172A]">LearnUp</span>
        </div>

        <h2 className="text-center font-bold text-lg text-[#0F172A] mb-6">
          Tham gia ngay cùng LearnUp — Nền tảng học ngôn ngữ thông minh
        </h2>

        <div className="space-y-3">
          <Link
            to="/login"
            onClick={onClose}
            className="block text-center bg-[#1E4FD8] text-white font-bold py-3 rounded-full hover:bg-[#173FB0] transition"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="block text-center border-2 border-[#1E4FD8] text-[#1E4FD8] font-bold py-3 rounded-full hover:bg-[#EAF1FF] transition"
          >
            Đăng ký
          </Link>
        </div>

        <p className="text-xs text-center text-[#0F172A]/50 mt-5">
          Bằng cách tham gia, bạn xác nhận đã đọc và đồng ý với Điều khoản &amp; Điều kiện của LearnUp.
        </p>
      </div>
    </div>
  )
}