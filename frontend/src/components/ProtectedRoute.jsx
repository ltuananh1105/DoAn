import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Đang tải...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    // Đăng nhập rồi nhưng sai role -> đưa về đúng trang của họ
    return <Navigate to={`/${user.role}`} replace />
  }

  return children
}