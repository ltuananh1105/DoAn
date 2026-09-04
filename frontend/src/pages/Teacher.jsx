import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ExportModal from "../components/ExportModal.jsx";

const teacherMenuItems = [
  {
    key: "courses",
    label: "Khóa học của tôi",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: "students",
    label: "Quản lý học viên",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    key: "revenue",
    label: "Thống kê & Doanh thu",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const courseStatusLabels = {
  draft: "Bản nháp", pending: "Chờ duyệt", published: "Đang xuất bản",
  approved: "Đang xuất bản", rejected: "Bị từ chối", suspended: "Đình chỉ", archived: "Đã lưu trữ",
};
const isoDate = (date) => date.toISOString().slice(0, 10);

export default function Teacher() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("courses");
  const [isExpanded, setIsExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportFrom, setReportFrom] = useState(() => isoDate(new Date(Date.now() - 29 * 86400000)));
  const [reportTo, setReportTo] = useState(() => isoDate(new Date()));

  // Search & Filter state
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatusFilter, setCourseStatusFilter] = useState("");
  const [teacherStudentSearch, setTeacherStudentSearch] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !courseSearch ||
        c.title?.toLowerCase().includes(courseSearch.toLowerCase());
      const matchStatus = !courseStatusFilter || c.status === courseStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [courses, courseSearch, courseStatusFilter]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      return (
        !teacherStudentSearch ||
        s.student?.name?.toLowerCase().includes(teacherStudentSearch.toLowerCase()) ||
        s.student?.email?.toLowerCase().includes(teacherStudentSearch.toLowerCase()) ||
        s.course?.title?.toLowerCase().includes(teacherStudentSearch.toLowerCase())
      );
    });
  }, [students, teacherStudentSearch]);

  // Form tạo khóa học
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });

  // Modal chỉnh sửa khóa học
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });

  // Export State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const [exportFilename, setExportFilename] = useState("");
  const [exportTitle, setExportTitle] = useState("");
  const [exportSubtitle, setExportSubtitle] = useState("");

  const loadData = useCallback(() => {
    if (!user?.id) return;
    setLoading(true);

    // 1. Danh sách khóa học
    fetch(`/api/teacher/${user.id}/courses-detail`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // 2. Danh mục
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);

    // 3. Học viên
    fetch(`/api/teacher/${user.id}/students`)
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch(console.error);

    // 4. Doanh thu
    fetch(`/api/teacher/${user.id}/revenue?from=${reportFrom}&to=${reportTo}`)
      .then((res) => res.json())
      .then(setRevenue)
      .catch(console.error);
  }, [user?.id, reportFrom, reportTo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Tạo khóa học
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        teacher: { id: user.id },
        category: { id: Number(form.categoryId) },
      }),
    });

    const data = await res.json();
    if (res.ok && data.success !== false) {
      alert("Đã tạo bản nháp. Hãy bổ sung chương và bài học trước khi gửi duyệt.");
      setForm({ title: "", description: "", price: "", categoryId: "" });
      setShowCreateModal(false);
      loadData();
    } else {
      alert(data.message || "Có lỗi xảy ra khi tạo khóa học, vui lòng thử lại.");
    }
  };

  // Mở modal sửa
  const handleOpenEdit = (e, course) => {
    e.stopPropagation(); // Không trigger click vào trang chi tiết
    setEditingCourse(course);
    setEditForm({
      title: course.title || "",
      description: course.description || "",
      price: course.price || 0,
      categoryId: course.category?.id || "",
    });
  };

  // Lưu sửa khóa học
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          price: Number(editForm.price),
          teacher: { id: user.id },
          category: { id: Number(editForm.categoryId) },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success !== false) {
        alert("Cập nhật thông tin khóa học thành công!");
        setEditingCourse(null);
        loadData();
      } else {
        alert(data.message || "Lỗi khi cập nhật khóa học.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa khóa học
  const handleDeleteCourse = async (e, courseId) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;
    try {
      const res = await fetch(`/api/teacher/${user.id}/courses/${courseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa khóa học thành công");
        loadData();
      } else {
        alert(data.message || "Không thể xóa khóa học đã có học viên đăng ký");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ngừng phát hành khóa học nhưng vẫn giữ lịch sử học tập và giao dịch
  const handleToggleVisibility = async (e, courseId) => {
    e.stopPropagation();
    if (!window.confirm("Ngừng phát hành khóa học này? Khóa học sẽ không còn hiển thị để đăng ký mới, nhưng dữ liệu học viên và doanh thu vẫn được giữ lại.")) return;
    try {
      const res = await fetch(`/api/teacher/${user.id}/courses/${courseId}/toggle-visibility`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else alert(data.message || "Không thể ngừng phát hành khóa học");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitCourse = async (e, courseId) => {
    e.stopPropagation();
    if (!window.confirm("Gửi khóa học cho Admin xét duyệt? Trong thời gian chờ duyệt, bạn sẽ không thể sửa nội dung.")) return;
    const res = await fetch(`/api/courses/${courseId}/submit`, { method: "PUT" });
    const data = await res.json();
    if (res.ok && data.success !== false) {
      alert("Đã gửi khóa học chờ duyệt");
      loadData();
    } else alert(data.message || "Không thể gửi duyệt khóa học");
  };

  // Xóa học viên khỏi lớp
  const handleRemoveStudent = async (enrollmentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa học viên khỏi khóa học này?")) return;
    try {
      const res = await fetch(`/api/teacher/${user.id}/enrollments/${enrollmentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Export Handlers ---
  const handleExportCourses = () => {
    setExportColumns([
      { key: "id", label: "Mã khóa học" }, { key: "title", label: "Tên khóa học" },
      { key: "categoryName", label: "Danh mục" }, { key: "price", label: "Giá niêm yết (VNĐ)" },
      { key: "enrollmentCount", label: "Số học viên" }, { key: "statusText", label: "Trạng thái" },
      { key: "submittedAt", label: "Ngày gửi duyệt", format: (value) => value ? new Date(value).toLocaleString("vi-VN") : "—" },
      { key: "reviewNote", label: "Phản hồi Admin" },
    ]);
    setExportData(filteredCourses.map((course) => ({ ...course, categoryName: course.category?.name, statusText: courseStatusLabels[course.status] || course.status })));
    setExportFilename(`Danh_Sach_Khoa_Hoc_${isoDate(new Date())}`);
    setExportTitle("BÁO CÁO KHÓA HỌC GIẢNG VIÊN");
    setExportSubtitle(`Giảng viên: ${user?.name || ""} · Dữ liệu theo bộ lọc hiện tại`);
    setIsExportOpen(true);
  };

  const handleExportStudents = () => {
    const columns = [
      { key: "studentName", label: "Họ và tên" },
      { key: "studentEmail", label: "Email" },
      { key: "studentPhone", label: "Số điện thoại" },
      { key: "courseTitle", label: "Khóa học đăng ký" },
      { key: "progressText", label: "Tiến độ hoàn thành" },
      { key: "quizSummary", label: "Kết quả Quiz" },
    ];
    const data = filteredStudents.map((s) => ({
      studentName: s.student?.name,
      studentEmail: s.student?.email,
      studentPhone: s.student?.phone || "Chưa có",
      courseTitle: s.course?.title,
      progressText: `${s.progressPercent || 0}% (${s.completedLessons || 0}/${s.totalLessons || 0} bài)`,
      quizSummary: s.quizzesTaken > 0 ? `Đạt ${s.passedQuizzes}/${s.quizzesTaken} (TB: ${s.avgScore}đ)` : "Chưa làm bài",
    }));
    setExportColumns(columns);
    setExportData(data);
    setExportFilename(`Danh_Sach_Hoc_Vien_${user?.name || "GV"}`);
    setExportTitle("BÁO CÁO TIẾN ĐỘ & HỌC VIÊN LỚP HỌC");
    setExportSubtitle(`Giảng viên: ${user?.name || ""} - Ngày trích xuất: ${new Date().toLocaleDateString("vi-VN")}`);
    setIsExportOpen(true);
  };

  const handleExportRevenue = () => {
    const columns = [
      { key: "orderCode", label: "Mã đơn hàng" },
      { key: "transactionNo", label: "Mã giao dịch" },
      { key: "completedAt", label: "Thời gian hoàn tất", format: (value) => value ? new Date(value).toLocaleString("vi-VN") : "—" },
      { key: "studentName", label: "Học viên" },
      { key: "studentEmail", label: "Email học viên" },
      { key: "courseTitle", label: "Khóa học" },
      { key: "amount", label: "Doanh thu gộp (VNĐ)" },
      { key: "teacherEarning", label: "Thực nhận 80% (VNĐ)" },
      { key: "paymentMethod", label: "Phương thức thanh toán" },
    ];
    const data = (revenue?.transactions || []).map((transaction) => ({
      ...transaction,
      paymentMethod: transaction.paymentMethod === "DEMO_PAY" ? "Thanh toán demo" : transaction.paymentMethod,
    }));
    setExportColumns(columns);
    setExportData(data);
    setExportFilename(`Bao_Cao_Doanh_Thu_${reportFrom}_${reportTo}`);
    setExportTitle("BÁO CÁO TỔNG KẾT DOANH THU KHÓA HỌC");
    setExportSubtitle(`Giảng viên: ${user?.name || ""} · Kỳ ${reportFrom} đến ${reportTo} · Giao dịch COMPLETED`);
    setIsExportOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* NÚT TOGGLE SIDEBAR */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-5 left-4 z-50 rounded-lg border border-gray-200 bg-white p-2.5 text-gray-700 shadow-md md:hidden"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* SIDEBAR BÊN TRÁI ĐỒNG BỘ VỚI STUDENT */}
      <aside
        className={`fixed top-16 left-0 z-40 flex h-[calc(100vh-64px)] w-60 flex-col justify-between border-r border-gray-200 bg-white px-3 py-4 transition-transform duration-200 ${
          isExpanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-2 mt-2 w-full">
          {teacherMenuItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center h-11 rounded-xl font-medium text-sm transition-colors whitespace-nowrap overflow-hidden w-full text-left ${
                  isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="w-12 h-full flex items-center justify-center shrink-0">{item.icon}</div>
                <span>
                  {item.label}
                </span>
              </button>
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
          <span>
            Trở về trang chủ
          </span>
        </Link>
      </aside>

      {/* MAIN CONTENT BÊN PHẢI */}
      <main className="min-w-0 flex-1 px-4 py-8 md:pl-64 md:pr-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Đang tải dữ liệu giảng viên...</div>
          ) : (
            <>
              {/* TAB 1: KHÓA HỌC CỦA TÔI */}
              {activeTab === "courses" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi ({courses.length})</h1>
                      <p className="text-xs text-gray-500 mt-0.5">Bấm trực tiếp vào khóa học để quản lý bài giảng & Quiz</p>
                    </div>

                    <div className="flex gap-2"><button onClick={handleExportCourses} className="px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800">Xuất báo cáo</button><button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition flex items-center gap-2"><span>+</span><span>Tạo khóa học</span></button></div>
                  </div>

                  {/* SEARCH & FILTER - KHÓA HỌC */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm tên khóa học..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <select
                      value={courseStatusFilter}
                      onChange={(e) => setCourseStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white min-w-[150px]"
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="draft">Bản nháp</option>
                      <option value="published">Đang xuất bản</option>
                      <option value="rejected">Bị từ chối</option>
                      <option value="suspended">Đình chỉ</option>
                      <option value="archived">Đã lưu trữ</option>
                    </select>
                    {(courseSearch || courseStatusFilter) && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{filteredCourses.length}/{courses.length}</span>
                        <button onClick={() => { setCourseSearch(""); setCourseStatusFilter(""); }} className="text-xs text-blue-600 font-semibold hover:underline">Xóa bộ lọc</button>
                      </div>
                    )}
                  </div>

                  {/* DANH SÁCH KHÓA HỌC DẠNG CARD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/teacher/courses/${c.id}`)}
                        className="bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group border-gray-200 hover:border-blue-400"
                      >
                        <div>
                          {/* TRẠNG THÁI VÀ DANH MỤC */}
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                              {c.category?.name || "Chưa phân loại"}
                            </span>

                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                ["published", "approved"].includes(c.status)
                                  ? "bg-green-100 text-green-700"
                                  : c.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : ["suspended", "archived"].includes(c.status)
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {courseStatusLabels[c.status] || c.status}
                            </span>
                          </div>

                          {/* TIÊU ĐỀ KHÓA HỌC */}
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition line-clamp-1">
                            {c.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                          {c.reviewNote && <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-700"><strong>Phản hồi Admin:</strong> {c.reviewNote}</p>}

                          <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs text-gray-600">
                            <span className="font-bold text-gray-900">{c.price?.toLocaleString("vi-VN")} ₫</span>
                            <span className="font-medium text-blue-600">{c.enrollmentCount || 0} học viên</span>
                          </div>
                        </div>

                        {/* NÚT THAO TÁC (SỬA, ẨN, XÓA) */}
                        <div className="mt-4 pt-3 border-t flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {["draft", "rejected"].includes(c.status) && <button onClick={(e) => handleOpenEdit(e, c)} className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition">Sửa</button>}

                          {["draft", "rejected"].includes(c.status) && <button onClick={(e) => handleSubmitCourse(e, c.id)} className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition">Gửi duyệt</button>}

                          {["published", "approved"].includes(c.status) && (
                            <button
                              onClick={(e) => handleToggleVisibility(e, c.id)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition"
                            >
                              Ngừng phát hành
                            </button>
                          )}
                          {c.status === "draft" && <button
                            onClick={(e) => handleDeleteCourse(e, c.id)}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
                          >
                            Xóa
                          </button>}
                        </div>
                      </div>
                    ))}

                    {filteredCourses.length === 0 && (
                      <div className="col-span-3 text-center py-16 bg-white rounded-2xl border text-gray-400">
                        {courseSearch || courseStatusFilter ? "Không tìm thấy khóa học phù hợp." : "Bạn chưa tạo khóa học nào. Hãy bấm \"+ Tạo Khóa Học Mới\" để bắt đầu."}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: QUẢN LÝ HỌC VIÊN */}
              {activeTab === "students" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Quản lý & Tiến độ học viên ({students.length})</h1>
                      <p className="text-xs text-gray-500">Theo dõi tiến độ học tập và kết quả bài kiểm tra Quiz</p>
                    </div>
                    <button
                      onClick={handleExportStudents}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 flex items-center gap-2 shadow-sm transition"
                    >
                      <span>Xuất Báo Cáo Học Viên</span>
                    </button>
                  </div>

                  {/* SEARCH - HỌC VIÊN */}
                  <div className="relative mb-4">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm học viên theo tên, email hoặc khóa học..."
                      value={teacherStudentSearch}
                      onChange={(e) => setTeacherStudentSearch(e.target.value)}
                      className="w-full max-w-lg pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                    />
                    {teacherStudentSearch && <span className="ml-3 text-sm text-gray-400">{filteredStudents.length}/{students.length} kết quả</span>}
                  </div>

                  <div className="bg-white border rounded-2xl shadow-xs overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-700">Học viên</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">Khóa học</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">Tiến độ bài học</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">Kết quả Quiz</th>
                          <th className="px-4 py-3 font-semibold text-right text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredStudents.map((s) => (
                          <tr key={s.enrollmentId} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="font-bold text-gray-900">{s.student?.name}</div>
                              <div className="text-gray-500">{s.student?.email} · {s.student?.phone || "SĐT: —"}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-gray-800">{s.course?.title}</div>
                              <div className="text-gray-500 text-[11px]">{s.course?.categoryName}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${s.progressPercent || 0}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold text-gray-700">{s.progressPercent || 0}%</span>
                              </div>
                              <div className="text-gray-400 mt-0.5">{s.completedLessons || 0}/{s.totalLessons || 0} bài</div>
                            </td>
                            <td className="px-4 py-3">
                              {s.quizzesTaken > 0 ? (
                                <div>
                                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                                    s.passedQuizzes > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  }`}>
                                    Đạt {s.passedQuizzes}/{s.quizzesTaken} bài
                                  </span>
                                  <div className="text-gray-500 mt-0.5">Điểm TB: {s.avgScore}đ</div>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">Chưa làm bài</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleRemoveStudent(s.enrollmentId)}
                                className="text-red-500 hover:text-red-700 font-semibold"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                        {students.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                              Chưa có học viên nào đăng ký khóa học của bạn.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: THỐNG KÊ DOANH THU */}
              {activeTab === "revenue" && revenue && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu & Hiệu suất bán khóa học</h1>
                      <p className="text-xs text-gray-500">Tỷ lệ phân chia: Giảng viên 80% - Sàn đào tạo LearnUp 20%</p>
                    </div>
                    <div className="flex flex-wrap items-end gap-2 text-xs">
                      <label>Từ ngày<input type="date" value={reportFrom} max={reportTo} onChange={(e) => setReportFrom(e.target.value)} className="ml-1 rounded-xl border px-2 py-2" /></label>
                      <label>Đến ngày<input type="date" value={reportTo} min={reportFrom} max={isoDate(new Date())} onChange={(e) => setReportTo(e.target.value)} className="ml-1 rounded-xl border px-2 py-2" /></label>
                      <button onClick={handleExportRevenue} className="px-4 py-2 bg-green-700 text-white rounded-xl text-xs font-semibold hover:bg-green-800 transition">Xuất báo cáo</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-6 border rounded-2xl shadow-xs">
                      <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Tổng lượt mua / đăng ký</div>
                      <div className="text-3xl font-extrabold text-gray-900">{revenue.totalCoursesSold}</div>
                    </div>
                    <div className="bg-white p-6 border rounded-2xl shadow-xs">
                      <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Tổng doanh số (Gross)</div>
                      <div className="text-3xl font-extrabold text-green-600">
                        {revenue.totalGrossRevenue?.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                    <div className="bg-white p-6 border rounded-2xl shadow-xs bg-blue-50 border-blue-100">
                      <div className="text-blue-800 text-xs font-semibold uppercase tracking-wider mb-1">Thực nhận giảng viên (80%)</div>
                      <div className="text-3xl font-extrabold text-blue-600">
                        {revenue.teacherNetEarnings?.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                    <div className="bg-white p-6 border rounded-2xl shadow-xs"><div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Học viên trả phí</div><div className="text-3xl font-extrabold text-gray-900">{revenue.uniquePayingStudents || 0}</div></div>
                    <div className="bg-white p-6 border rounded-2xl shadow-xs"><div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Giá trị đơn TB</div><div className="text-2xl font-extrabold text-gray-900">{revenue.averageOrderValue?.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫</div></div>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-4 text-sm">Chi tiết từng khóa học</h3>
                  <div className="bg-white border rounded-2xl shadow-xs overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-700">Khóa học</th>
                          <th className="px-4 py-3 font-semibold text-right text-gray-700">Giá bán</th>
                          <th className="px-4 py-3 font-semibold text-center text-gray-700">Ghi danh / Đơn trả phí</th>
                          <th className="px-4 py-3 font-semibold text-center text-gray-700">Tỷ lệ trả phí</th>
                          <th className="px-4 py-3 font-semibold text-right text-gray-700">Tổng doanh thu</th>
                          <th className="px-4 py-3 font-semibold text-right text-blue-600">Thực nhận 80%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {revenue.coursesBreakdown?.map((r) => (
                          <tr key={r.courseId} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-bold text-gray-900">{r.courseTitle}</td>
                            <td className="px-4 py-3 text-right">{r.price?.toLocaleString("vi-VN")} ₫</td>
                            <td className="px-4 py-3 text-center font-bold">{r.enrollmentCount || 0} / {r.soldCount}</td>
                            <td className="px-4 py-3 text-center">{r.conversionRate || 0}%</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">{r.totalRevenue?.toLocaleString("vi-VN")} ₫</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-600">
                              {r.teacherEarnings?.toLocaleString("vi-VN")} ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* MODAL TẠO KHÓA HỌC MỚI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Tạo khóa học mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tên khóa học</label>
                <input
                  type="text"
                  placeholder="VD: Tiếng Anh Giao Tiếp Công Sở Nâng Cao"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mô tả khóa học</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả nội dung, mục tiêu của khóa học..."
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="VD: 499000"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Danh mục</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Tạo khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA KHÓA HỌC */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Chỉnh sửa thông tin khóa học</h3>
              <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tên khóa học</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mô tả khóa học</label>
                <textarea
                  rows="3"
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Danh mục</label>
                  <select
                    required
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                    className="w-full border px-3 py-2 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tùy chỉnh Xuất Báo Cáo */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        columns={exportColumns}
        data={exportData}
        defaultFilename={exportFilename}
        defaultTitle={exportTitle}
        defaultSubtitle={exportSubtitle}
      />
    </div>
  );
}
