import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag, Package, Settings, LogOut } from 'lucide-react'

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/category", icon: LayoutDashboard, label: "Category" },
  // { to: "/subcategory", icon: LayoutDashboard, label: "Subcategory" },
  { to: "/alluser", icon: Users, label: "Users" },
  // { to: "/alluser", icon: Users, label: "Users" },
  { to: "/video", icon: Package, label: "Video" },
  { to: "/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/products", icon: Package, label: "Products" },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-gray-200 md:fixed md:inset-y-0">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold text-indigo-600">AdminX</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t">
        <button className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  )
}