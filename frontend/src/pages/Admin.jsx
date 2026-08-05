import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const API = "http://localhost:8080/api";

const adminMenuItems = [
  {
    key: "courses",
    label: "Quản lý khóa học",
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    key: "students",
    label: "Quản lý học viên",
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
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
      </svg>
    ),
  },
  {
    key: "teachers",
    label: "Quản lý giáo viên",
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("courses");
  const [isExpanded, setIsExpanded] = useState(false);

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [modal, setModal] = useState(null);

  const loadAll = () => {
    fetch(`${API}/courses`)
      .then((r) => r.json())
      .then(setCourses);
    fetch(`${API}/users?role=student`)
      .then((r) => r.json())
      .then(setStudents);
    fetch(`${API}/users?role=teacher`)
      .then((r) => r.json())
      .then(setTeachers);
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then(setCategories);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ===== COURSE ACTIONS =====
  const handleApprove = async (id) => {
    await fetch(`${API}/courses/${id}/approve`, { method: "PUT" });
    loadAll();
  };
  const handleReject = async (id) => {
    await fetch(`${API}/courses/${id}/reject`, { method: "PUT" });
    loadAll();
  };
  const handleDeleteCourse = async (id) => {
    if (!confirm("Xóa khóa học này? Không thể hoàn tác.")) return;
    await fetch(`${API}/courses/${id}`, { method: "DELETE" });
    loadAll();
  };
  const handleSaveCourse = async (form) => {
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      teacher: form.teacherId ? { id: Number(form.teacherId) } : null,
      category: form.categoryId ? { id: Number(form.categoryId) } : null,
    };
    if (modal.mode === "add") {
      await fetch(`${API}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${API}/courses/${modal.data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setModal(null);
    loadAll();
  };

  // ===== USER ACTIONS =====
  const handleDeleteUser = async (id) => {
    if (!confirm("Xóa tài khoản này? Không thể hoàn tác.")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    loadAll();
  };
  const handleSaveUser = async (form, role) => {
    if (modal.mode === "add") {
      await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
        }),
      });
    } else {
      const body = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      await fetch(`${API}/users/${modal.data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setModal(null);
    loadAll();
  };

  const pendingCourses = courses.filter((c) => c.status === "pending");
  const otherCourses = courses.filter((c) => c.status !== "pending");

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Nút Toggle Sidebar */}
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

      {/* SIDEBAR ADMIN */}
      <aside
        className={`group fixed top-16 left-0 z-40 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col justify-between py-3 px-2 shadow-sm ${
          isExpanded ? "w-60" : "w-16 hover:w-60"
        }`}
      >
        <div className="space-y-2 mt-2 w-full">
          {adminMenuItems.map((item) => {
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
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
              </button>
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

      {/* NỘI DUNG CHÍNH */}
      <main
        className={`flex-1 transition-all duration-300 pr-6 py-8 ${isExpanded ? "pl-64" : "pl-20"}`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1E4FD8]">
              Trang Quản trị viên
            </h1>
            <p className="text-sm text-gray-500">
              Xin chào, {user?.name} ({user?.email})
            </p>
          </div>

          {/* ===== TAB: KHÓA HỌC ===== */}
          {tab === "courses" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">
                  Chờ duyệt ({pendingCourses.length})
                </h2>
              </div>
              <div className="space-y-3 mb-10">
                {pendingCourses.map((c) => (
                  <div key={c.id} className="border bg-white rounded-xl p-4">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-500 mb-3">
                      {c.description} — {c.category?.name} —{" "}
                      {(c.price || 0).toLocaleString("vi-VN")} đ
                      {c.teacher?.name && ` — GV: ${c.teacher.name}`}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(c.id)}
                        className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-full font-semibold"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(c.id)}
                        className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-full font-semibold"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
                {pendingCourses.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    Không có khóa học nào chờ duyệt.
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">
                  Tất cả khóa học ({otherCourses.length})
                </h2>
                <button
                  onClick={() =>
                    setModal({ type: "course", mode: "add", data: null })
                  }
                  className="bg-[#1E4FD8] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#173FB0] transition"
                >
                  + Thêm khóa học
                </button>
              </div>
              <div className="space-y-2">
                {otherCourses.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center border bg-white rounded-xl p-3"
                  >
                    <div>
                      <span className="text-sm font-medium">{c.title}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {c.category?.name} —{" "}
                        {(c.price || 0).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          c.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.status}
                      </span>
                      <button
                        onClick={() =>
                          setModal({ type: "course", mode: "edit", data: c })
                        }
                        className="text-xs font-semibold text-[#1E4FD8] hover:underline px-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="text-xs font-semibold text-red-600 hover:underline px-2"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== TAB: HỌC VIÊN ===== */}
          {tab === "students" && (
            <UserTable
              title="Học viên"
              users={students}
              onAdd={() =>
                setModal({
                  type: "user",
                  mode: "add",
                  data: null,
                  role: "student",
                })
              }
              onEdit={(u) =>
                setModal({
                  type: "user",
                  mode: "edit",
                  data: u,
                  role: "student",
                })
              }
              onDelete={handleDeleteUser}
            />
          )}

          {/* ===== TAB: GIÁO VIÊN ===== */}
          {tab === "teachers" && (
            <UserTable
              title="Giáo viên"
              users={teachers}
              onAdd={() =>
                setModal({
                  type: "user",
                  mode: "add",
                  data: null,
                  role: "teacher",
                })
              }
              onEdit={(u) =>
                setModal({
                  type: "user",
                  mode: "edit",
                  data: u,
                  role: "teacher",
                })
              }
              onDelete={handleDeleteUser}
            />
          )}

          {/* ===== MODAL ===== */}
          {modal?.type === "course" && (
            <CourseModal
              mode={modal.mode}
              data={modal.data}
              teachers={teachers}
              categories={categories}
              onClose={() => setModal(null)}
              onSave={handleSaveCourse}
            />
          )}
          {modal?.type === "user" && (
            <UserModal
              mode={modal.mode}
              data={modal.data}
              role={modal.role}
              onClose={() => setModal(null)}
              onSave={(form) => handleSaveUser(form, modal.role)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ================= SUB-COMPONENTS =================

function UserTable({ title, users, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">
          {title} ({users.length})
        </h2>
        <button
          onClick={onAdd}
          className="bg-[#1E4FD8] text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-[#173FB0] transition"
        >
          + Thêm {title.toLowerCase()}
        </button>
      </div>
      <div className="border bg-white rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Tên</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">SĐT</th>
              <th className="px-4 py-2 font-medium w-28"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-gray-500">{u.email}</td>
                <td className="px-4 py-2 text-gray-500">{u.phone || "—"}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onEdit(u)}
                    className="text-xs font-semibold text-[#1E4FD8] hover:underline px-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(u.id)}
                    className="text-xs font-semibold text-red-600 hover:underline px-2"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Chưa có {title.toLowerCase()} nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-[#0F172A]">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CourseModal({ mode, data, teachers, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    title: data?.title || "",
    description: data?.description || "",
    price: data?.price || "",
    teacherId: data?.teacher?.id || "",
    categoryId: data?.category?.id || "",
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <ModalShell
      title={mode === "add" ? "Thêm khóa học" : "Sửa khóa học"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-3"
      >
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Tên khóa học *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Mô tả
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Giá (đ)
            </label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Danh mục
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg bg-white"
            >
              <option value="">-- Chọn --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Giáo viên phụ trách
          </label>
          <select
            value={form.teacherId}
            onChange={(e) => update("teacherId", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg bg-white"
          >
            <option value="">-- Chọn --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-[#1E4FD8] text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-[#173FB0]"
          >
            Lưu
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function UserModal({ mode, data, role, onClose, onSave }) {
  const [form, setForm] = useState({
    name: data?.name || "",
    email: data?.email || "",
    password: "",
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const roleLabel = role === "student" ? "học viên" : "giáo viên";

  return (
    <ModalShell
      title={mode === "add" ? `Thêm ${roleLabel}` : `Sửa ${roleLabel}`}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-3"
      >
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Họ và tên *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Email *
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Mật khẩu {mode === "add" ? "*" : "(để trống nếu không đổi)"}
          </label>
          <input
            required={mode === "add"}
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-[#1E4FD8] text-white text-sm font-bold px-6 py-2 rounded-full hover:bg-[#173FB0]"
          >
            Lưu
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
