import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const OCCUPATIONS = [
  "Học sinh",
  "Undergraduate",
  "Sau đại học",
  "Đã đi làm",
  "Khác",
];
const COUNTRIES = ["Việt Nam", "Khác"];
const VN_PROVINCES = [
  "Hà Nội",
  "Hải Phòng",
  "Lai Châu",
  "Điện Biên",
  "Sơn La",
  "Lào Cai",
  "Tuyên Quang",
  "Cao Bằng",
  "Lạng Sơn",
  "Thái Nguyên",
  "Phú Thọ",
  "Bắc Ninh",
  "Quảng Ninh",
  "Hưng Yên",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Huế",
  "Đà Nẵng",
  "Quảng Ngãi",
  "Gia Lai",
  "Đắk Lắk",
  "Khánh Hòa",
  "Lâm Đồng",
  "TP. Hồ Chí Minh",
  "Đồng Nai",
  "Tây Ninh",
  "Cần Thơ",
  "Vĩnh Long",
  "Đồng Tháp",
  "An Giang",
  "Cà Mau",
];

export default function Settings() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState("profile");

  const [form, setForm] = useState({
    name: user?.name || "",
    dateOfBirth: user?.dateOfBirth || "",
    phone: user?.phone || "",
    occupation: user?.occupation || "",
    country: user?.country || "",
    province: user?.province || "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMsg, setPwMsg] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      setProfileMsg("Đã lưu thay đổi.");
      const updatedUser = { ...user, ...form };
      localStorage.setItem("learnup_auth", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
    } else {
      setProfileMsg(data.message || "Có lỗi xảy ra.");
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg("Mật khẩu mới nhập lại không khớp.");
      return;
    }

    setSavingPw(true);
    const res = await fetch(
      `/api/users/${user.id}/password`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      },
    );
    const data = await res.json();

    setPwMsg(data.message);
    if (data.success) {
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setSavingPw(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6">
      {/* SIDEBAR */}
      <aside className="w-full md:w-56 shrink-0">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">
          Tài khoản
        </p>
        <nav className="space-y-1">
          <button
            onClick={() => setTab("profile")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              tab === "profile"
                ? "bg-[#EAF1FF] text-[#1E4FD8]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Hồ sơ
          </button>
          <button
            onClick={() => setTab("password")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              tab === "password"
                ? "bg-[#EAF1FF] text-[#1E4FD8]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Đổi mật khẩu
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 bg-white border rounded-2xl p-6">
        {tab === "profile" && (
          <>
            <h1 className="font-bold text-lg text-[#0F172A] mb-6">Hồ sơ</h1>
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border px-3 py-2 rounded-lg bg-gray-100 text-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+84..."
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Nghề nghiệp
                  </label>
                  <select
                    value={form.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg bg-white"
                  >
                    <option value="">-- Chọn --</option>
                    {OCCUPATIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Quốc gia
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg bg-white"
                  >
                    <option value="">-- Chọn --</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Tỉnh thành
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    disabled={form.country !== "Việt Nam"}
                    className="w-full border px-3 py-2 rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">-- Chọn --</option>
                    {VN_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {profileMsg && (
                <p className="text-sm text-[#1E4FD8]">{profileMsg}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-[#1E4FD8] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#173FB0] transition disabled:opacity-60"
                >
                  {savingProfile ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </>
        )}

        {tab === "password" && (
          <>
            <h1 className="font-bold text-lg text-[#0F172A] mb-6">
              Đổi mật khẩu
            </h1>
            <form
              onSubmit={handleChangePassword}
              className="space-y-4 max-w-md"
            >
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={(e) =>
                    setPwForm((f) => ({
                      ...f,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={pwForm.newPassword}
                  onChange={(e) =>
                    setPwForm((f) => ({ ...f, newPassword: e.target.value }))
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) =>
                    setPwForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              {pwMsg && <p className="text-sm text-[#1E4FD8]">{pwMsg}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPw}
                  className="bg-[#1E4FD8] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#173FB0] transition disabled:opacity-60"
                >
                  {savingPw ? "Đang lưu..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
