import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => { event.preventDefault(); setError(''); setSubmitting(true); try { const user = await login(form); navigate(`/${user.role}`); } catch (e) { setError(e.message); } finally { setSubmitting(false); } };
  return <AuthShell title="Đăng nhập" description="Tiếp tục học tập và quản lý tiến độ của bạn."><form onSubmit={submit} className="space-y-4"><Field label="Địa chỉ email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })}/><Field label="Mật khẩu" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })}/>{error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</div>}<button disabled={submitting} className="ui-button ui-button-primary w-full">{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</button></form><p className="mt-6 text-center text-sm text-slate-600">Chưa có tài khoản? <Link to="/register" className="font-semibold text-blue-700 hover:underline">Đăng ký</Link></p></AuthShell>;
}

function AuthShell({ title, description, children }) { return <main className="bg-slate-50 px-4 py-12 sm:py-16"><div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="mb-7"><h1 className="text-2xl font-bold text-slate-900">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>{children}</div></main>; }
function Field({ label, type, value, onChange }) { return <div><label className="ui-label">{label}</label><input required type={type} value={value} onChange={e => onChange(e.target.value)} className="ui-input" autoComplete={type === 'password' ? 'current-password' : 'email'}/></div>; }
export { AuthShell, Field };
