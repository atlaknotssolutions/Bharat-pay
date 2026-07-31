
import { Menu } from "lucide-react"

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-indigo-500/20">
            A
          </div>
          <span className="hidden sm:inline font-medium text-gray-200">
            Aditya
          </span>
        </div>
      </div>
    </header>
  )
}