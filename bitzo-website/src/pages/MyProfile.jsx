

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Eye,
//   Clock,
//   DollarSign,
//   IndianRupee,
//   History,
//   Users,
//   TrendingUp,
//   Calendar,
//   Edit,
//   Mail,
//   ArrowUpDown,
//   X,
//   Upload,
//   Lock,
//   Eye as EyeIcon,
//   EyeOff,
// } from "lucide-react";

// export default function Profile() {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("my-videos");
//   const [sortBy, setSortBy] = useState("latest");
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Edit modal states
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editForm, setEditForm] = useState({ name: "", email: "" });
//   const [avatarFile, setAvatarFile] = useState(null);       // holds the File object
//   const [avatarPreview, setAvatarPreview] = useState(null); // object URL for live preview
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState(null);

//   // Change password modal states
//   const [isPasswordOpen, setIsPasswordOpen] = useState(false);
//   const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
//   const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [passwordError, setPasswordError] = useState(null);
//   const [passwordSuccess, setPasswordSuccess] = useState(false);

//   // Placeholder collections (replace with real API calls later)
//   const [myVideos, setMyVideos] = useState([]);
//   const [earningsHistory, setEarningsHistory] = useState([]);
//   const [historyVideos, setHistoryVideos] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No token found. Please login first.");

//         const res = await fetch("http://localhost:8000/api/me", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           if (res.status === 401) {
//             localStorage.removeItem("token");
//             navigate("/login");
//             throw new Error("Session expired. Please login again.");
//           }
//           throw new Error(`Server responded with status ${res.status}`);
//         }

//         const data = await res.json();
//         if (!data.success || !data.user) throw new Error("Invalid profile response from server");

//         const profile = data.user;

//         setUser({
//           _id: profile._id,
//           name: profile.name || "User",
//           handle: `@${(profile.name || "user").toLowerCase().replace(/\s+/g, "")}`,
//           email: profile.email || "",
//           avatar:
//             profile.avatar ||
//             "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//           createdAt: profile.createdAt
//             ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
//                 month: "long",
//                 year: "numeric",
//               })
//             : "Unknown date",
//           subscribers: profile.subscribers || 0,
//           totalVideos: profile.videos?.length || 0,
//         });

//         setEditForm({
//           name: profile.name || "",
//           email: profile.email || "",
//         });

//         // TODO: Replace with real fetches when endpoints are ready
//         setMyVideos([]);
//         setEarningsHistory([]);
//         setHistoryVideos([]);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   // ─── Avatar file picker handler ───────────────────────────────────────────
//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setAvatarFile(file);
//     // Revoke any previous object URL to avoid memory leaks
//     if (avatarPreview) URL.revokeObjectURL(avatarPreview);
//     setAvatarPreview(URL.createObjectURL(file));
//   };

//   // ─── Submit edit (multipart/form-data so backend can read req.files.images) ──
// const handleEditSubmit = async () => {
//   setEditLoading(true);
//   setEditError(null);

//   try {
//     const token = localStorage.getItem("token");
//     if (!token || !user?._id) throw new Error("Please login again");

//     const formData = new FormData();
//     let hasChanges = false;

//     if (editForm.name?.trim() && editForm.name.trim() !== user.name) {
//       formData.append("name", editForm.name.trim());
//       hasChanges = true;
//     }

//     if (editForm.email?.trim() && editForm.email.trim().toLowerCase() !== user.email.toLowerCase()) {
//       formData.append("email", editForm.email.trim().toLowerCase());
//       hasChanges = true;
//     }

//     if (avatarFile) {
//       formData.append("avatar", avatarFile);
//       hasChanges = true;
//     }

//     if (!hasChanges) {
//       throw new Error("No changes detected");
//     }

//     const res = await fetch(`http://localhost:8000/api/user/${user._id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const data = await res.json();

//     console.log("UPDATE RESPONSE ────────", data); // ← very important

//     if (!res.ok || !data.success) {
//       throw new Error(data.message || `Server error (${res.status})`);
//     }

//     // Update local state
//     setUser(prev => ({
//       ...prev,
//       name: data.user.name || prev.name,
//       email: data.user.email || prev.email,
//       avatar: data.user.avatar || prev.avatar,
//       handle: data.user.name
//         ? `@${data.user.name.toLowerCase().replace(/\s+/g, "")}`
//         : prev.handle,
//     }));

//     setEditForm({
//       name: data.user.name || editForm.name,
//       email: data.user.email || editForm.email,
//     });

//     // Cleanup preview
//     if (avatarPreview) {
//       URL.revokeObjectURL(avatarPreview);
//     }
//     setAvatarFile(null);
//     setAvatarPreview(null);

//     setIsEditOpen(false);
//     alert("Profile updated successfully!");

//     // ── TEMPORARY SAFETY NET ── remove after confirming fix
//     // setTimeout(() => window.location.reload(), 800);

//   } catch (err) {
//     console.error("Edit submit failed:", err);
//     setEditError(err.message || "Something went wrong. Please try again.");
//   } finally {
//     setEditLoading(false);
//   }
// };
//   const sortedVideos = [...myVideos].sort((a, b) => {
//     if (sortBy === "latest")   return new Date(b.uploadDate) - new Date(a.uploadDate);
//     if (sortBy === "views")    return b.views - a.views;
//     if (sortBy === "earnings") return b.earnings - a.earnings;
//     return 0;
//   });

//   const handleSortChange = (e) => setSortBy(e.target.value);
//   const openDetail  = (video) => setSelectedVideo(video);
//   const closeDetail = ()      => setSelectedVideo(null);
//   const openEdit    = ()      => setIsEditOpen(true);

//   const closeEdit = () => {
//     setIsEditOpen(false);
//     setAvatarFile(null);
//     if (avatarPreview) URL.revokeObjectURL(avatarPreview);
//     setAvatarPreview(null);
//     setEditError(null);
//   };

//   // ─── Change password ──────────────────────────────────────────────────────
//   const handlePasswordSubmit = async () => {
//     try {
//       setPasswordLoading(true);
//       setPasswordError(null);
//       setPasswordSuccess(false);

//       const { oldPassword, newPassword, confirmPassword } = passwordForm;

//       if (!oldPassword || !newPassword || !confirmPassword)
//         throw new Error("All fields are required");
//       if (newPassword.length < 6)
//         throw new Error("New password must be at least 6 characters");
//       if (newPassword !== confirmPassword)
//         throw new Error("New passwords do not match");

//       const token = localStorage.getItem("token");
//       if (!token || !user?._id) throw new Error("Authentication issue - please login again");

//       const res = await fetch(`http://localhost:8000/api/user/password/${user._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ oldPassword, newPassword }),
//       });

//       const data = await res.json();
//       if (!res.ok || !data.success) throw new Error(data.message || "Failed to update password");

//       setPasswordSuccess(true);
//       setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
//       setTimeout(() => {
//         setIsPasswordOpen(false);
//         setPasswordSuccess(false);
//       }, 1500);
//     } catch (err) {
//       setPasswordError(err.message);
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const closePasswordModal = () => {
//     setIsPasswordOpen(false);
//     setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     setPasswordError(null);
//     setPasswordSuccess(false);
//     setShowPasswords({ old: false, new: false, confirm: false });
//   };

//   const getStatusBadge = (status) => {
//     const isActive = status?.toLowerCase() === "public";
//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
//           ${isActive
//             ? "bg-green-900/40 text-green-400 border border-green-800/50"
//             : "bg-red-900/40 text-red-400 border border-red-800/50"
//           }`}
//       >
//         {isActive ? "Active" : "Inactive"}
//       </span>
//     );
//   };

//   const tabs = [
//     { id: "my-videos",     label: "My Videos",     icon: Eye       },
//     { id: "earnings",      label: "Earnings",      icon: IndianRupee },
//     { id: "watch-history", label: "Watch History", icon: History   },
//   ];

//   const getTabContent = () => {
//     if (activeTab === "earnings") {
//       return (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold">Earnings</h3>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
//             {[
//               { label: "This Month",         value: `₹${(user?.earningsThisMonth  || 0).toLocaleString()}` },
//               { label: "Total Earnings",     value: `₹${(user?.totalEarnings      || 0).toLocaleString()}` },
//               { label: "Pending Withdrawal", value: `₹${(user?.pendingWithdrawal  || 0).toLocaleString()}` },
//               { label: "Avg. RPM",           value: `₹${user?.avgRPM || "0.0"}` },
//             ].map((item) => (
//               <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
//                 <p className="text-xs text-zinc-400">{item.label}</p>
//                 <p className="text-2xl font-bold">{item.value}</p>
//               </div>
//             ))}
//           </div>
//           <div className="space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
//             {earningsHistory.length === 0 ? (
//               <p className="text-center text-zinc-500 py-10">No earnings history yet</p>
//             ) : (
//               earningsHistory.map((item) => (
//                 <div key={item.month} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">{item.month}</p>
//                     <p className="text-sm text-zinc-400">{item.watchTime} watch time</p>
//                   </div>
//                   <p className="text-lg font-semibold">₹{item.earnings.toLocaleString()}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       );
//     }

//     if (activeTab === "watch-history") {
//       return (
//         <div className="space-y-6">
//           <h3 className="text-lg font-semibold">Watch History</h3>
//           <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
//             {historyVideos.length === 0 ? (
//               <div className="text-center py-20 text-zinc-500">
//                 <p className="text-xl">No watch history</p>
//                 <p className="mt-3 text-sm">Your watched videos will appear here</p>
//               </div>
//             ) : (
//               historyVideos.map((video) => (
//                 <VideoCard key={video.id} video={video} onOpen={openDetail} getStatusBadge={getStatusBadge} />
//               ))
//             )}
//           </div>
//         </div>
//       );
//     }

//     // Default: My Videos tab
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold">Your Videos</h3>
//           <div className="flex items-center gap-2.5">
//             <ArrowUpDown size={16} className="text-zinc-500" />
//             <select
//               value={sortBy}
//               onChange={handleSortChange}
//               className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all appearance-none"
//             >
//               <option value="latest">Latest</option>
//               <option value="views">Highest Views</option>
//               <option value="earnings">Highest Earnings</option>
//             </select>
//           </div>
//         </div>
//         <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
//           {myVideos.length === 0 ? (
//             <div className="text-center py-20 text-zinc-500">
//               <p className="text-xl">No videos yet</p>
//               <p className="mt-3 text-sm">Upload your first video to get started</p>
//             </div>
//           ) : (
//             sortedVideos.map((video) => (
//               <VideoCard key={video.id} video={video} onOpen={openDetail} getStatusBadge={getStatusBadge} />
//             ))
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="text-zinc-400 text-xl">Loading profile...</div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//         <div className="text-red-400 text-xl">Error: {error || "Profile not loaded"}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 scrollbar-hide">

//       {/* ── Profile Header ─────────────────────────────────────────────────── */}
//       <div className="bg-zinc-900 border-b border-zinc-800">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
//           <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
//             <div className="flex items-start gap-5">
//               <img
//                 src={user.avatar}
//                 alt={user.name}
//                 className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-zinc-700 shadow-lg"
//               />
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
//                 <p className="text-zinc-400 mt-1">{user.handle}</p>
//                 <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-zinc-400">
//                   <div className="flex items-center gap-1.5">
//                     <Users size={16} />
//                     <span>{user.subscribers?.toLocaleString() || "0"} subscribers</span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Calendar size={16} />
//                     <span>Joined {user.createdAt}</span>
//                   </div>
//                 </div>
//                 <div className="mt-3 flex items-center gap-3 text-sm">
//                   <Mail size={15} className="text-zinc-500" />
//                   <span>{user.email}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4 sm:items-center mt-6 sm:mt-0">
//               <button
//                 onClick={() => navigate("/withdraw")}
//                 className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-lg transition-colors shadow-sm shadow-red-900/40 min-w-[180px]"
//               >
//                 <IndianRupee size={18} />
//                 Withdraw
//               </button>
//               <button
//                 onClick={openEdit}
//                 className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 font-medium rounded-lg border border-zinc-700 transition-colors min-w-[140px]"
//               >
//                 <Edit size={16} />
//                 Edit Profile
//               </button>
//               <button
//                 onClick={() => setIsPasswordOpen(true)}
//                 className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 font-medium rounded-lg border border-zinc-700 transition-colors min-w-[160px]"
//               >
//                 <Lock size={16} />
//                 Change Password
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Stats ──────────────────────────────────────────────────────────── */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
//           {[
//             { icon: Eye,       color: "blue",    value: user.totalViews?.toLocaleString() || "0",            label: "Total Views"    },
//             { icon: Clock,     color: "emerald", value: user.totalWatchHours || "0h",                        label: "Watch Hours"    },
//             { icon: DollarSign,color: "red",     value: `₹${(user.totalEarnings || 0).toLocaleString()}`,    label: "Total Earnings" },
//             { icon: TrendingUp,color: "purple",  value: `₹${user.avgRPM || "0.0"}`,                         label: "Avg. RPM"       },
//           ].map(({ icon: Icon, color, value, label }) => (
//             <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
//               <Icon size={24} className={`mx-auto mb-3 text-${color}-500`} />
//               <p className="text-2xl font-bold">{value}</p>
//               <p className="text-xs text-zinc-500 mt-1">{label}</p>
//             </div>
//           ))}
//         </div>

//         {/* ── Tabs ───────────────────────────────────────────────────────── */}
//         <div className="mb-6 border-b border-zinc-800">
//           <div className="flex overflow-x-auto scrollbar-hide gap-1 pb-1">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap
//                     ${isActive
//                       ? "bg-zinc-800 text-red-400 border-b-2 border-red-600 shadow-sm"
//                       : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
//                     }`}
//                 >
//                   <Icon size={18} />
//                   {tab.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── Tab Content ────────────────────────────────────────────────── */}
//         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[500px]">
//           {getTabContent()}
//         </div>
//       </div>

//       {/* ── Edit Profile Modal ─────────────────────────────────────────────── */}
//       {isEditOpen && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 scrollbar-hide">
//           <div className="bg-zinc-900 rounded-2xl max-w-lg w-full border border-zinc-800 shadow-2xl shadow-black/60">

//             {/* Header */}
//             <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-800">
//               <h2 className="text-xl font-semibold">Edit Profile</h2>
//               <button
//                 onClick={closeEdit}
//                 className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-5">
//               {editError && (
//                 <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded text-sm">
//                   {editError}
//                 </div>
//               )}

//               {/* Avatar upload */}
//               <div className="block text-sm">
//                 <span className="text-xs text-zinc-400">Avatar</span>
//                 <div className="mt-2 flex items-center gap-4">
//                   {/* Live preview */}
//                   <img
//                     src={avatarPreview || user?.avatar}
//                     alt="avatar preview"
//                     className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700 flex-shrink-0"
//                   />
//                   {/* File picker button */}
//                   <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-lg border border-zinc-700 transition-colors">
//                     <Upload size={15} />
//                     <span className="truncate max-w-[180px]">
//                       {avatarFile ? avatarFile.name : "Choose image"}
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleAvatarChange}
//                     />
//                   </label>
//                 </div>
//               </div>

//               {/* Name */}
//               <label className="block text-sm">
//                 <span className="text-xs text-zinc-400">Name</span>
//                 <input
//                   value={editForm.name}
//                   onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                   className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600"
//                 />
//               </label>

//               {/* Email */}
//               <label className="block text-sm">
//                 <span className="text-xs text-zinc-400">Email</span>
//                 <input
//                   type="email"
//                   value={editForm.email}
//                   onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                   className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600"
//                 />
//               </label>

//               {/* Actions */}
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={closeEdit}
//                   disabled={editLoading}
//                   className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEditSubmit}
//                   disabled={editLoading}
//                   className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center gap-2"
//                 >
//                   {editLoading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Change Password Modal ──────────────────────────────────────────── */}
//       {isPasswordOpen && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 scrollbar-hide">
//           <div className="bg-zinc-900 rounded-2xl max-w-md w-full border border-zinc-800 shadow-2xl shadow-black/60">

//             {/* Header */}
//             <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-800">
//               <div className="flex items-center gap-2.5">
//                 <Lock size={18} className="text-red-500" />
//                 <h2 className="text-xl font-semibold">Change Password</h2>
//               </div>
//               <button
//                 onClick={closePasswordModal}
//                 className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-4">
//               {passwordError && (
//                 <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded text-sm">
//                   {passwordError}
//                 </div>
//               )}
//               {passwordSuccess && (
//                 <div className="bg-green-950 border border-green-800 text-green-300 px-4 py-3 rounded text-sm">
//                   Password updated successfully!
//                 </div>
//               )}

//               {/* Old password */}
//               <label className="block text-sm">
//                 <span className="text-xs text-zinc-400">Current Password</span>
//                 <div className="mt-1 relative">
//                   <input
//                     type={showPasswords.old ? "text" : "password"}
//                     value={passwordForm.oldPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
//                     placeholder="Enter current password"
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 pr-10 text-sm text-zinc-100 focus:outline-none focus:border-red-600"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPasswords((p) => ({ ...p, old: !p.old }))}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
//                   >
//                     {showPasswords.old ? <EyeOff size={15} /> : <EyeIcon size={15} />}
//                   </button>
//                 </div>
//               </label>

//               {/* New password */}
//               <label className="block text-sm">
//                 <span className="text-xs text-zinc-400">New Password</span>
//                 <div className="mt-1 relative">
//                   <input
//                     type={showPasswords.new ? "text" : "password"}
//                     value={passwordForm.newPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                     placeholder="Min. 6 characters"
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 pr-10 text-sm text-zinc-100 focus:outline-none focus:border-red-600"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
//                   >
//                     {showPasswords.new ? <EyeOff size={15} /> : <EyeIcon size={15} />}
//                   </button>
//                 </div>
//               </label>

//               {/* Confirm new password */}
//               <label className="block text-sm">
//                 <span className="text-xs text-zinc-400">Confirm New Password</span>
//                 <div className="mt-1 relative">
//                   <input
//                     type={showPasswords.confirm ? "text" : "password"}
//                     value={passwordForm.confirmPassword}
//                     onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                     placeholder="Repeat new password"
//                     className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 pr-10 text-sm text-zinc-100 focus:outline-none focus:border-red-600"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
//                   >
//                     {showPasswords.confirm ? <EyeOff size={15} /> : <EyeIcon size={15} />}
//                   </button>
//                 </div>
//               </label>

//               {/* Strength hint */}
//               {passwordForm.newPassword && (
//                 <div className="flex gap-1 pt-1">
//                   {[1, 2, 3, 4].map((level) => {
//                     const len = passwordForm.newPassword.length;
//                     const strength = len < 6 ? 1 : len < 9 ? 2 : len < 12 ? 3 : 4;
//                     return (
//                       <div
//                         key={level}
//                         className={`h-1 flex-1 rounded-full transition-colors ${
//                           level <= strength
//                             ? strength === 1 ? "bg-red-500"
//                             : strength === 2 ? "bg-orange-500"
//                             : strength === 3 ? "bg-yellow-500"
//                             : "bg-green-500"
//                             : "bg-zinc-700"
//                         }`}
//                       />
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   onClick={closePasswordModal}
//                   disabled={passwordLoading}
//                   className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handlePasswordSubmit}
//                   disabled={passwordLoading || passwordSuccess}
//                   className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center gap-2"
//                 >
//                   {passwordLoading ? "Updating..." : passwordSuccess ? "Updated!" : "Update Password"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Video Detail Modal ─────────────────────────────────────────────── */}
//       {selectedVideo && (
//         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 scrollbar-hide">
//           <div className="bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-zinc-800 shadow-2xl shadow-black/60 scrollbar-hide">
//             <div className="sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10 px-6 pt-5 pb-3 border-b border-zinc-800 flex items-center justify-between">
//               <h2 className="text-xl font-semibold">Video Details</h2>
//               <button
//                 onClick={closeDetail}
//                 className="p-2.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
//               >
//                 <X size={22} />
//               </button>
//             </div>
//             <div className="p-6 space-y-7">
//               <div>
//                 <img
//                   src={selectedVideo.thumbnail}
//                   alt={selectedVideo.title}
//                   className="w-full h-56 object-cover rounded-xl border border-zinc-800 shadow-md"
//                 />
//                 <h3 className="mt-5 text-2xl font-semibold leading-tight">{selectedVideo.title}</h3>
//                 <p className="mt-2 text-sm text-zinc-500">
//                   Uploaded:{" "}
//                   {selectedVideo.uploadDate
//                     ? new Date(selectedVideo.uploadDate).toLocaleDateString("en-IN")
//                     : "Unknown"}
//                 </p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   { icon: Eye,        color: "blue",    label: "Total Views",      value: selectedVideo.views?.toLocaleString() || "0" },
//                   { icon: Clock,      color: "purple",  label: "Avg. Watch %",     value: `${selectedVideo.avgWatchPercent || 0}%` },
//                   { icon: Clock,      color: "emerald", label: "Total Watch Time",  value: selectedVideo.totalWatchTime || "0h" },
//                   { icon: DollarSign, color: "red",     label: "Total Earnings",   value: `₹${(selectedVideo.earnings || 0).toFixed(2)}` },
//                 ].map((item, i) => (
//                   <div key={i} className="bg-zinc-950/60 p-5 rounded-xl text-center border border-zinc-800 shadow-sm shadow-black/30">
//                     <item.icon size={28} className={`mx-auto mb-3 text-${item.color}-500`} />
//                     <p className={`text-2xl font-bold text-${item.color}-400`}>{item.value}</p>
//                     <p className="text-sm text-zinc-500 mt-1.5">{item.label}</p>
//                   </div>
//                 ))}
//               </div>
//               <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
//                 <span className="text-sm font-medium text-zinc-400">Status</span>
//                 {getStatusBadge(selectedVideo.status)}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Reusable video card ────────────────────────────────────────────────────
// function VideoCard({ video, onOpen, getStatusBadge }) {
//   return (
//     <div
//       onClick={() => onOpen(video)}
//       className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.995]"
//     >
//       <div className="flex flex-col sm:flex-row">
//         <div className="relative w-full sm:w-36 h-52 sm:h-24 flex-shrink-0">
//           <img
//             src={video.thumbnail}
//             alt={video.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:opacity-0 sm:hover:opacity-100 transition-opacity" />
//         </div>
//         <div className="flex-1 p-4 flex flex-col">
//           <h3 className="font-medium text-base leading-tight line-clamp-2 mb-3">{video.title}</h3>
//           <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400 mb-4">
//             <div className="flex items-center gap-5">
//               <div className="flex items-center gap-1.5">
//                 <Eye size={15} />
//                 <span>{video.views?.toLocaleString() || "0"}</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <Clock size={15} />
//                 <span>{video.avgWatchPercent || 0}%</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 font-medium text-red-500">
//               <DollarSign size={15} />
//               <span>₹{(video.earnings || 0).toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="flex items-center justify-between sm:justify-end gap-3 mt-auto">
//             {getStatusBadge(video.status)}
//             <button
//               onClick={(e) => { e.stopPropagation(); onOpen(video); }}
//               className="px-5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-red-900/30"
//             >
//               Details
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Clock,
  DollarSign,
  IndianRupee,
  History,
  Users,
  TrendingUp,
  Calendar,
  Edit,
  Mail,
  ArrowUpDown,
  X,
  Upload,
  Lock,
  Eye as EyeIcon,
  EyeOff,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my-videos");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Change Password Modal States
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Placeholder data (replace with real API calls later)
  const [myVideos, setMyVideos] = useState([]);
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [historyVideos, setHistoryVideos] = useState([]);

  // Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login first.");

        const res = await fetch("http://localhost:8000/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        if (!data.success || !data.user) {
          throw new Error("Invalid profile data received");
        }

        const profile = data.user;

        setUser({
          _id: profile._id,
          name: profile.name || "User",
          handle: `@${(profile.name || "user").toLowerCase().replace(/\s+/g, "")}`,
          email: profile.email || "",
          avatar:
            profile.avatar ||
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
          createdAt: profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : "Unknown date",
          subscribers: profile.subscribers || 0,
          totalVideos: profile.videos?.length || 0,
          totalViews: profile.totalViews || 0,
          totalEarnings: profile.totalEarnings || 0,
          avgRPM: profile.avgRPM || "0.0",
        });

        setEditForm({
          name: profile.name || "",
          email: profile.email || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle Avatar Selection + Client-side Validation
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("Only image files are allowed (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEditError("Image size must be less than 5MB");
      return;
    }

    // Revoke previous preview to prevent memory leak
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setEditError(null);
  };

  // Submit Edit Profile (Name + Email + Avatar)
  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token || !user?._id) throw new Error("Please login again");

      const formData = new FormData();

      // Name
      const trimmedName = editForm.name?.trim();
      if (trimmedName && trimmedName !== user.name) {
        formData.append("name", trimmedName);
      }

      // Email
      const trimmedEmail = editForm.email?.trim().toLowerCase();
      if (trimmedEmail && trimmedEmail !== user.email.toLowerCase()) {
        formData.append("email", trimmedEmail);
      }

      // Avatar
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Check if any change exists
      if (!formData.has("name") && !formData.has("email") && !avatarFile) {
        throw new Error("No changes detected");
      }

      const res = await fetch(`http://localhost:8000/api/user/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local user state
      setUser((prev) => ({
        ...prev,
        name: data.user.name || prev.name,
        email: data.user.email || prev.email,
        avatar: data.user.avatar || prev.avatar,
        handle: data.user.name
          ? `@${data.user.name.toLowerCase().replace(/\s+/g, "")}`
          : prev.handle,
      }));

      setEditForm({
        name: data.user.name || editForm.name,
        email: data.user.email || editForm.email,
      });

      // Cleanup preview URL
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsEditOpen(false);

      alert("Profile updated successfully!"); // Replace with toast later
    } catch (err) {
      console.error("Edit submit error:", err);
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditError(null);
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  // Password Submit (you can improve this later with real backend)
  const handlePasswordSubmit = async () => {
    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(false);

      const { oldPassword, newPassword, confirmPassword } = passwordForm;

      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new Error("All fields are required");
      }
      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const token = localStorage.getItem("token");
      if (!token || !user?._id) throw new Error("Authentication required");

      const res = await fetch(`http://localhost:8000/api/user/password/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordSuccess(true);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        setIsPasswordOpen(false);
        setPasswordSuccess(false);
      }, 1500);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setIsPasswordOpen(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError(null);
    setPasswordSuccess(false);
    setShowPasswords({ old: false, new: false, confirm: false });
  };

  const getStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "public";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
          ${isActive
            ? "bg-green-900/40 text-green-400 border border-green-800/50"
            : "bg-red-900/40 text-red-400 border border-red-800/50"
          }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const tabs = [
    { id: "my-videos", label: "My Videos", icon: Eye },
    { id: "earnings", label: "Earnings", icon: IndianRupee },
    { id: "watch-history", label: "Watch History", icon: History },
  ];

  const sortedVideos = [...myVideos].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.uploadDate) - new Date(a.uploadDate);
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "earnings") return b.earnings - a.earnings;
    return 0;
  });

  const getTabContent = () => {
    if (activeTab === "earnings") {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Earnings Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "This Month", value: `₹${(user?.earningsThisMonth || 0).toLocaleString()}` },
              { label: "Total Earnings", value: `₹${(user?.totalEarnings || 0).toLocaleString()}` },
              { label: "Pending", value: `₹${(user?.pendingWithdrawal || 0).toLocaleString()}` },
              { label: "Avg. RPM", value: `₹${user?.avgRPM || "0.0"}` },
            ].map((item) => (
              <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <p className="text-xs text-zinc-400">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="text-center text-zinc-500 py-10">
            Earnings history will appear here once available
          </div>
        </div>
      );
    }

    if (activeTab === "watch-history") {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Watch History</h3>
          <div className="text-center text-zinc-500 py-20">
            Your watch history will appear here
          </div>
        </div>
      );
    }

    // My Videos Tab
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">My Videos</h3>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-red-600"
            >
              <option value="latest">Latest</option>
              <option value="views">Highest Views</option>
              <option value="earnings">Highest Earnings</option>
            </select>
          </div>
        </div>

        {myVideos.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-xl">No videos yet</p>
            <p className="mt-2 text-sm">Upload your first video to get started</p>
          </div>
        ) : (
          sortedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onOpen={setSelectedVideo}
              getStatusBadge={getStatusBadge}
            />
          ))
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error || "Profile not loaded"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">

      {/* Profile Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-zinc-700 shadow-lg"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                <p className="text-zinc-400 mt-1">{user.handle}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Users size={16} />
                    <span>{user.subscribers.toLocaleString()} subscribers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>Joined {user.createdAt}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <Mail size={15} className="text-zinc-500" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                onClick={() => navigate("/withdraw")}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <IndianRupee size={18} />
                Withdraw
              </button>
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg border border-zinc-700 transition-colors"
              >
                <Edit size={16} />
                Edit Profile
              </button>
              <button
                onClick={() => setIsPasswordOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg border border-zinc-700 transition-colors"
              >
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
          {[
            { icon: Eye, color: "blue", value: user.totalViews?.toLocaleString() || "0", label: "Total Views" },
            { icon: Clock, color: "emerald", value: "0h", label: "Watch Hours" },
            { icon: DollarSign, color: "red", value: `₹${(user.totalEarnings || 0).toLocaleString()}`, label: "Total Earnings" },
            { icon: TrendingUp, color: "purple", value: `₹${user.avgRPM}`, label: "Avg. RPM" },
          ].map(({ icon: Icon, color, value, label }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
              <Icon size={24} className={`mx-auto mb-3 text-${color}-500`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-zinc-800">
          <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-zinc-800 text-red-400 border-b-2 border-red-600"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[500px]">
          {getTabContent()}
        </div>
      </div>

      {/* ====================== EDIT PROFILE MODAL ====================== */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-lg w-full border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button onClick={closeEdit} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {editError && (
                <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              {/* Avatar */}
              <div>
                <span className="text-xs text-zinc-400 block mb-2">Avatar</span>
                <div className="flex items-center gap-4">
                  <img
                    src={avatarPreview || user.avatar}
                    alt="Avatar Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700"
                  />
                  <label className="cursor-pointer flex-1 flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 text-sm transition-colors">
                    <Upload size={18} />
                    <span className="truncate">{avatarFile ? avatarFile.name : "Choose new image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Max 5MB • JPG, PNG, WebP supported</p>
              </div>

              {/* Name */}
              <div>
                <span className="text-xs text-zinc-400 block mb-1">Name</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <span className="text-xs text-zinc-400 block mb-1">Email</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={closeEdit}
                  disabled={editLoading}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================== CHANGE PASSWORD MODAL ====================== */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-red-500" />
                <h2 className="text-xl font-semibold">Change Password</h2>
              </div>
              <button onClick={closePasswordModal} className="p-2 hover:bg-zinc-800 rounded-full">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {passwordError && (
                <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-green-950 border border-green-800 text-green-300 px-4 py-3 rounded text-sm">
                  Password updated successfully!
                </div>
              )}

              {/* Old Password */}
              <div>
                <span className="text-xs text-zinc-400 block mb-1">Current Password</span>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, old: !p.old }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showPasswords.old ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <span className="text-xs text-zinc-400 block mb-1">New Password</span>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <span className="text-xs text-zinc-400 block mb-1">Confirm New Password</span>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={passwordLoading || passwordSuccess}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-zinc-800">
            <div className="sticky top-0 bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Video Details</h2>
              <button onClick={() => setSelectedVideo(null)} className="p-2 hover:bg-zinc-800 rounded-full">
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-56 object-cover rounded-xl"
              />
              <h3 className="mt-5 text-2xl font-semibold">{selectedVideo.title}</h3>
              {/* Add more details as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Video Card Component
function VideoCard({ video, onOpen, getStatusBadge }) {
  return (
    <div
      onClick={() => onOpen(video)}
      className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-40 h-48 sm:h-28 flex-shrink-0">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-medium leading-tight line-clamp-2 mb-3">{video.title}</h3>
          <div className="flex items-center justify-between text-sm text-zinc-400 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye size={15} /> {video.views?.toLocaleString() || 0}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={15} className="text-red-500" /> ₹{(video.earnings || 0).toFixed(2)}
              </div>
            </div>
            {getStatusBadge(video.status)}
          </div>
        </div>
      </div>
    </div>
  );
}