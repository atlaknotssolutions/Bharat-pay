import { Menu } from 'lucide-react'

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
            A
          </div>
          <span className="hidden sm:inline font-medium">Aditya</span>
        </div>
      </div>
    </header>
  )
}