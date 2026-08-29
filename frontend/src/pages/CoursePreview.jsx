import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PaymentModal from "../components/PaymentModal.jsx";

export default function CoursePreview() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessonsByChapter, setLessonsByChapter] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Payment modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetch(`http://localhost:8080/api/courses/${courseId}/chapters`)
      .then((res) => res.json())
      .then(async (chs) => {
        if (Array.isArray(chs)) {
          setChapters(chs);
          const entries = await Promise.all(
            chs.map((ch) =>
              fetch(`http://localhost:8080/api/chapters/${ch.id}/lessons`)
                .then((res) => res.json())
                .then((lessons) => [ch.id, Array.isArray(lessons) ? lessons : []])
                .catch(() => [ch.id, []])
            )
          );
          setLessonsByChapter(Object.fromEntries(entries));
        } else {
          setChapters([]);
        }
      })
      .catch(console.error);

    if (user?.id && user?.role === "student") {
      fetch(`http://localhost:8080/api/orders/check?studentId=${user.id}&courseId=${courseId}`)
        .then((res) => res.json())
        .then((data) => setIsEnrolled(data.enrolled || data.purchased))
        .catch(() => {
          fetch(`http://localhost:8080/api/students/${user.id}/enrollments`)
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) {
                setIsEnrolled(data.some((e) => e.course?.id === Number(courseId)));
              }
            })
            .catch(console.error);
        });
    }
  }, [courseId, user]);

  const totalLessons = Object.values(lessonsByChapter).reduce(
    (sum, l) => sum + (Array.isArray(l) ? l.length : 0),
    0
  );

  const handleEnrollClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowPayModal(true);
  };

  const createOrder = async () => {
    const orderRes = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: user.id, courseId }),
    });
    return await orderRes.json();
  };

  // Thanh toán VNPay
  const handleVNPay = async () => {
    setPaying(true);
    try {
      const orderData = await createOrder();
      if (!orderData.success) {
        alert(orderData.message || "Không thể tạo đơn hàng, vui lòng thử lại.");
        setPaying(false);
        return;
      }
      if (orderData.paymentUrl) {
        window.location.href = orderData.paymentUrl;
        return;
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setPaying(false);
  };

  // Thanh toán Demo
  const handleDemoPay = async () => {
    setPaying(true);
    try {
      const orderData = await createOrder();
      if (!orderData.success) {
        alert(orderData.message || "Không thể tạo đơn hàng, vui lòng thử lại.");
        setPaying(false);
        return;
      }
      await fetch(`http://localhost:8080/api/orders/${orderData.orderId}/demo-pay`, {
        method: "POST",
      });
      setIsEnrolled(true);
      setShowPayModal(false);
      alert("Đăng ký & Kích hoạt khóa học thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setPaying(false);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-14 text-gray-400">Đang tải thông tin khóa học...</div>;
  }

  if (!course || course.error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-14 text-center">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin khóa học.</p>
        <Link to="/courses" className="text-blue-600 font-semibold underline">
          ← Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <Link to="/courses" className="text-sm text-blue-600 mb-4 inline-block font-semibold">
        ← Quay lại danh sách khóa học
      </Link>

      <span className="text-xs font-semibold text-[#1E4FD8] bg-blue-50 px-2.5 py-1 rounded-md">
        {course.category?.name || "Chưa phân loại"}
      </span>
      <h1 className="text-3xl font-extrabold text-[#0F172A] mt-2 mb-3">{course.title}</h1>
      <p className="text-[#0F172A]/70 mb-4 leading-relaxed">{course.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
        <span>
          Giáo viên: <strong className="text-[#0F172A]">{course.teacher?.name || "LearnUp"}</strong>
        </span>
        <span>·</span>
        <span>
          {chapters.length} chương · {totalLessons} bài học
        </span>
      </div>

      {/* NÚT HÀNH ĐỘNG */}
      <div className="mb-10">
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#1E4FD8] text-white font-bold px-8 py-3 rounded-full hover:bg-[#173FB0] transition shadow-md"
          >
            Đăng nhập để đăng ký học
          </button>
        )}

        {user?.role === "student" && !isEnrolled && (
          <button
            onClick={handleEnrollClick}
            className="bg-[#1E4FD8] text-white font-bold px-8 py-3 rounded-full hover:bg-[#173FB0] transition shadow-md"
          >
            Đăng ký học ngay · {course.price?.toLocaleString("vi-VN")} đ
          </button>
        )}

        {user?.role === "student" && isEnrolled && (
          <Link
            to={`/student/courses/${courseId}`}
            className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition shadow-md"
          >
            Vào học ngay ✓
          </Link>
        )}
      </div>

      {/* DANH SÁCH CHƯƠNG */}
      <h2 className="font-bold text-lg mb-4">Nội dung chương trình học</h2>

      {chapters.map((ch) => (
        <div key={ch.id} className="mb-4 border rounded-xl p-4 bg-white shadow-xs">
          <h3 className="font-semibold text-[#0F172A] mb-2">{ch.title}</h3>
          <ul className="space-y-1">
            {(lessonsByChapter[ch.id] || []).map((lesson, idx) => (
              <li key={lesson.id} className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EAF1FF] text-[#1E4FD8] text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {lesson.title}
              </li>
            ))}
            {(lessonsByChapter[ch.id] || []).length === 0 && (
              <li className="text-sm text-gray-400">Chưa có bài học nào.</li>
            )}
          </ul>
        </div>
      ))}

      {chapters.length === 0 && (
        <p className="text-gray-400 text-sm">Khóa học chưa có nội dung chi tiết.</p>
      )}

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={showPayModal}
        course={course}
        onClose={() => setShowPayModal(false)}
        onVNPay={handleVNPay}
        onDemoPay={handleDemoPay}
        loading={paying}
      />
    </div>
  );
}