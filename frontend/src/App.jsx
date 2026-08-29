import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Student from "./pages/Student.jsx";
import Teacher from "./pages/Teacher.jsx";
import Admin from "./pages/Admin.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import TeacherCourseDetail from "./pages/TeacherCourseDetail.jsx";
import CoursePreview from "./pages/CoursePreview.jsx";
import Settings from "./pages/Settings.jsx";
import Practice from "./pages/Practice.jsx";
import VNPayReturn from "./pages/VNPayReturn.jsx";
import AiTutorModal from "./components/AiTutorModal.jsx";

function About() {
  return <h1 className="text-3xl font-bold text-blue-600 p-6">Giới thiệu về LearnUp</h1>;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-600 mt-2">Trang bạn tìm kiếm không tồn tại.</p>
    </div>
  );
}

export default function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route element={<MainLayout />}>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CoursePreview />} />
          <Route path="/vnpay-return" element={<VNPayReturn />} />

          {/* PROTECTED COMMON ROUTES */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            }
          />

          {/* STUDENT ROUTES */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <Student />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute role="student">
                <Student />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/practice"
            element={
              <ProtectedRoute role="student">
                <Practice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses/:courseId"
            element={
              <ProtectedRoute role="student">
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          {/* TEACHER ROUTES */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <Teacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/:courseId"
            element={
              <ProtectedRoute role="teacher">
                <TeacherCourseDetail />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* NÚT TRỢ LÝ AI NỔI TOÀN HỆ THỐNG */}
      <button
        onClick={() => setIsAiModalOpen(!isAiModalOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition duration-200 flex items-center justify-center gap-2 group"
        title="Trợ lý Học tập AI"
      >
        <span className="text-xl">🤖</span>
        <span className="text-xs font-bold pr-1 hidden group-hover:inline transition-all duration-300">
          Trợ lý AI
        </span>
      </button>

      {/* POPUP TRỢ LÝ AI */}
      <AiTutorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
}
