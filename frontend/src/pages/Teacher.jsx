import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ExportModal from "../components/ExportModal.jsx";

export default function Teacher() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [revenue, setRevenue] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("courses");

  // Export State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const [exportFilename, setExportFilename] = useState("");
  const [exportTitle, setExportTitle] = useState("");
  const [exportSubtitle, setExportSubtitle] = useState("");

  const loadData = () => {
    if (!user?.id) return;

    // 1. Danh sách khóa học
    fetch(`http://localhost:8080/api/teacher/${user.id}/courses-detail`)
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error);

    // 2. Danh mục
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);

    // 3. Danh sách học viên + Tiến độ + Quiz
    fetch(`http://localhost:8080/api/teacher/${user.id}/students`)
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);

    // 4. Thống kê doanh thu
    fetch(`http://localhost:8080/api/teacher/${user.id}/revenue`)
      .then((res) => res.json())
      .then(setRevenue)
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("http://localhost:8080/api/courses", {
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

    if (res.ok) {
      setMessage("Tạo khóa học thành công! Đang chờ Admin duyệt.");
      setForm({ title: "", description: "", price: "", categoryId: "" });
      loadData();
    } else {
      setMessage("Có lỗi xảy ra, thử lại.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/teacher/${user.id}/courses/${courseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa khóa học thành công");
        loadData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/teacher/${user.id}/courses/${courseId}/toggle-visibility`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveStudent = async (enrollmentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa học viên khỏi khóa học này?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/teacher/${user.id}/enrollments/${enrollmentId}`, {
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
  const handleExportStudents = () => {
    const columns = [
      { key: "studentName", label: "Họ và tên" },
      { key: "studentEmail", label: "Email" },
      { key: "studentPhone", label: "Số điện thoại" },
      { key: "courseTitle", label: "Khóa học đăng ký" },
      { key: "progressText", label: "Tiến độ hoàn thành" },
      { key: "quizSummary", label: "Kết quả Quiz" },
    ];
    const data = students.map((s) => ({
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
      { key: "courseTitle", label: "Tên khóa học" },
      { key: "price", label: "Giá niêm yết (VNĐ)" },
      { key: "soldCount", label: "Số lượt đăng ký" },
      { key: "totalRevenue", label: "Tổng doanh thu (VNĐ)" },
      { key: "teacherEarnings", label: "Thực nhận 80% (VNĐ)" },
    ];
    const data = (revenue?.coursesBreakdown || []).map((r) => ({
      courseTitle: r.courseTitle,
      price: r.price?.toLocaleString("vi-VN"),
      soldCount: r.soldCount,
      totalRevenue: r.totalRevenue?.toLocaleString("vi-VN"),
      teacherEarnings: r.teacherEarnings?.toLocaleString("vi-VN"),
    }));
    setExportColumns(columns);
    setExportData(data);
    setExportFilename(`Bao_Cao_Doanh_Thu_${user?.name || "GV"}`);
    setExportTitle("BÁO CÁO TỔNG KẾT DOANH THU KHÓA HỌC");
    setExportSubtitle(`Giảng viên: ${user?.name || ""} - Nền tảng LearnUp`);
    setIsExportOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Trang Giảng Viên</h1>
          <p className="text-sm text-gray-500">
            Xin chào, {user?.name} ({user?.email})
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b mb-6 space-x-2">
        <button
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          Khóa học của tôi
        </button>
        <button
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "students" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("students")}
        >
          Quản lý học viên ({students.length})
        </button>
        <button
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "revenue" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("revenue")}
        >
          Thống kê & Doanh thu
        </button>
      </div>

      {/* TAB 1: KHÓA HỌC */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Tạo khóa học mới</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Tên khóa học"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="description"
                placeholder="Mô tả khóa học"
                required
                value={form.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="price"
                  placeholder="Giá (VNĐ)"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                />
                <select
                  name="categoryId"
                  required
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {message && <p className="text-sm text-blue-600">{message}</p>}

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 transition"
              >
                Tạo khóa học
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-4">Danh sách khóa học ({courses.length})</h2>
            <div className="grid grid-cols-1 gap-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-xl p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-900">{c.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {c.category?.name} · {c.price?.toLocaleString("vi-VN")} đ
                      <span className="mx-2">•</span>
                      <span className="font-medium text-blue-600">{c.enrollmentCount} học viên đăng ký</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                        c.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : c.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : c.status === "hidden"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.status === "approved"
                        ? "Đang hiển thị"
                        : c.status === "hidden"
                          ? "Đang ẩn"
                          : c.status === "pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                    </span>

                    <Link
                      to={`/teacher/courses/${c.id}`}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100"
                    >
                      Nội dung & Bài học
                    </Link>

                    {c.status === "approved" && (
                      <button
                        onClick={() => handleToggleVisibility(c.id)}
                        className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded border hover:bg-gray-100"
                      >
                        Ẩn
                      </button>
                    )}
                    {c.status === "hidden" && (
                      <button
                        onClick={() => handleToggleVisibility(c.id)}
                        className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded border hover:bg-green-100"
                      >
                        Mở lại
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-gray-400 text-sm">Chưa có khóa học nào.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HỌC VIÊN */}
      {activeTab === "students" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-lg">Quản lý & Tiến độ học viên ({students.length})</h2>
              <p className="text-xs text-gray-500">Theo dõi tiến độ học tập và kết quả bài kiểm tra Quiz</p>
            </div>
            <button
              onClick={handleExportStudents}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm"
            >
              <span>📥</span>
              <span>Xuất Báo Cáo Học Viên</span>
            </button>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
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
                {students.map((s) => (
                  <tr key={s.enrollmentId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.student?.name}</div>
                      <div className="text-gray-500 text-xs">{s.student?.email} · {s.student?.phone || "SĐT: —"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{s.course?.title}</div>
                      <div className="text-gray-500 text-xs">{s.course?.categoryName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${s.progressPercent || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{s.progressPercent || 0}%</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.completedLessons || 0}/{s.totalLessons || 0} bài học</div>
                    </td>
                    <td className="px-4 py-3">
                      {s.quizzesTaken > 0 ? (
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            s.passedQuizzes > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            Đạt {s.passedQuizzes}/{s.quizzesTaken} bài
                          </span>
                          <div className="text-xs text-gray-500 mt-0.5">Điểm TB: {s.avgScore}đ</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa làm bài</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemoveStudent(s.enrollmentId)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-lg">Báo cáo doanh thu & Hiệu suất bán khóa học</h2>
              <p className="text-xs text-gray-500">Tỷ lệ phân chia: Giảng viên 80% - Sàn đào tạo LearnUp 20%</p>
            </div>
            <button
              onClick={handleExportRevenue}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm"
            >
              <span>📥</span>
              <span>Xuất Báo Cáo Doanh Thu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Tổng lượt mua / đăng ký</div>
              <div className="text-3xl font-bold text-gray-900">{revenue.totalCoursesSold}</div>
            </div>
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-1">Tổng doanh số (Gross)</div>
              <div className="text-3xl font-bold text-green-600">
                {revenue.totalGrossRevenue?.toLocaleString("vi-VN")} ₫
              </div>
            </div>
            <div className="bg-white p-6 border rounded-xl shadow-sm bg-blue-50 border-blue-100">
              <div className="text-blue-800 text-sm font-medium mb-1">Thực nhận giảng viên (80%)</div>
              <div className="text-3xl font-bold text-blue-600">
                {revenue.teacherNetEarnings?.toLocaleString("vi-VN")} ₫
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-4">Chi tiết từng khóa học</h3>
          <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Khóa học</th>
                  <th className="px-4 py-3 font-semibold text-right text-gray-700">Giá bán</th>
                  <th className="px-4 py-3 font-semibold text-center text-gray-700">Lượt đăng ký</th>
                  <th className="px-4 py-3 font-semibold text-right text-gray-700">Tổng doanh thu</th>
                  <th className="px-4 py-3 font-semibold text-right text-blue-600">Thực nhận 80%</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {revenue.coursesBreakdown?.map((r) => (
                  <tr key={r.courseId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.courseTitle}</td>
                    <td className="px-4 py-3 text-right">{r.price?.toLocaleString("vi-VN")} ₫</td>
                    <td className="px-4 py-3 text-center font-medium">{r.soldCount}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{r.totalRevenue?.toLocaleString("vi-VN")} ₫</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">
                      {r.teacherEarnings?.toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                ))}
                {(!revenue.coursesBreakdown || revenue.coursesBreakdown.length === 0) && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      Chưa có phát sinh doanh thu nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
