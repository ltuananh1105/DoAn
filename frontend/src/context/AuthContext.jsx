import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "learnup_auth";
const TOKEN_KEY = "learnup_token";
const API_BASE = "/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && localStorage.getItem(TOKEN_KEY)) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async ({ name, email, password, role }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) throw new Error("Đăng ký thất bại");

    const data = await res.json();
    if (data.success === false) throw new Error(data.message || "Đăng ký thất bại");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);

    // Xóa đúng Key "learnup_auth" đã dùng để lưu
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);

    // Xóa dọn dẹp các key phụ khác nếu có
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong AuthProvider");
  return ctx;
}
