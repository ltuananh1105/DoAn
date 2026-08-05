import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const menuItems = [
  {
    path: "/student",
    label: "Overview",
    icon: (
      <svg
        className="w-5 h-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    path: "/student/courses",
    label: "My courses",
    icon: (
      <svg
        className="w-5 h-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    path: "/student/practice",
    label: "Test Practice",
    icon: (
      <svg
        className="w-5 h-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function Student() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const isMyCoursesPage = location.pathname === "/student/courses";

  useEffect(() => {
    // Chỉ gọi API lấy danh sách khóa học khi vào đúng tab My Courses
    if (isMyCoursesPage && user?.id) {
      setLoading(true);
      fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
        .then((res) => res.json())
        .then((data) => {
          setEnrollments(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Lỗi fetch enrollment:", err);
          setLoading(false);
        });
    }
  }, [user?.id, isMyCoursesPage]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* NÚT TOGGLE SIDEBAR */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* SIDEBAR */}
      <aside
        className={`group fixed top-16 left-0 z-40 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col justify-between py-3 px-2 shadow-sm ${
          isExpanded ? "w-60" : "w-16 hover:w-60"
        }`}
      >
        <div className="space-y-2 mt-2 w-full">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center h-11 rounded-xl font-medium text-sm transition-colors whitespace-nowrap overflow-hidden w-full ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-bold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="w-12 h-full flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span
                  className={`transition-opacity duration-200 ${
                    isExpanded
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <Link
          to="/"
          className="flex items-center h-11 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap overflow-hidden mb-2 w-full"
        >
          <div className="w-12 h-full flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
          </div>
          <span
            className={`transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            Trở về trang chủ
          </span>
        </Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        className={`flex-1 transition-all duration-300 pr-6 py-8 ${isExpanded ? "pl-64" : "pl-20"}`}
      >
        <div className="max-w-6xl mx-auto">
          {/* OVERVIEW PAGE: ĐỂ TRỐNG ĐỂ BẠN TỰ THÊM NỘI DUNG SAU */}
          {!isMyCoursesPage && (
            <div>
              {/* Thêm component Widget/Dashboard Overview của bạn vào đây sau */}
            </div>
          )}

          {/* MY COURSES PAGE: HIỂN THỊ CÁC KHÓA HỌC */}
          {isMyCoursesPage && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#0F172A]">
                    Khóa học của tôi
                  </h1>
                  <p className="text-sm text-gray-500">
                    Xin chào, {user?.name}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-gray-500">
                  Đang tải dữ liệu...
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-gray-400 mb-4">
                    Bạn chưa đăng ký khóa học nào.
                  </p>
                  <Link
                    to="/courses"
                    className="text-blue-600 font-semibold underline"
                  >
                    Khám phá khóa học ngay
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((e) => (
                    <Link
                      key={e.id}
                      to={`/student/courses/${e.course?.id}`}
                      className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition flex flex-col bg-white"
                    >
                      <div className="h-32 bg-gradient-to-br from-[#0B2F87] to-[#3B82F6] flex items-center justify-center text-white font-bold text-lg px-4 text-center">
                        {e.course?.title || "Khóa học"}
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-[#1E4FD8]">
                          {e.course?.category?.name || "Chưa phân loại"}
                        </span>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {e.course?.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
