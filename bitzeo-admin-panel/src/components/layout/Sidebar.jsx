import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  LogOut,
  FolderOpen,
  Video,
  Box,
  Clapperboard,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api";
import { clearAdminState } from "../../utils/session";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/category", icon: FolderOpen, label: "Category" },
  { to: "/create-employee", icon: Package, label: "Add Employee" },
  { to: "/alluser", icon: Users, label: "Users" },
  { to: "/video", icon: Video, label: "Video" },
  { to: "/shorts", icon: Clapperboard, label: "Shorts" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/products", icon: Box, label: "Products" },
];

const getAdminDisplayName = () => {
  try {
    const savedUser = JSON.parse(localStorage.getItem("adminUser") || "null");
    return savedUser?.name || "Admin";
  } catch {
    return "Admin";
  }
};

const getInitials = (name) => {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "A";
};

export default function Sidebar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(getAdminDisplayName());

  useEffect(() => {
    const syncUser = () => setUserName(getAdminDisplayName());
    syncUser();
    window.addEventListener("auth-change", syncUser);
    return () => window.removeEventListener("auth-change", syncUser);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/admin/logout", {}).catch(() => {});
    } catch (_) {
      // ignore network errors; always clear local state
    }

    clearAdminState();

    toast.success("Logged out successfully!", {
      style: {
        background: "#1f2937",
        color: "#f9fafb",
        border: "1px solid #374151",
      },
    });

    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:bg-gray-950 md:border-r md:border-gray-800 md:fixed md:inset-y-0 z-30">
      <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Bharat<span className="text-indigo-400">Play</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-200 border border-transparent"
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="flex items-center gap-3 mb-3 rounded-lg bg-gray-900/70 border border-gray-800 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(userName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {userName}
            </p>
            <p className="text-[11px] text-gray-400">Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
