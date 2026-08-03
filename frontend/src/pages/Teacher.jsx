import { useAuth } from '../context/AuthContext.jsx'

export default function Teacher() {
  const { user, logout } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-2">
        Trang Giáo viên
      </h1>
      <p>Xin chào, <strong>{user?.name}</strong> ({user?.email})</p>
      <p>Vai trò: {user?.role}</p>

      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Đăng xuất
      </button>
    </div>
  )
}