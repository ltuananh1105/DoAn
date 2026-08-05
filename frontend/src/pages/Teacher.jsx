import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Teacher() {
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
  });
  const [message, setMessage] = useState("");

  const loadData = () => {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((data) =>
        setCourses(data.filter((c) => c.teacher?.id === user.id)),
      );

    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Trang Giáo viên</h1>
          <p className="text-sm text-gray-500">
            Xin chào, {user?.name} ({user?.email})
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5 mb-8">
        <h2 className="font-bold text-lg mb-4">Tạo khóa học mới</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Tên khóa học"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Mô tả khóa học"
            required
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="price"
              placeholder="Giá (VNĐ)"
              required
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <select
              name="categoryId"
              required
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
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
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold"
          >
            Tạo khóa học
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4">
          Khóa học của tôi ({courses.length})
        </h2>
        <div className="space-y-3">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/teacher/courses/${c.id}`}
              className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-500">
                  {c.category?.name} · {c.price?.toLocaleString("vi-VN")} đ
                </div>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  c.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : c.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {c.status}
              </span>
            </Link>
          ))}
          {courses.length === 0 && (
            <p className="text-gray-400 text-sm">Chưa có khóa học nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
