import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PaymentModal from "../components/PaymentModal.jsx";

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState([]);

  // Payment modal state
  const [payModal, setPayModal] = useState(null); // { courseId, course }
  const [paying, setPaying] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const loadCourses = () => {
    fetch("/api/courses/public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const approved = data;
          setCourses(approved);
          // Lấy danh sách danh mục duy nhất
          const cats = [];
          const seen = new Set();
          approved.forEach((c) => {
            if (c.category?.id && !seen.has(c.category.id)) {
              seen.add(c.category.id);
              cats.push(c.category);
            }
          });
          setCategories(cats);
        } else {
          setCourses([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi load courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
    if (user?.id && user?.role === "student") {
      fetch(`/api/students/${user.id}/enrollments`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setEnrolledIds(
              data.filter((e) => e.course && e.course.id).map((e) => e.course.id)
            );
          }
        })
        .catch(console.error);
    }
  }, [user]);

  // Mở hộp xác nhận thanh toán demo
  const handleEnroll = (courseId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const course = courses.find((c) => c.id === courseId);
    setPayModal({ courseId, course });
  };

  // Tạo đơn hàng demo
  const createOrder = async (courseId) => {
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: user.id, courseId }),
    });
    return await orderRes.json();
  };

  // Thanh toán demo và kích hoạt quyền học
  const handleDemoPay = async () => {
    if (!payModal) return;
    setPaying(true);
    try {
      const orderData = await createOrder(payModal.courseId);
      if (!orderData.success) throw new Error(orderData.message || "Không thể tạo đơn demo.");
      const paymentRes = await fetch(`/api/orders/${orderData.orderId}/demo-pay`, { method: "POST" });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.success) throw new Error(paymentData.message || "Không thể hoàn tất thanh toán demo.");
      setEnrolledIds((ids) => [...ids, payModal.courseId]);
      setPayModal(null);
      alert("Thanh toán demo thành công. Khóa học đã được kích hoạt!");
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra.");
    } finally {
      setPaying(false);
    }
  };

  // Lọc & tìm kiếm phía client
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !searchTerm ||
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        !selectedCategory || String(c.category?.id) === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [courses, searchTerm, selectedCategory]);

  return (
    <div className="app-container page-section">
      <p className="text-sm font-semibold text-blue-700">DANH MỤC ĐÀO TẠO</p>
      <h1 className="page-heading mt-2">Khám phá khóa học</h1>
      <p className="page-description mb-7">Chọn khóa học phù hợp với mục tiêu và trình độ của bạn.</p>

      {/* THANH TÌM KIẾM & LỌC */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học, giảng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
          />
        </div>

        {/* Lọc theo danh mục */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white text-gray-700 min-w-[180px]"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Kết quả */}
        {(searchTerm || selectedCategory) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredCourses.length} kết quả
            </span>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-[#0F172A]/50">Đang tải khóa học...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <article key={course.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
              <div className="flex h-28 items-end border-b border-slate-200 bg-slate-100 p-4">
                <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  {course.category?.name || "Chưa phân loại"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
              <span className="text-xs text-slate-500 mb-2">
                Giảng viên: {course.teacher?.name || "LearnUp"}
              </span>
              <span className="sr-only">
                {course.category?.name || "Chưa phân loại"}
              </span>
              <Link to={`/courses/${course.id}`} className="font-semibold text-lg text-slate-900 mb-2 hover:text-blue-700 transition">
                {course.title}
              </Link>
              <p className="text-sm text-[#0F172A]/60 mb-4 line-clamp-2">{course.description}</p>
              <p className="text-base font-bold text-slate-900 mb-4">
                {course.price?.toLocaleString("vi-VN")} đ
              </p>

              {!user && (
                <Link
                  to="/login"
                  className="ui-button ui-button-primary mt-auto w-full"
                >
                  Đăng nhập để đăng ký
                </Link>
              )}
              {user?.role === "student" && (
                <button
                  onClick={() => !isEnrolled && handleEnroll(course.id)}
                  disabled={isEnrolled}
                  className={`mt-auto text-sm font-bold py-2.5 rounded-full transition ${
                    isEnrolled
                      ? "bg-green-50 border border-green-200 text-green-700 cursor-default"
                      : "bg-blue-700 text-white hover:bg-blue-800"
                  }`}
                >
                  {isEnrolled ? "Đã đăng ký ✓" : "Đăng ký học"}
                </button>
              )}
              {user && user.role !== "student" && (
                <Link
                  to={`/courses/${course.id}`}
                  className="ui-button ui-button-secondary mt-auto w-full"
                >
                  Xem chi tiết
                </Link>
              )}
              </div>
            </article>
          );
        })}
      </div>

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-[#0F172A]/50 mb-2">
            {searchTerm || selectedCategory
              ? `Không tìm thấy khóa học nào phù hợp với bộ lọc.`
              : "Chưa có khóa học nào được duyệt."}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
              className="text-blue-600 font-semibold text-sm hover:underline"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={!!payModal}
        course={payModal?.course}
        onClose={() => setPayModal(null)}
        onConfirm={handleDemoPay}
        loading={paying}
      />
    </div>
  );
}
