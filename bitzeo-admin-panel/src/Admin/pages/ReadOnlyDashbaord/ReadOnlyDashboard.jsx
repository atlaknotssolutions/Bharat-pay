import { Eye, Users, Video, TrendingUp, Clock } from "lucide-react";
import useDashboardData from "../../../hooks/useDashboardData";

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </div>
);

export default function ReadOnlyDashboard() {
  const { data, generatedAt, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">
            Loading read-only dashboard...
          </p>
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
          <h1 className="text-2xl font-bold text-white">Read-Only Dashboard</h1>
          <p className="text-gray-400 mt-0.5">
            👁️ View-Only Access - No Modifications
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <Eye className="w-4 h-4" />
          <span>Read-Only Mode</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={(stats.activeUsers ?? 0).toLocaleString()}
          icon={Users}
          color="text-violet-400"
          bg="bg-violet-500/15"
        />
        <StatCard
          title="Videos Uploaded"
          value={(stats.totalVideos ?? 0).toLocaleString()}
          icon={Video}
          color="text-blue-400"
          bg="bg-blue-500/15"
        />
        <StatCard
          title="Total Views"
          value={(snapshot.totalViews ?? 0).toLocaleString()}
          icon={Eye}
          color="text-emerald-400"
          bg="bg-emerald-500/15"
        />
        <StatCard
          title="Watch Hours"
          value={`${snapshot.watchTime ?? 0}h`}
          icon={Clock}
          color="text-amber-400"
          bg="bg-amber-500/15"
        />
      </div>

      {/* Info Box */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <div className="flex items-start gap-4">
          <Eye className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Read-Only Access
            </h2>
            <p className="text-gray-400 text-sm">
              You have view-only access to the platform. You can see all
              statistics, user data, and content information, but cannot make
              any modifications. All editing features are disabled for your
              protection.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400">
                ✓ View all statistics and metrics
              </p>
              <p className="text-sm text-gray-400">✓ Access user information</p>
              <p className="text-sm text-gray-400">
                ✓ View content and uploads
              </p>
              <p className="text-sm text-gray-400">
                ✗ Cannot edit or modify data
              </p>
              <p className="text-sm text-gray-400">✗ Cannot delete content</p>
              <p className="text-sm text-gray-400">✗ Cannot manage users</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8">
        ✅ Read-Only mode - limited access for viewing purposes only
      </p>
    </div>
  );
}
