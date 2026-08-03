import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(form)
      navigate(`/${user.role}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-16 bg-gradient-to-b from-[#0B2F87] to-[#3B82F6]">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1 text-center">
          Chào mừng trở lại 👋
        </h1>
        <p className="text-sm text-[#0F172A]/60 text-center mb-6">
          Đăng nhập để tiếp tục học tập
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-black/10 bg-[#F8FAFC] px-4 py-3 rounded-xl focus:outline-none focus:border-[#3B82F6]"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-black/10 bg-[#F8FAFC] px-4 py-3 rounded-xl focus:outline-none focus:border-[#3B82F6]"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#1E4FD8] text-white font-bold py-3 rounded-full hover:bg-[#173FB0] transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-[#0F172A]/60">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#1E4FD8] font-bold">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  )
}