import {
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import useDashboardData from "../../../hooks/useDashboardData";

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

export default function SupportDashboard() {
  const { data, generatedAt, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Loading support dashboard...</p>
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
          <h1 className="text-2xl font-bold text-white">Support Dashboard</h1>
          <p className="text-gray-400 mt-0.5">
            🎧 Support Tickets & User Assistance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>Support Module</span>
        </div>
      </div>

      {/* Support Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Open Tickets"
          value="24"
          change="+5.2%"
          icon={AlertCircle}
          color="text-red-400"
          bg="bg-red-500/15"
        />
        <StatCard
          title="Resolved Today"
          value="18"
          change="+8.3%"
          icon={CheckCircle}
          color="text-emerald-400"
          bg="bg-emerald-500/15"
        />
        <StatCard
          title="Avg Response Time"
          value="15m"
          change="-2.1%"
          icon={Clock}
          color="text-blue-400"
          bg="bg-blue-500/15"
        />
      </div>

      {/* Support Info Box */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Support Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Customer Satisfaction</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">4.8/5.0</p>
          </div>
          <div>
            <p className="text-gray-500">Resolution Rate</p>
            <p className="text-xl font-bold text-blue-400 mt-1">94.2%</p>
          </div>
          <div>
            <p className="text-gray-500">Active Users Helped</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">
              {stats.activeUsers || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Escalations This Week</p>
            <p className="text-xl font-bold text-amber-400 mt-1">3</p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8">
        ✅ Support module - restricted to support admins only
      </p>
    </div>
  );
}
