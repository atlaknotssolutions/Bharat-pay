import {
  DollarSign,
  TrendingUp,
  Wallet,
  CreditCard,
  Clock,
  Eye,
} from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

const StatCard = ({ title, value, change, icon: Icon, color, bg }) => (
  <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {change && (
          <p
            className={`text-xs font-medium mt-2 flex items-center gap-1 ${
              change.startsWith("+") ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {change} from last week
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </div>
);

export default function FinanceDashboard() {
  const { data, generatedAt, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Loading finance dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const snapshot = data?.snapshot || {};

  return (
    <div className="space-y-7 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance Dashboard</h1>
          <p className="text-gray-400 mt-0.5">
            💰 Financial Overview & Analytics
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>Finance Module</span>
        </div>
      </div>

      {/* Finance Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value="₹1,24,890"
          change="+12.5%"
          icon={DollarSign}
          color="text-emerald-400"
          bg="bg-emerald-500/15"
        />
        <StatCard
          title="Pending Payments"
          value="₹45,320"
          change="-2.1%"
          icon={Wallet}
          color="text-amber-400"
          bg="bg-amber-500/15"
        />
        <StatCard
          title="Total Transactions"
          value={`${stats.totalVideos || 0}`}
          icon={CreditCard}
          color="text-blue-400"
          bg="bg-blue-500/15"
        />
      </div>

      {/* Finance Info Box */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Financial Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Average Transaction</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">₹2,456</p>
          </div>
          <div>
            <p className="text-gray-500">Success Rate</p>
            <p className="text-xl font-bold text-blue-400 mt-1">98.5%</p>
          </div>
          <div>
            <p className="text-gray-500">Active Users</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">
              {stats.activeUsers || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Platform Fees Collected</p>
            <p className="text-xl font-bold text-amber-400 mt-1">₹12,450</p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8">
        ✅ Finance module - restricted to finance admins only
      </p>
    </div>
  );
}
