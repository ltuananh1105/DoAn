import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthShell, Field } from './Login.jsx';

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' }); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event) => { event.preventDefault(); setError(''); setSubmitting(true); try { const user = await register(form); navigate(`/${user.role}`); } catch (e) { setError(e.message); } finally { setSubmitting(false); } };
  return <AuthShell title="Tạo tài khoản" description="Đăng ký để tham gia khóa học hoặc bắt đầu giảng dạy trên LearnUp."><form onSubmit={submit} className="space-y-4"><Field label="Họ và tên" type="text" value={form.name} onChange={v => change('name', v)}/><Field label="Địa chỉ email" type="email" value={form.email} onChange={v => change('email', v)}/><div><label className="ui-label">Bạn đăng ký với vai trò</label><select value={form.role} onChange={e => change('role', e.target.value)} className="ui-input"><option value="student">Học viên</option><option value="teacher">Giáo viên</option></select></div><Field label="Mật khẩu" type="password" value={form.password} onChange={v => change('password', v)}/>{error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</div>}<button disabled={submitting} className="ui-button ui-button-primary w-full">{submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</button></form><p className="mt-6 text-center text-sm text-slate-600">Đã có tài khoản? <Link to="/login" className="font-semibold text-blue-700 hover:underline">Đăng nhập</Link></p></AuthShell>;
}
