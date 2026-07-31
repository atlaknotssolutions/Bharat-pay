// import {
//   BarChart3,
//   Users,
//   ShoppingCart,
//   DollarSign,
//   Video,
//   UserPlus,
//   Upload,
//   Eye,
//   TrendingUp,
//   Clock,
//   ArrowUpRight,
//   Play
// } from 'lucide-react'

// const StatCard = ({ title, value, change, icon: Icon, color, bg }) => (
//   <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//     <div className="flex items-start justify-between">
//       <div>
//         <p className="text-sm text-gray-500 font-medium">{title}</p>
//         <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//         {change && (
//           <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
//             <TrendingUp className="w-3.5 h-3.5" />
//             {change} from last week
//           </p>
//         )}
//       </div>
//       <div className={`p-3 rounded-xl ${bg}`}>
//         <Icon className={`w-5 h-5 ${color}`} />
//       </div>
//     </div>
//   </div>
// )

// // Dummy data
// const recentUsers = [
//   { id: 1, name: 'Rahul Sharma', email: 'rahul@email.com', joined: '2h ago', avatar: 'RS', status: 'online' },
//   { id: 2, name: 'Priya Patel', email: 'priya@email.com', joined: '5h ago', avatar: 'PP', status: 'offline' },
//   { id: 3, name: 'Amit Kumar', email: 'amit@email.com', joined: '1d ago', avatar: 'AK', status: 'online' },
//   { id: 4, name: 'Sneha Gupta', email: 'sneha@email.com', joined: '1d ago', avatar: 'SG', status: 'offline' },
//   { id: 5, name: 'Vikram Singh', email: 'vikram@email.com', joined: '2d ago', avatar: 'VS', status: 'online' },
// ]

// const recentVideos = [
//   { id: 1, title: 'React Advanced Patterns', uploadedBy: 'Rahul Sharma', time: '1h ago', views: 1240, duration: '12:40' },
//   { id: 2, title: 'JavaScript ES2024 Features', uploadedBy: 'Priya Patel', time: '3h ago', views: 890, duration: '18:22' },
//   { id: 3, title: 'Node.js Performance Tips', uploadedBy: 'Amit Kumar', time: '6h ago', views: 2104, duration: '09:15' },
//   { id: 4, title: 'Tailwind CSS Masterclass', uploadedBy: 'Sneha Gupta', time: '1d ago', views: 567, duration: '25:08' },
// ]

// const weeklyData = [
//   { day: 'Mon', users: 42, videos: 8 },
//   { day: 'Tue', users: 58, videos: 12 },
//   { day: 'Wed', users: 35, videos: 6 },
//   { day: 'Thu', users: 71, videos: 15 },
//   { day: 'Fri', users: 64, videos: 11 },
//   { day: 'Sat', users: 89, videos: 19 },
//   { day: 'Sun', users: 76, videos: 14 },
// ]

// const maxUsers = Math.max(...weeklyData.map(d => d.users))

// export default function Dashboard() {
//   return (
//     <div className="space-y-7">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500 mt-0.5">Welcome back, Aditya 👋 Here’s what’s happening today</p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
//           <Clock className="w-4 h-4" />
//           <span>Last updated: just now</span>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Revenue"
//           value="₹1,24,890"
//           change="+12.5%"
//           icon={DollarSign}
//           color="text-emerald-600"
//           bg="bg-emerald-50"
//         />
//         <StatCard
//           title="New Orders"
//           value="342"
//           change="+8.2%"
//           icon={ShoppingCart}
//           color="text-blue-600"
//           bg="bg-blue-50"
//         />
//         <StatCard
//           title="Active Users"
//           value="2,847"
//           change="+18.4%"
//           icon={Users}
//           color="text-violet-600"
//           bg="bg-violet-50"
//         />
//         <StatCard
//           title="Videos Uploaded"
//           value="1,284"
//           change="+5.7%"
//           icon={Video}
//           color="text-amber-600"
//           bg="bg-amber-50"
//         />
//       </div>

//       {/* Charts + Activity */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

//         {/* Weekly Chart */}
//         <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Weekly Overview</h2>
//               <p className="text-sm text-gray-500">New users & video uploads</p>
//             </div>
//             <div className="flex items-center gap-4 text-xs">
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-violet-500"></div>
//                 <span className="text-gray-600">Users</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <div className="w-3 h-3 rounded-full bg-blue-400"></div>
//                 <span className="text-gray-600">Videos</span>
//               </div>
//             </div>
//           </div>

//           {/* Simple CSS Bar Chart */}
//           <div className="flex items-end justify-between gap-3 h-48">
//             {weeklyData.map((item) => (
//               <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
//                 <div className="w-full flex items-end justify-center gap-1 h-40">
//                   <div
//                     className="w-3.5 rounded-t-md bg-violet-500 hover:bg-violet-600 transition-all cursor-pointer"
//                     style={{ height: `${(item.users / maxUsers) * 100}%` }}
//                     title={`${item.users} users`}
//                   />
//                   <div
//                     className="w-3.5 rounded-t-md bg-blue-400 hover:bg-blue-500 transition-all cursor-pointer"
//                     style={{ height: `${(item.videos / 20) * 100}%` }}
//                     title={`${item.videos} videos`}
//                   />
//                 </div>
//                 <span className="text-xs font-medium text-gray-500">{item.day}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Stats / Summary */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-5">Today’s Snapshot</h2>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-3.5 bg-violet-50 rounded-xl">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-violet-100 rounded-lg">
//                   <UserPlus className="w-4 h-4 text-violet-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">New Users</p>
//                   <p className="text-xs text-gray-500">Joined today</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-violet-600">24</p>
//             </div>

//             <div className="flex items-center justify-between p-3.5 bg-blue-50 rounded-xl">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Upload className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Videos Uploaded</p>
//                   <p className="text-xs text-gray-500">Uploaded today</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-blue-600">9</p>
//             </div>

//             <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-lg">
//                   <Eye className="w-4 h-4 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Total Views</p>
//                   <p className="text-xs text-gray-500">Across all videos</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-emerald-600">4.8k</p>
//             </div>

//             <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-amber-100 rounded-lg">
//                   <Play className="w-4 h-4 text-amber-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">Watch Time</p>
//                   <p className="text-xs text-gray-500">Hours watched</p>
//                 </div>
//               </div>
//               <p className="text-xl font-bold text-amber-600">312h</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Users + Recent Videos */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

//         {/* Recent Users */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <UserPlus className="w-5 h-5 text-violet-500" />
//               Recent Users
//             </h2>
//             <button className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
//               View all <ArrowUpRight className="w-3.5 h-3.5" />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {recentUsers.map((user) => (
//               <div
//                 key={user.id}
//                 className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
//               >
//                 <div className="relative">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
//                     {user.avatar}
//                   </div>
//                   <span
//                     className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
//                       user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
//                     }`}
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-gray-900 truncate">{user.name}</p>
//                   <p className="text-sm text-gray-500 truncate">{user.email}</p>
//                 </div>
//                 <span className="text-xs text-gray-400 whitespace-nowrap">{user.joined}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Video Uploads */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Upload className="w-5 h-5 text-blue-500" />
//               Recent Uploads
//             </h2>
//             <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
//               View all <ArrowUpRight className="w-3.5 h-3.5" />
//             </button>
//           </div>

//           <div className="space-y-3">
//             {recentVideos.map((video) => (
//               <div
//                 key={video.id}
//                 className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
//                   <Video className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-gray-900 truncate">{video.title}</p>
//                   <p className="text-sm text-gray-500 mt-0.5">
//                     by <span className="text-gray-700 font-medium">{video.uploadedBy}</span>
//                   </p>
//                   <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
//                     <span className="flex items-center gap-1">
//                       <Eye className="w-3 h-3" /> {video.views.toLocaleString()}
//                     </span>
//                     <span>{video.duration}</span>
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-400 whitespace-nowrap">{video.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  Video,
  UserPlus,
  Upload,
  Eye,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Play,
} from "lucide-react"

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
)

// Dummy data
const recentUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", joined: "2h ago", avatar: "RS", status: "online" },
  { id: 2, name: "Priya Patel", email: "priya@email.com", joined: "5h ago", avatar: "PP", status: "offline" },
  { id: 3, name: "Amit Kumar", email: "amit@email.com", joined: "1d ago", avatar: "AK", status: "online" },
  { id: 4, name: "Sneha Gupta", email: "sneha@email.com", joined: "1d ago", avatar: "SG", status: "offline" },
  { id: 5, name: "Vikram Singh", email: "vikram@email.com", joined: "2d ago", avatar: "VS", status: "online" },
]

const recentVideos = [
  { id: 1, title: "React Advanced Patterns", uploadedBy: "Rahul Sharma", time: "1h ago", views: 1240, duration: "12:40" },
  { id: 2, title: "JavaScript ES2024 Features", uploadedBy: "Priya Patel", time: "3h ago", views: 890, duration: "18:22" },
  { id: 3, title: "Node.js Performance Tips", uploadedBy: "Amit Kumar", time: "6h ago", views: 2104, duration: "09:15" },
  { id: 4, title: "Tailwind CSS Masterclass", uploadedBy: "Sneha Gupta", time: "1d ago", views: 567, duration: "25:08" },
]

const weeklyData = [
  { day: "Mon", users: 42, videos: 8 },
  { day: "Tue", users: 58, videos: 12 },
  { day: "Wed", users: 35, videos: 6 },
  { day: "Thu", users: 71, videos: 15 },
  { day: "Fri", users: 64, videos: 11 },
  { day: "Sat", users: 89, videos: 19 },
  { day: "Sun", users: 76, videos: 14 },
]

const maxUsers = Math.max(...weeklyData.map((d) => d.users))

export default function Dashboard() {
  return (
    <div className="space-y-7 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-0.5">
            Welcome back, Aditya 👋 Here’s what’s happening today
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="₹1,24,890"
          change="+12.5%"
          icon={DollarSign}
          color="text-emerald-400"
          bg="bg-emerald-500/15"
        />
        <StatCard
          title="New Orders"
          value="342"
          change="+8.2%"
          icon={ShoppingCart}
          color="text-blue-400"
          bg="bg-blue-500/15"
        />
        <StatCard
          title="Active Users"
          value="2,847"
          change="+18.4%"
          icon={Users}
          color="text-violet-400"
          bg="bg-violet-500/15"
        />
        <StatCard
          title="Videos Uploaded"
          value="1,284"
          change="+5.7%"
          icon={Video}
          color="text-amber-400"
          bg="bg-amber-500/15"
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Weekly Chart */}
        <div className="xl:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Weekly Overview</h2>
              <p className="text-sm text-gray-400">New users & video uploads</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <span className="text-gray-400">Users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-gray-400">Videos</span>
              </div>
            </div>
          </div>

          {/* Simple CSS Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div
                    className="w-3.5 rounded-t-md bg-violet-500 hover:bg-violet-400 transition-all cursor-pointer"
                    style={{ height: `${(item.users / maxUsers) * 100}%` }}
                    title={`${item.users} users`}
                  />
                  <div
                    className="w-3.5 rounded-t-md bg-blue-400 hover:bg-blue-300 transition-all cursor-pointer"
                    style={{ height: `${(item.videos / 20) * 100}%` }}
                    title={`${item.videos} videos`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today’s Snapshot */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Today’s Snapshot</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <UserPlus className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">New Users</p>
                  <p className="text-xs text-gray-500">Joined today</p>
                </div>
              </div>
              <p className="text-xl font-bold text-violet-400">24</p>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Upload className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Videos Uploaded</p>
                  <p className="text-xs text-gray-500">Uploaded today</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-400">9</p>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Eye className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Total Views</p>
                  <p className="text-xs text-gray-500">Across all videos</p>
                </div>
              </div>
              <p className="text-xl font-bold text-emerald-400">4.8k</p>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Play className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">Watch Time</p>
                  <p className="text-xs text-gray-500">Hours watched</p>
                </div>
              </div>
              <p className="text-xl font-bold text-amber-400">312h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users + Recent Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Users */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-violet-400" />
              Recent Users
            </h2>
            <button className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-800/70 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                    {user.avatar}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${
                      user.status === "online" ? "bg-emerald-500" : "bg-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{user.joined}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Video Uploads */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Recent Uploads
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-800/70 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 truncate">{video.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    by <span className="text-gray-300 font-medium">{video.uploadedBy}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {video.views.toLocaleString()}
                    </span>
                    <span>{video.duration}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{video.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}