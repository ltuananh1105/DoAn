import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ExportModal from "../components/ExportModal.jsx";
import { Link } from "react-router-dom";

const API = "/api";

const courseStatusLabels = {
  draft: "Bản nháp", pending: "Chờ duyệt", published: "Đang xuất bản",
  approved: "Đang xuất bản", rejected: "Bị từ chối", suspended: "Đình chỉ", archived: "Đã lưu trữ",
};

const accountStatusLabels = { active: "Đang hoạt động", locked: "Đã khóa", inactive: "Ngừng hoạt động" };
const isoDate = (date) => date.toISOString().slice(0, 10);

const adminMenuItems = [
  {
    key: "courses",
    label: "Quản lý khóa học",
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
    key: "teachers",
    label: "Quản lý giảng viên",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "revenue",
    label: "Doanh thu sàn",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Cài đặt & Danh mục",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [catName, setCatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportFrom, setReportFrom] = useState(() => isoDate(new Date(Date.now() - 29 * 86400000)));
  const [reportTo, setReportTo] = useState(() => isoDate(new Date()));
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "student" });

  // Search & Filter state
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatusFilter, setCourseStatusFilter] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Export state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const [exportFilename, setExportFilename] = useState("");
  const [exportTitle, setExportTitle] = useState("");
  const [exportSubtitle, setExportSubtitle] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "courses") {
        const res = await fetch(`${API}/courses`);
        const data = await res.json();
        setCourses(data);
      } else if (activeTab === "students" || activeTab === "teachers") {
        const res = await fetch(`${API}/users`);
        const data = await res.json();
        if (activeTab === "students") {
          setStudents(data.filter((u) => u.role === "student"));
        } else {
          setTeachers(data.filter((u) => u.role === "teacher"));
        }
      } else if (activeTab === "revenue") {
        const res = await fetch(`${API}/revenue/admin?from=${reportFrom}&to=${reportTo}`);
        const data = await res.json();
        setRevenueData(data);
      } else if (activeTab === "settings") {
        const res = await fetch(`${API}/categories`);
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [activeTab, reportFrom, reportTo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered derived data
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !courseSearch ||
        c.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.teacher?.name?.toLowerCase().includes(courseSearch.toLowerCase());
      const matchStatus = !courseStatusFilter || c.status === courseStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [courses, courseSearch, courseStatusFilter]);

  const filteredStudents = useMemo(() => {
    return students.filter((u) => {
      return (
        !studentSearch ||
        u.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(studentSearch.toLowerCase())
      );
    });
  }, [students, studentSearch]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((u) => {
      return (
        !teacherSearch ||
        u.name?.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(teacherSearch.toLowerCase())
      );
    });
  }, [teachers, teacherSearch]);

  const filteredOrders = useMemo(() => {
    return (revenueData?.recentOrders || []).filter((r) => {
      return (
        !orderSearch ||
        r.student?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        r.course?.title?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        r.orderCode?.toLowerCase().includes(orderSearch.toLowerCase())
      );
    });
  }, [revenueData, orderSearch]);

  const updateCourseStatus = async (id, action) => {
    try {
      let reason = "";
      if (action === "reject" || action === "suspend") {
        reason = window.prompt(action === "reject" ? "Nhập lý do từ chối (ít nhất 10 ký tự)" : "Nhập lý do đình chỉ (ít nhất 10 ký tự)") || "";
        if (reason.trim().length < 10) return;
      }
      const res = await fetch(`${API}/courses/${id}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) loadData();
      else alert(data.message || "Không thể cập nhật trạng thái khóa học");
    } catch (err) {
      console.error(err);
    }
  };

  const updateAccountStatus = async (account, status) => {
    if (!window.confirm(`Xác nhận chuyển tài khoản ${account.email} sang trạng thái "${accountStatusLabels[status]}"?`)) return;
    const res = await fetch(`${API}/users/${account.id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok && data.success !== false) loadData();
    else alert(data.message || "Không thể cập nhật tài khoản");
  };

  const resetPassword = async (account) => {
    const newPassword = window.prompt(`Nhập mật khẩu tạm cho ${account.email} (ít nhất 6 ký tự)`);
    if (!newPassword) return;
    const res = await fetch(`${API}/users/${account.id}/reset-password`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword }),
    });
    const data = await res.json();
    alert(data.message || (res.ok ? "Đã đặt lại mật khẩu" : "Không thể đặt lại mật khẩu"));
  };

  const createAccount = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/users`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userForm),
    });
    const data = await res.json();
    if (res.ok && data.success !== false) {
      setShowCreateUser(false);
      setUserForm({ name: "", email: "", password: "", role: activeTab === "teachers" ? "teacher" : "student" });
      loadData();
    } else alert(data.message || "Không thể tạo tài khoản");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setCatName("");
        loadData();
      } else {
        alert(data.message || "Không thể thêm danh mục");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      const res = await fetch(`${API}/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        loadData();
      } else {
        alert(data.message || "Không thể xóa danh mục đang có khóa học");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = async (category) => {
    const name = window.prompt("Tên danh mục mới", category.name);
    if (!name?.trim() || name.trim() === category.name) return;
    const res = await fetch(`${API}/categories/${category.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();
    if (data.success === false) alert(data.message || "Không thể sửa danh mục");
    else loadData();
  };

  // --- Export Handlers ---
  const handleExportCourses = () => {
    setExportColumns([
      { key: "id", label: "Mã khóa học" }, { key: "title", label: "Tên khóa học" },
      { key: "teacherName", label: "Giảng viên" }, { key: "categoryName", label: "Danh mục" },
      { key: "price", label: "Giá niêm yết (VNĐ)" }, { key: "statusText", label: "Trạng thái" },
      { key: "submittedAt", label: "Ngày gửi duyệt", format: (value) => value ? new Date(value).toLocaleString("vi-VN") : "—" },
      { key: "reviewedAt", label: "Ngày xét duyệt", format: (value) => value ? new Date(value).toLocaleString("vi-VN") : "—" },
      { key: "reviewNote", label: "Ghi chú xét duyệt" },
    ]);
    setExportData(filteredCourses.map((course) => ({ ...course, teacherName: course.teacher?.name, categoryName: course.category?.name, statusText: courseStatusLabels[course.status] || course.status })));
    setExportFilename(`Danh_Sach_Khoa_Hoc_${isoDate(new Date())}`);
    setExportTitle("BÁO CÁO DANH MỤC KHÓA HỌC");
    setExportSubtitle("Dữ liệu theo bộ lọc hiện tại trên Cổng quản trị LearnUp");
    setIsExportOpen(true);
  };

  const handleExportStudents = () => {
    const columns = [
      { key: "id", label: "Mã HV" },
      { key: "name", label: "Họ và tên" },
      { key: "email", label: "Địa chỉ Email" },
      { key: "phone", label: "Số điện thoại" },
      { key: "province", label: "Tỉnh / Thành phố" },
      { key: "occupation", label: "Nghề nghiệp" },
      { key: "statusText", label: "Trạng thái" },
    ];
    setExportColumns(columns);
    setExportData(filteredStudents.map((item) => ({ ...item, statusText: accountStatusLabels[item.status || "active"] })));
    setExportFilename("Danh_Sach_Hoc_Vien_Toan_San");
    setExportTitle("DANH SÁCH HỌC VIÊN TRÊN HỆ THỐNG");
    setExportSubtitle("Trích xuất từ Cổng Quản trị viên LearnUp");
    setIsExportOpen(true);
  };

  const handleExportTeachers = () => {
    const columns = [
      { key: "id", label: "Mã GV" },
      { key: "name", label: "Họ và tên giảng viên" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Số điện thoại" },
      { key: "province", label: "Địa bàn" },
      { key: "occupation", label: "Chuyên môn / Học vị" },
      { key: "statusText", label: "Trạng thái" },
    ];
    setExportColumns(columns);
    setExportData(filteredTeachers.map((item) => ({ ...item, statusText: accountStatusLabels[item.status || "active"] })));
    setExportFilename("Danh_Sach_Giang_Vien_LearnUp");
    setExportTitle("DANH SÁCH GIẢNG VIÊN HỢP TÁC");
    setExportSubtitle("Phòng Quản lý Đào tạo & Đối tác - LearnUp");
    setIsExportOpen(true);
  };

  const handleExportRevenue = () => {
    const columns = [
      { key: "orderCode", label: "Mã đơn hàng" },
      { key: "transactionNo", label: "Mã giao dịch" },
      { key: "completedAt", label: "Thời gian hoàn tất", format: (value) => value ? new Date(value).toLocaleString("vi-VN") : "—" },
      { key: "studentName", label: "Học viên thanh toán" },
      { key: "courseTitle", label: "Khóa học" },
      { key: "amount", label: "Doanh thu gộp (VNĐ)" },
      { key: "platformRevenue", label: "Phí nền tảng 20% (VNĐ)" },
      { key: "teacherPayout", label: "Thanh toán GV 80% (VNĐ)" },
      { key: "paymentMethod", label: "Phương thức TT" },
    ];
    const data = filteredOrders.map((r) => ({
      orderCode: r.orderCode,
      transactionNo: r.transactionNo || "—",
      completedAt: r.completedAt || r.createdAt,
      studentName: r.student?.name,
      courseTitle: r.course?.title,
      amount: r.amount || 0,
      platformRevenue: (r.amount || 0) * 0.2,
      teacherPayout: (r.amount || 0) * 0.8,
      paymentMethod: r.paymentMethod,
    }));
    setExportColumns(columns);
    setExportData(data);
    setExportFilename(`Bao_Cao_Doanh_Thu_${reportFrom}_${reportTo}`);
    setExportTitle("BÁO CÁO DOANH THU & GIAO DỊCH TOÀN HỆ THỐNG");
    setExportSubtitle(`Kỳ báo cáo: ${reportFrom} đến ${reportTo} · Chỉ bao gồm giao dịch COMPLETED`);
    setIsExportOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-shrink-0 overflow-y-auto border-r bg-white md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">LearnUp Admin</h2>
          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          {adminMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5 md:hidden">
            <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">Khu vực quản trị</label>
            <select value={activeTab} onChange={(event) => setActiveTab(event.target.value)} className="ui-input">
              {adminMenuItems.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* TAB COURSES */}
              {activeTab === "courses" && (
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3"><h1 className="text-2xl font-bold text-gray-900">Phê duyệt & Quản lý khóa học</h1><button onClick={handleExportCourses} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">📥 Xuất báo cáo</button></div>
                  {/* SEARCH & FILTER - COURSES */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm tên khóa học, giảng viên..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={courseStatusFilter}
                      onChange={(e) => setCourseStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-white min-w-[160px]"
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="draft">Bản nháp</option>
                      <option value="published">Đang xuất bản</option>
                      <option value="rejected">Bị từ chối</option>
                      <option value="suspended">Đình chỉ</option>
                      <option value="archived">Đã lưu trữ</option>
                    </select>
                    <span className="text-sm text-gray-400 flex items-center">{filteredCourses.length}/{courses.length}</span>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-gray-700">Khóa học</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Giảng viên</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Giá</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Trạng thái</th>
                          <th className="px-6 py-4 font-semibold text-gray-700 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredCourses.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 line-clamp-1">{c.title}</div>
                              <div className="text-xs text-gray-500">{c.category?.name}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{c.teacher?.name}</td>
                            <td className="px-6 py-4 text-gray-600">{c.price?.toLocaleString("vi-VN")} đ</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                              {c.reviewNote && <div className="mt-1 max-w-xs text-xs text-red-600" title={c.reviewNote}>{c.reviewNote}</div>}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <Link to={`/admin/courses/${c.id}`} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded font-medium hover:bg-blue-100">Xem</Link>
                              {c.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => updateCourseStatus(c.id, "approve")}
                                    className="px-3 py-1.5 bg-green-50 text-green-600 rounded font-medium hover:bg-green-100"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => updateCourseStatus(c.id, "reject")}
                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded font-medium hover:bg-red-100"
                                  >
                                    Từ chối
                                  </button>
                                </>
                              )}
                              {["published", "approved"].includes(c.status) && (
                                <button onClick={() => updateCourseStatus(c.id, "suspend")} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded font-medium hover:bg-orange-100">Đình chỉ</button>
                              )}
                              {["suspended", "archived"].includes(c.status) && (
                                <button onClick={() => updateCourseStatus(c.id, "restore")} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded font-medium hover:bg-blue-100">Khôi phục</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredCourses.length === 0 && (
                      <div className="p-8 text-center text-gray-500">{courseSearch || courseStatusFilter ? "Không tìm thấy khóa học phù hợp." : "Chưa có khóa học nào."}</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB STUDENTS */}
              {activeTab === "students" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Quản lý học viên</h1>
                      <p className="text-xs text-gray-500">Danh sách toàn bộ tài khoản học viên trong hệ thống</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setUserForm({ name: "", email: "", password: "", role: "student" }); setShowCreateUser(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Thêm học viên</button>
                      <button onClick={handleExportStudents} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm"><span>📥</span><span>Xuất báo cáo</span></button>
                    </div>
                  </div>
                  {/* SEARCH - STUDENTS */}
                  <div className="relative mb-4">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm học viên theo tên hoặc email..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                    {studentSearch && <span className="ml-3 text-sm text-gray-400">{filteredStudents.length}/{students.length} kết quả</span>}
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-gray-700">Tên</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">SĐT</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Tỉnh/TP</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Nghề nghiệp</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Trạng thái</th>
                          <th className="px-6 py-4 font-semibold text-right text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredStudents.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                            <td className="px-6 py-4 text-gray-600">{u.phone || "Chưa cập nhật"}</td>
                            <td className="px-6 py-4 text-gray-600">{u.province || "Chưa cập nhật"}</td>
                            <td className="px-6 py-4 text-gray-600">{u.occupation || "Chưa cập nhật"}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${(u.status || "active") === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{accountStatusLabels[u.status || "active"]}</span></td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {(u.status || "active") === "active" ? <button onClick={() => updateAccountStatus(u, "locked")} className="text-orange-600 font-medium">Khóa</button> : <button onClick={() => updateAccountStatus(u, "active")} className="text-green-600 font-medium">Mở khóa</button>}
                              <button onClick={() => resetPassword(u)} className="text-blue-600 font-medium">Đặt lại MK</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB TEACHERS */}
              {activeTab === "teachers" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Quản lý giảng viên</h1>
                      <p className="text-xs text-gray-500">Danh sách các đối tác giảng viên đang giảng dạy</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setUserForm({ name: "", email: "", password: "", role: "teacher" }); setShowCreateUser(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Thêm giảng viên</button>
                      <button onClick={handleExportTeachers} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm"><span>📥</span><span>Xuất báo cáo</span></button>
                    </div>
                  </div>
                  {/* SEARCH - TEACHERS */}
                  <div className="relative mb-4">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm giảng viên theo tên hoặc email..."
                      value={teacherSearch}
                      onChange={(e) => setTeacherSearch(e.target.value)}
                      className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                    {teacherSearch && <span className="ml-3 text-sm text-gray-400">{filteredTeachers.length}/{teachers.length} kết quả</span>}
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-gray-700">Tên</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">SĐT</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Chuyên môn</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Trạng thái</th>
                          <th className="px-6 py-4 font-semibold text-right text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredTeachers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                            <td className="px-6 py-4 text-gray-600">{u.phone || "Chưa cập nhật"}</td>
                            <td className="px-6 py-4 text-gray-600">{u.occupation || "Chưa cập nhật"}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${(u.status || "active") === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{accountStatusLabels[u.status || "active"]}</span></td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {(u.status || "active") === "active" ? <button onClick={() => updateAccountStatus(u, "locked")} className="text-orange-600 font-medium">Khóa</button> : <button onClick={() => updateAccountStatus(u, "active")} className="text-green-600 font-medium">Mở khóa</button>}
                              <button onClick={() => resetPassword(u)} className="text-blue-600 font-medium">Đặt lại MK</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB REVENUE */}
              {activeTab === "revenue" && revenueData && (
                <div>
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Doanh thu sàn LearnUp</h1>
                      <p className="text-xs text-gray-500">Phân tích dòng tiền toàn hệ thống và lịch sử giao dịch</p>
                    </div>
                    <div className="flex flex-wrap items-end gap-2 text-xs">
                      <label>Từ ngày<input type="date" value={reportFrom} max={reportTo} onChange={(e) => setReportFrom(e.target.value)} className="ml-1 rounded-lg border px-2 py-2" /></label>
                      <label>Đến ngày<input type="date" value={reportTo} min={reportFrom} max={isoDate(new Date())} onChange={(e) => setReportTo(e.target.value)} className="ml-1 rounded-lg border px-2 py-2" /></label>
                      <button onClick={handleExportRevenue} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm"><span>📥</span><span>Xuất báo cáo</span></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white p-6 border rounded-xl shadow-sm">
                      <div className="text-gray-500 text-sm font-medium mb-1">Tổng đơn hàng thành công</div>
                      <div className="text-3xl font-bold text-gray-900">{revenueData.totalCompletedOrders}</div>
                    </div>
                    <div className="bg-white p-6 border rounded-xl shadow-sm">
                      <div className="text-gray-500 text-sm font-medium mb-1">Tổng giao dịch (Gross)</div>
                      <div className="text-3xl font-bold text-gray-900">{revenueData.totalGrossRevenue?.toLocaleString("vi-VN")} ₫</div>
                    </div>
                    <div className="bg-white p-6 border rounded-xl shadow-sm bg-blue-50 border-blue-100">
                      <div className="text-blue-800 text-sm font-medium mb-1">Sàn giữ lại (Net - 20%)</div>
                      <div className="text-3xl font-bold text-blue-600">{revenueData.platformNetRevenue?.toLocaleString("vi-VN")} ₫</div>
                    </div>
                    <div className="bg-white p-6 border rounded-xl shadow-sm bg-green-50 border-green-100">
                      <div className="text-green-800 text-sm font-medium mb-1">Thanh toán GV (80%)</div>
                      <div className="text-3xl font-bold text-green-600">{revenueData.totalTeacherPayout?.toLocaleString("vi-VN")} ₫</div>
                    </div>
                    <div className="bg-white p-6 border rounded-xl shadow-sm"><div className="text-gray-500 text-sm font-medium mb-1">Giá trị đơn trung bình</div><div className="text-2xl font-bold text-gray-900">{revenueData.averageOrderValue?.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫</div></div>
                    <div className="bg-white p-6 border rounded-xl shadow-sm"><div className="text-gray-500 text-sm font-medium mb-1">Người mua duy nhất</div><div className="text-2xl font-bold text-gray-900">{revenueData.uniqueBuyers || 0}</div><div className={`text-xs ${(revenueData.revenueGrowthPercent || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>Doanh thu {revenueData.revenueGrowthPercent > 0 ? "+" : ""}{revenueData.revenueGrowthPercent || 0}% so với kỳ trước</div></div>
                  </div>

                  <div className="mb-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-white p-5 shadow-sm"><h3 className="mb-4 font-bold">Xu hướng doanh thu theo ngày</h3><div className="flex h-40 items-end gap-1 overflow-x-auto">{(revenueData.dailyRevenue || []).map((day) => { const max = Math.max(...(revenueData.dailyRevenue || []).map((item) => item.revenue), 1); return <div key={day.date} className="group flex min-w-3 flex-1 items-end" title={`${day.date}: ${day.revenue.toLocaleString("vi-VN")} ₫`}><div className="w-full rounded-t bg-blue-500" style={{ height: `${Math.max(day.revenue / max * 100, day.revenue ? 4 : 1)}%` }} /></div>; })}</div></div>
                    <div className="rounded-xl border bg-white p-5 shadow-sm"><h3 className="mb-4 font-bold">Khóa học tạo doanh thu cao nhất</h3><div className="space-y-3">{(revenueData.courseBreakdown || []).slice(0, 5).map((row, index) => <div key={row.courseId} className="flex justify-between gap-3 text-sm"><span className="line-clamp-1">{index + 1}. {row.courseTitle}</span><strong>{row.grossRevenue?.toLocaleString("vi-VN")} ₫</strong></div>)}</div></div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-bold text-gray-800">Giao dịch gần đây</h3>
                    <div className="relative flex-1 max-w-sm">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Tìm học viên, khóa học, mã đơn..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                    {orderSearch && <span className="text-sm text-gray-400">{filteredOrders.length} kết quả</span>}
                  </div>
                  <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-700">Mã đơn</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">Thời gian</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">Học viên</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">Khóa học</th>
                          <th className="px-4 py-3 font-semibold text-gray-700 text-right">Số tiền</th>
                          <th className="px-4 py-3 font-semibold text-gray-700">PTTT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredOrders.map((r) => (
                          <tr key={r.orderCode} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs">{r.orderCode}</td>
                            <td className="px-4 py-3 text-gray-500">{new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{r.student?.name}</div>
                              <div className="text-xs text-gray-500">{r.student?.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="line-clamp-1">{r.course?.title}</div>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-green-600">
                              {r.amount?.toLocaleString("vi-VN")} ₫
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <span className="bg-gray-100 px-2 py-1 rounded">{r.paymentMethod}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB SETTINGS */}
              {activeTab === "settings" && (
                <div className="max-w-2xl">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý danh mục</h1>

                  <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <h3 className="font-medium text-gray-900 mb-4">Thêm danh mục mới</h3>
                    <form onSubmit={handleAddCategory} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Tên danh mục..."
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Thêm
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-gray-700 w-16">ID</th>
                          <th className="px-6 py-4 font-semibold text-gray-700">Tên danh mục</th>
                          <th className="px-6 py-4 font-semibold text-gray-700 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-500">#{cat.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleEditCategory(cat)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                              >
                                Xóa
                              </button>
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

      {showCreateUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={createAccount} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Tạo tài khoản {userForm.role === "teacher" ? "giảng viên" : "học viên"}</h3>
              <button type="button" onClick={() => setShowCreateUser(false)} className="text-gray-500">✕</button>
            </div>
            <input required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Họ và tên" className="w-full rounded-xl border px-3 py-2" />
            <input required type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="Email" className="w-full rounded-xl border px-3 py-2" />
            <input required minLength="6" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="Mật khẩu tạm (ít nhất 6 ký tự)" className="w-full rounded-xl border px-3 py-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreateUser(false)} className="rounded-xl border px-4 py-2">Hủy</button>
              <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">Tạo tài khoản</button>
            </div>
          </form>
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
