import { BarChart3, Users, ShoppingCart, DollarSign } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Aditya</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Revenue" value="₹1,24,890" icon={DollarSign} color="bg-green-500" />
        <StatCard title="New Orders" value="342" icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Active Users" value="2,847" icon={Users} color="bg-purple-500" />
        <StatCard title="Conversion Rate" value="4.8%" icon={BarChart3} color="bg-amber-500" />
      </div>

      {/* You can add charts, tables, recent orders etc here */}

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to show yet...</p>
      </div>

    </div>
  )
}