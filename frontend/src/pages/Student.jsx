import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const menuItems = [
  {
    path: "/student",
    label: "Tổng quan",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: "/student/courses",
    label: "Khóa học của tôi",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Student() {
  const { user } = useAuth();
  const location = useLocation();
  const [enrollments, setEnrollments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      return (
        !courseSearch ||
        e.course?.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
        e.course?.teacher?.name?.toLowerCase().includes(courseSearch.toLowerCase()) ||
        e.course?.category?.name?.toLowerCase().includes(courseSearch.toLowerCase())
      );
    });
  }, [enrollments, courseSearch]);

  const isOverview = location.pathname === "/student";
  const isMyCourses = location.pathname === "/student/courses";

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const resEn = await fetch(`/api/students/${user.id}/enrollments`);
      const dataEn = await resEn.json();
      const enList = Array.isArray(dataEn) ? dataEn.filter((e) => e && e.course) : [];
      const enrollmentsWithProgress = await Promise.all(enList.map(async (enrollment) => {
        try {
          const progressRes = await fetch(
            `/api/progress/student/${user.id}/course/${enrollment.course.id}`
          );
          const progress = await progressRes.json();
          return { ...enrollment, progress: progress.success ? progress : null };
        } catch {
          return { ...enrollment, progress: null };
        }
      }));
      setEnrollments(enrollmentsWithProgress);

      const allQuizzes = [];
      for (const en of enList) {
        if (en.course?.id) {
          try {
            const qRes = await fetch(`/api/quizzes/course/${en.course.id}`);
            const qData = await qRes.json();
            if (Array.isArray(qData)) {
              qData.forEach((q) => allQuizzes.push({ ...q, courseTitle: en.course.title }));
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      setQuizzes(allQuizzes);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* NÚT TOGGLE SIDEBAR */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-3 left-3 z-50 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
                  isActive ? "bg-blue-100 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="w-12 h-full flex items-center justify-center shrink-0">{item.icon}</div>
                <span className={`transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
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
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
          <span className={`transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            Trở về trang chủ
          </span>
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 pr-6 py-8 ${isExpanded ? "pl-64" : "pl-20"}`}>
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Đang tải dữ liệu học tập...</div>
          ) : (
            <>
              {/* 1. TỔNG QUAN (OVERVIEW) */}
              {isOverview && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển Học viên</h1>
                    <p className="text-sm text-gray-500">Xin chào, {user?.name}! Chúc bạn có buổi học hiệu quả.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Khóa học tham gia</div>
                      <div className="text-3xl font-extrabold text-blue-600">{enrollments.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bài Quiz có sẵn</div>
                      <div className="text-3xl font-extrabold text-indigo-600">{quizzes.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1">Mục tiêu học tập</div>
                      <div className="text-lg font-bold">Hoàn thành 100% lộ trình</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Khóa học đang học</h2>
                      <Link to="/student/courses" className="text-sm text-blue-600 font-semibold hover:underline">Xem tất cả →</Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {enrollments.map((e) => (
                        <div key={e.id} className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                              {e.course?.category?.name || "Tiếng Anh"}
                            </span>
                            <h3 className="font-bold text-gray-900 mt-3 line-clamp-1">{e.course?.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{e.course?.description}</p>
                            <div className="mt-4">
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-gray-500">Tiến độ</span>
                                <strong className="text-blue-600">{e.progress?.progressPercent || 0}%</strong>
                              </div>
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${e.progress?.progressPercent || 0}%` }} />
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 pt-4 border-t flex justify-between items-center">
                            <span className="text-xs text-gray-400">GV: {e.course?.teacher?.name || "LearnUp"}</span>
                            <Link
                              to={`/student/courses/${e.course?.id}`}
                              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                            >
                              Tiếp tục học
                            </Link>
                          </div>
                        </div>
                      ))}
                      {enrollments.length === 0 && (
                        <div className="col-span-3 text-center py-12 bg-white rounded-2xl border text-gray-400">
                          Bạn chưa đăng ký khóa học nào.{" "}
                          <Link to="/courses" className="text-blue-600 underline font-semibold">
                            Khám phá ngay
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. KHÓA HỌC CỦA TÔI */}
              {isMyCourses && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi ({enrollments.length})</h1>
                      <p className="text-sm text-gray-500">Tất cả các khóa học bạn đã đăng ký</p>
                    </div>
                    {/* SEARCH */}
                    <div className="relative w-full sm:max-w-xs">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm khóa học, giảng viên..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  {enrollments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-400 mb-4">Bạn chưa đăng ký khóa học nào.</p>
                      <Link to="/courses" className="text-blue-600 font-semibold underline">Khám phá khóa học ngay</Link>
                    </div>
                  ) : filteredEnrollments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-400 mb-2">Không tìm thấy khóa học phù hợp.</p>
                      <button onClick={() => setCourseSearch("")} className="text-blue-600 font-semibold text-sm hover:underline">Xóa bộ lọc</button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEnrollments.map((e) => (
                        <Link
                          key={e.id}
                          to={`/student/courses/${e.course?.id}`}
                          className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition flex flex-col bg-white group"
                        >
                          <div className="h-32 bg-gradient-to-br from-[#0B2F87] to-[#3B82F6] flex items-center justify-center text-white font-bold text-lg px-4 text-center group-hover:scale-105 transition-transform duration-300">
                            {e.course?.title || "Khóa học"}
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-xs font-semibold text-[#1E4FD8]">
                                {e.course?.category?.name || "Chưa phân loại"}
                              </span>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{e.course?.description}</p>
                              <div className="mt-4">
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span className="text-gray-500">{e.progress?.completedLessons || 0}/{e.progress?.totalLessons || 0} bài</span>
                                  <strong className="text-blue-600">{e.progress?.progressPercent || 0}%</strong>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{ width: `${e.progress?.progressPercent || 0}%` }} />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t text-xs font-bold text-blue-600 flex justify-between items-center">
                              <span>Vào học ngay →</span>
                              <span className="text-gray-400 font-normal">GV: {e.course?.teacher?.name || "LearnUp"}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
