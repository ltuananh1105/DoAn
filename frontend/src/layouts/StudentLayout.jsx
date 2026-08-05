import { Outlet, Link, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/student", label: "Overview", icon: "🎯" },
  { path: "/student/courses", label: "My courses", icon: "📚" },
];

export default function StudentLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="group fixed top-0 left-0 z-40 h-screen w-16 hover:w-60 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col justify-between p-3 shadow-md">
        <div className="space-y-2 mt-16">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors whitespace-nowrap overflow-hidden ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600 font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          <span>🏠</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Trang chủ
          </span>
        </Link>
      </aside>

      <main className="flex-1 pl-16">
        <Outlet />
      </main>
    </div>
  );
}
