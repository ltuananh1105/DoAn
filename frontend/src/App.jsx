import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AiTutorModal from './components/AiTutorModal.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Student from './pages/Student.jsx';
import Teacher from './pages/Teacher.jsx';
import Admin from './pages/Admin.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import TeacherCourseDetail from './pages/TeacherCourseDetail.jsx';
import CoursePreview from './pages/CoursePreview.jsx';
import AdminCourseReview from './pages/AdminCourseReview.jsx';
import Settings from './pages/Settings.jsx';
import VNPayReturn from './pages/VNPayReturn.jsx';

function About() {
  const audiences = [['Học viên', 'Tìm khóa học, học theo bài và theo dõi tiến độ.'], ['Giáo viên', 'Xây dựng khóa học, quản lý nội dung và kết quả.'], ['Quản trị viên', 'Duyệt nội dung, quản lý tài khoản và báo cáo.']];
  return <div className="app-container page-section"><div className="max-w-3xl"><p className="text-sm font-semibold text-blue-700">VỀ LEARNUP</p><h1 className="page-heading mt-3">Nền tảng quản lý học tiếng Anh trực tuyến</h1><p className="page-description">LearnUp giúp giáo viên tổ chức nội dung, học viên theo dõi quá trình học và đơn vị quản trị kiểm soát chất lượng khóa học trên cùng một hệ thống.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{audiences.map(([title, text]) => <div key={title} className="ui-card p-6"><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div>;
}
function NotFound() { return <div className="app-container flex min-h-[60vh] flex-col items-center justify-center text-center"><p className="text-sm font-bold text-blue-700">LỖI 404</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Không tìm thấy trang</h1><p className="mt-2 text-slate-600">Địa chỉ bạn truy cập không tồn tại hoặc đã được thay đổi.</p></div>; }

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  return <div className="relative min-h-screen"><Routes><Route element={<MainLayout />}>
    <Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/courses" element={<Courses />} /><Route path="/courses/:courseId" element={<CoursePreview />} /><Route path="/vnpay-return" element={<VNPayReturn />} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/student" element={<ProtectedRoute role="student"><Student /></ProtectedRoute>} /><Route path="/student/courses" element={<ProtectedRoute role="student"><Student /></ProtectedRoute>} /><Route path="/student/courses/:courseId" element={<ProtectedRoute role="student"><CourseDetail /></ProtectedRoute>} />
    <Route path="/teacher" element={<ProtectedRoute role="teacher"><Teacher /></ProtectedRoute>} /><Route path="/teacher/courses/:courseId" element={<ProtectedRoute role="teacher"><TeacherCourseDetail /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} /><Route path="/admin/courses/:courseId" element={<ProtectedRoute role="admin"><AdminCourseReview /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes>
  <button type="button" onClick={() => setAiOpen(v => !v)} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-800" title="Trợ lý học tập"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.4-4 8-9 8a10 10 0 01-4-.8L3 20l1.3-3.5A7.4 7.4 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z"/></svg><span>Trợ lý học tập</span></button>
  <AiTutorModal isOpen={aiOpen} onClose={() => setAiOpen(false)} /></div>;
}
