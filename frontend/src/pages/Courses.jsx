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
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const approved = data.filter((c) => c.status === "approved");
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
      fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
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

  // Mở modal chọn phương thức thanh toán
  const handleEnroll = (courseId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const course = courses.find((c) => c.id === courseId);
    setPayModal({ courseId, course });
  };

  // Tạo đơn hàng chung
  const createOrder = async (courseId) => {
    const orderRes = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: user.id, courseId }),
    });
    return await orderRes.json();
  };

  // Thanh toán VNPay
  const handleVNPay = async () => {
    if (!payModal) return;
    setPaying(true);
    try {
      const orderData = await createOrder(payModal.courseId);
      if (!orderData.success) { alert(orderData.message || "Lỗi tạo đơn."); return; }
      if (orderData.paymentUrl) {
        window.location.href = orderData.paymentUrl;
        return;
      }
    } catch (err) { alert("Có lỗi xảy ra."); }
    setPaying(false);
  };

  // Thanh toán Demo
  const handleDemoPay = async () => {
    if (!payModal) return;
    setPaying(true);
    try {
      const orderData = await createOrder(payModal.courseId);
      if (!orderData.success) { alert(orderData.message || "Lỗi tạo đơn."); return; }
      await fetch(`http://localhost:8080/api/orders/${orderData.orderId}/demo-pay`, { method: "POST" });
      setEnrolledIds((ids) => [...ids, payModal.courseId]);
      setPayModal(null);
      alert("Đăng ký & Kích hoạt khóa học thành công!");
    } catch (err) { alert("Có lỗi xảy ra."); }
    setPaying(false);
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
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Khám phá khóa học</h1>
      <p className="text-[#0F172A]/60 mb-6">Chọn khóa học phù hợp với mục tiêu và trình độ của bạn.</p>

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
            <div key={course.id} className="rounded-2xl border border-black/5 p-5 hover:shadow-lg transition flex flex-col bg-white">
              <span className="text-xs font-semibold text-[#1E4FD8] mb-1">
                {course.category?.name || "Chưa phân loại"}
              </span>
              <Link to={`/courses/${course.id}`} className="font-bold text-lg text-[#0F172A] mb-2 hover:text-[#1E4FD8] transition">
                {course.title}
              </Link>
              <p className="text-sm text-[#0F172A]/60 mb-4 line-clamp-2">{course.description}</p>
              <p className="text-sm font-semibold text-[#0F172A] mb-4">
                {course.price?.toLocaleString("vi-VN")} đ
              </p>

              {!user && (
                <Link
                  to="/login"
                  className="mt-auto block text-center bg-[#1E4FD8] text-white text-sm font-bold py-2.5 rounded-full hover:bg-[#173FB0] transition"
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
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-[#1E4FD8] text-white hover:bg-[#173FB0]"
                  }`}
                >
                  {isEnrolled ? "Đã đăng ký ✓" : "Đăng ký học"}
                </button>
              )}
              {user && user.role !== "student" && (
                <Link
                  to={`/courses/${course.id}`}
                  className="mt-auto block text-center border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-full hover:bg-gray-50"
                >
                  Xem chi tiết
                </Link>
              )}
            </div>
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
        onVNPay={handleVNPay}
        onDemoPay={handleDemoPay}
        loading={paying}
      />
    </div>
  );
}