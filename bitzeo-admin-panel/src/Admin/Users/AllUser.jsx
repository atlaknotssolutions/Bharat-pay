// // import { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const AllUsers = () => {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Change this to your actual backend URL
// //   const API_URL = 'http://localhost:5000/api/admin/alluser'; // ← update port & URL

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const response = await axios.get(API_URL, {
// //           headers: {
// //             // Add token if your admin route is protected
// //             // Authorization: `Bearer ${localStorage.getItem('adminToken')}`
// //           },
// //         });

// //         setUsers(response.data);
// //       } catch (err) {
// //         console.error('Error fetching users:', err);
// //         setError(
// //           err.response?.data?.message ||
// //           'Failed to load users. Is backend running?'
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
// //         <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
// //         <p className="text-gray-700">{error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-10">
// //       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
// //         All Users
// //       </h1>

// //       {users.length === 0 ? (
// //         <div className="text-center text-gray-500 py-10">
// //           No users found in the database.
// //         </div>
// //       ) : (
// //         <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Name
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Email
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Role
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Joined
// //                 </th>
// //                 {/* Add more columns if your schema has more fields */}
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {users.map((user) => (
// //                 <tr key={user._id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm font-medium text-gray-900">
// //                       {user.name || '—'}
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm text-gray-900">{user.email}</div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <span
// //                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                         user.role === 'admin'
// //                           ? 'bg-purple-100 text-purple-800'
// //                           : 'bg-green-100 text-green-800'
// //                       }`}
// //                     >
// //                       {user.role || 'user'}
// //                     </span>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {user.createdAt
// //                       ? new Date(user.createdAt).toLocaleDateString()
// //                       : '—'}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AllUsers;

// // import { useState, useEffect } from "react";
// // import axios from "axios";

// // const AllUsers = () => {
// //   const [users, setUsers] = useState([]); // ← always start with empty array
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const API_URL = "http://localhost:8000/api/admin/alluser"; // update if needed

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const response = await axios.get(API_URL, {
// //           // headers: { Authorization: `Bearer ${token}` } // if needed
// //         });

// //         // ────────────────────────────────────────────────
// //         // Most important fixes ↓↓↓
// //         const data = response.data;

// //         // Case 1: data is already array
// //         if (Array.isArray(data)) {
// //           setUsers(data);
// //         }
// //         // Case 2: data has nested users array (very common)
// //         else if (data && Array.isArray(data.users)) {
// //           setUsers(data.users);
// //         }
// //         // Case 3: data is object but has user list in another key
// //         else if (data && typeof data === "object") {
// //           // Try common key names
// //           const possibleKeys = ["users", "data", "result", "allUsers", "list"];
// //           for (const key of possibleKeys) {
// //             if (Array.isArray(data[key])) {
// //               setUsers(data[key]);
// //               break;
// //             }
// //           }
// //         }
// //         // Fallback: empty array
// //         else {
// //           setUsers([]);
// //           console.warn("API did not return an array:", data);
// //         }
// //         // ────────────────────────────────────────────────
// //       } catch (err) {
// //         console.error("Fetch error:", err);
// //         setError(
// //           err.response?.data?.message ||
// //             "Could not load users. Is server running?",
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

// //   // ────────────────────────────────────────────────
// //   //  Safe rendering – never call .map on non-array
// //   // ────────────────────────────────────────────────
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
// //         <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
// //         <p className="text-gray-700">{error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-7xl mx-auto px-4 py-10">
// //       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
// //         All Users
// //       </h1>

// //       {users.length === 0 ? (
// //         <div className="text-center text-gray-500 py-10">No users found</div>
// //       ) : (
// //         <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Name
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Email
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Role
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Reward
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Total Paid
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Joined
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {users.map((user) => (
// //                 <tr key={user._id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="text-sm font-medium text-gray-900">
// //                       {user.name || "—"}
// //                     </div>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {user.email}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <span
// //                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                         user.role === "admin"
// //                           ? "bg-purple-100 text-purple-800"
// //                           : "bg-green-100 text-green-800"
// //                       }`}
// //                     >
// //                       {user.role || "user"}
// //                     </span>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                     {user.reward != null ? `${user.reward} ₹` : "—"}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                     {user.totalPayment != null && user.totalPayment > 0
// //                       ? `₹${user.totalPayment.toLocaleString()}`
// //                       : "—"}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {user.createdAt
// //                       ? new Date(user.createdAt).toLocaleDateString("en-IN")
// //                       : "—"}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AllUsers;


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Search,
//   Edit,
//   Trash2,
//   Loader2,
//   Tv,
//   Video,
//   Mail,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Eye,
// } from "lucide-react";

// const BASE_URL = "http://localhost:8000/api";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 15 });
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [editModal, setEditModal] = useState(false);
//   const [detailModal, setDetailModal] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "creator",
//     trustScore: 50,
//     rewardPoints: 0,
//   });

//   const fetchUsers = async (pageNum = 1, searchTerm = "") => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/admin/alluser`, {
//               });

//       setUsers(res.data?.data || []);
//       setPagination(res.data?.pagination || { total: 0, pages: 1, limit: 15 });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(page, search);
//   }, [page]);

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPage(1);
//       fetchUsers(1, search);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [search]);

//   // ========== FULL DETAILS BY ID ==========
//   const openDetail = async (userId) => {
//     try {
//       setDetailLoading(true);
//       setDetailModal(true);
//       setSelectedUser(null);

//       const res = await axios.get(`${BASE_URL}/admin/users/${userId}`);
//       setSelectedUser(res.data?.data || null);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to load user details");
//       setDetailModal(false);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const openEdit = (user) => {
//     setSelectedUser(user);
//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       role: user.role || "creator",
//       trustScore: user.trustScore ?? 50,
//       rewardPoints: user.rewardPoints ?? 0,
//     });
//     setEditModal(true);
//   };

//   const openEditFromDetail = () => {
//     if (!selectedUser) return;
//     setDetailModal(false);
//     openEdit(selectedUser);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!selectedUser) return;

//     try {
//       setSubmitting(true);
//       await axios.put(`${BASE_URL}/users/${selectedUser._id}`, formData);
//       toast.success("User updated successfully");
//       setEditModal(false);
//       fetchUsers(page, search);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await axios.delete(`${BASE_URL}/users/${id}`);
//       toast.success("User deleted successfully");
//       fetchUsers(page, search);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   const roleColor = (role) => {
//     if (role === "admin") return "bg-purple-100 text-purple-800";
//     if (role === "creator") return "bg-blue-100 text-blue-800";
//     return "bg-gray-100 text-gray-800";
//   };

//   return (
//     <div className="space-y-6">
//       <ToastContainer position="top-right" autoClose={3000} theme="colored" />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Users</h1>
//           <p className="text-sm text-gray-500 mt-0.5">
//             {pagination.total} total users
//           </p>
//         </div>

//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 bg-white"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 size={40} className="animate-spin text-indigo-600 mb-3" />
//             <p className="text-gray-500">Loading users...</p>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center py-20 text-gray-500">
//             <User size={40} className="mx-auto mb-3 opacity-40" />
//             <p className="text-lg font-medium">No users found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
//                   <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
//                   <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Channels</th>
//                   <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Videos</th>
//                   <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trust</th>
//                   <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
//                   <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase min-w-[160px]">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {users.map((user) => (
//                   <tr key={user._id} className="hover:bg-gray-50 transition">
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
//                           {user.avatar ? (
//                             <img
//                               src={user.avatar}
//                               alt={user.name}
//                               className="w-10 h-10 rounded-full object-cover"
//                             />
//                           ) : (
//                             user.name?.charAt(0)?.toUpperCase() || "U"
//                           )}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="font-medium text-gray-900 truncate">{user.name}</p>
//                           <p className="text-sm text-gray-500 truncate flex items-center gap-1">
//                             <Mail size={12} />
//                             {user.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-5 py-4">
//                       <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${roleColor(user.role)}`}>
//                         {user.role}
//                       </span>
//                     </td>

//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-1.5">
//                         <Tv size={15} className="text-amber-500" />
//                         <span className="font-semibold text-gray-800">{user.totalChannels}</span>
//                       </div>
//                     </td>

//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-1.5">
//                         <Video size={15} className="text-blue-500" />
//                         <span className="font-semibold text-gray-800">{user.totalVideos}</span>
//                       </div>
//                     </td>

//                     <td className="px-5 py-4">
//                       <span className="text-sm font-medium text-gray-700">
//                         {user.trustScore}
//                       </span>
//                     </td>

//                     <td className="px-5 py-4 text-sm text-gray-500">
//                       {new Date(user.createdAt).toLocaleDateString()}
//                     </td>

//                     {/* ========== ACTIONS ========== */}
//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-center gap-2">
//                         {/* View Details */}
//                         <button
//                           onClick={() => openDetail(user._id)}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
//                           title="View Full Details"
//                         >
//                           <Eye size={16} />
//                           View
//                         </button>

//                         {/* Edit */}
//                         <button
//                           onClick={() => openEdit(user)}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
//                           title="Edit User"
//                         >
//                           <Edit size={16} />
//                           Edit
//                         </button>

//                         {/* Delete */}
//                         <button
//                           onClick={() => handleDelete(user._id)}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
//                           title="Delete User"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
//             <p className="text-sm text-gray-500">
//               Page {pagination.page} of {pagination.pages}
//             </p>
//             <div className="flex gap-2">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
//               >
//                 <ChevronLeft size={18} />
//               </button>
//               <button
//                 disabled={page >= pagination.pages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="p-2 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ========== DETAIL MODAL ========== */}
//       {detailModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
//               <h2 className="text-xl font-bold">User Details</h2>
//               <button
//                 onClick={() => setDetailModal(false)}
//                 className="p-1 hover:bg-gray-100 rounded-lg"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {detailLoading ? (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <Loader2 size={40} className="animate-spin text-indigo-600 mb-3" />
//                 <p className="text-gray-500">Loading full details...</p>
//               </div>
//             ) : selectedUser ? (
//               <div className="p-5 space-y-5">
//                 {/* Profile */}
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
//                     {selectedUser.avatar ? (
//                       <img
//                         src={selectedUser.avatar}
//                         className="w-16 h-16 rounded-full object-cover"
//                         alt={selectedUser.name}
//                       />
//                     ) : (
//                       selectedUser.name?.charAt(0)?.toUpperCase()
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold">{selectedUser.name}</h3>
//                     <p className="text-gray-500">{selectedUser.email}</p>
//                     <span
//                       className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${roleColor(
//                         selectedUser.role
//                       )}`}
//                     >
//                       {selectedUser.role}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                   <div className="bg-amber-50 p-3 rounded-xl text-center">
//                     <p className="text-2xl font-bold text-amber-700">
//                       {selectedUser.totalChannels}
//                     </p>
//                     <p className="text-xs text-amber-600">Channels</p>
//                   </div>
//                   <div className="bg-blue-50 p-3 rounded-xl text-center">
//                     <p className="text-2xl font-bold text-blue-700">
//                       {selectedUser.totalVideos}
//                     </p>
//                     <p className="text-xs text-blue-600">Videos</p>
//                   </div>
//                   <div className="bg-green-50 p-3 rounded-xl text-center">
//                     <p className="text-2xl font-bold text-green-700">
//                       {selectedUser.trustScore}
//                     </p>
//                     <p className="text-xs text-green-600">Trust Score</p>
//                   </div>
//                   <div className="bg-purple-50 p-3 rounded-xl text-center">
//                     <p className="text-2xl font-bold text-purple-700">
//                       {selectedUser.rewardPoints}
//                     </p>
//                     <p className="text-xs text-purple-600">Points</p>
//                   </div>
//                 </div>

//                 {/* Channels */}
//                 <div>
//                   <h4 className="font-semibold mb-3 flex items-center gap-2">
//                     <Tv size={18} className="text-amber-500" />
//                     Channels ({selectedUser.totalChannels})
//                   </h4>
//                   {selectedUser.channels?.length === 0 ? (
//                     <p className="text-sm text-gray-400">No channels yet</p>
//                   ) : (
//                     <div className="space-y-2">
//                       {selectedUser.channels.map((ch) => (
//                         <div
//                           key={ch._id}
//                           className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
//                         >
//                           <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
//                             {ch.channelImage ? (
//                               <img
//                                 src={ch.channelImage}
//                                 className="w-10 h-10 rounded-lg object-cover"
//                                 alt={ch.name}
//                               />
//                             ) : (
//                               <Tv size={18} className="text-amber-600" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium truncate">{ch.name}</p>
//                             <p className="text-xs text-gray-500">
//                               {ch.totalVideos} videos
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Videos */}
//                 <div>
//                   <h4 className="font-semibold mb-3 flex items-center gap-2">
//                     <Video size={18} className="text-blue-500" />
//                     All Videos ({selectedUser.totalVideos})
//                   </h4>
//                   {selectedUser.videos?.length === 0 ? (
//                     <p className="text-sm text-gray-400">No videos yet</p>
//                   ) : (
//                     <div className="space-y-2 max-h-60 overflow-y-auto">
//                       {selectedUser.videos.map((v) => (
//                         <div
//                           key={v._id}
//                           className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
//                         >
//                           <div className="w-16 h-10 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
//                             {v.thumbnail && (
//                               <img
//                                 src={v.thumbnail}
//                                 className="w-full h-full object-cover"
//                                 alt={v.title}
//                               />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium text-sm truncate">{v.title}</p>
//                             <p className="text-xs text-amber-600">{v.channelName}</p>
//                           </div>
//                           <span className="text-xs text-gray-400">
//                             {v.views || 0} views
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Update Button */}
//                 <div className="pt-2 border-t">
//                   <button
//                     onClick={openEditFromDetail}
//                     className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
//                   >
//                     <Edit size={18} />
//                     Update User
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-20 text-gray-500">
//                 User not found
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ========== EDIT MODAL ========== */}
//       {editModal && selectedUser && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//             <div className="flex items-center justify-between p-5 border-b">
//               <h2 className="text-xl font-bold">Edit User</h2>
//               <button
//                 onClick={() => setEditModal(false)}
//                 className="p-1 hover:bg-gray-100 rounded-lg"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleUpdate} className="p-5 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>
//                 <input
//                   required
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   required
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <select
//                   value={formData.role}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value })
//                   }
//                   className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 >
//                   <option value="viewer">Viewer</option>
//                   <option value="creator">Creator</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Trust Score
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     max={100}
//                     value={formData.trustScore}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         trustScore: Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Reward Points
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     value={formData.rewardPoints}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         rewardPoints: Number(e.target.value),
//                       })
//                     }
//                     className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
//                 >
//                   {submitting && <Loader2 size={16} className="animate-spin" />}
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setEditModal(false)}
//                   className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Edit,
  Trash2,
  Loader2,
  Tv,
  Video,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Eye,
  Check,
  Clapperboard,
} from "lucide-react";

const BASE_URL = "http://localhost:8000/api";

const isShortVideo = (v) => {
  const t = v?.videoType;
  return Array.isArray(t) ? t.includes("short") : t === "short";
};

function VideoListItem({ video }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl">
      <div className="w-16 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            className="w-full h-full object-cover"
            alt={video.title}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-200 truncate">{video.title}</p>
        <p className="text-xs text-amber-400">{video.channelName}</p>
      </div>
      <span className="text-xs text-gray-500">{video.views || 0} views</span>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 15 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState("videos");
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "creator",
    trustScore: 50,
    rewardPoints: 0,
  });

  const fetchUsers = async (pageNum = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/alluser`, {
        params: { page: pageNum, limit: 15, search: searchTerm },
      });

      setUsers(res.data?.data || []);
      setPagination(res.data?.pagination || { total: 0, pages: 1, limit: 15 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ========== FULL DETAILS BY ID ==========
  const openDetail = async (userId) => {
    try {
      setDetailLoading(true);
      setDetailModal(true);
      setSelectedUser(null);
      setSelectedChannel(null);
      setActiveMediaTab("videos");

      const res = await axios.get(`${BASE_URL}/admin/users/${userId}`);
      const data = res.data?.data || null;
      setSelectedUser(data);
      setSelectedChannel(data?.channels?.[0] || null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load user details");
      setDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "creator",
      trustScore: user.trustScore ?? 50,
      rewardPoints: user.rewardPoints ?? 0,
    });
    setEditModal(true);
  };

  const openEditFromDetail = () => {
    if (!selectedUser) return;
    setDetailModal(false);
    openEdit(selectedUser);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      await axios.put(`${BASE_URL}/users/${selectedUser._id}`, formData);
      toast.success("User updated successfully");
      setEditModal(false);
      fetchUsers(page, search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers(page, search);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ========== SELECTED CHANNEL CONTENT ==========
  const { channelVideos, channelShorts } = useMemo(() => {
    const list = selectedChannel?.videos || [];
    return {
      channelVideos: list.filter((v) => !isShortVideo(v)),
      channelShorts: list.filter((v) => isShortVideo(v)),
    };
  }, [selectedChannel]);

  const roleColor = (role) => {
    if (role === "admin")
      return "bg-purple-500/15 text-purple-400 border border-purple-500/20";
    if (role === "creator")
      return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
    return "bg-gray-500/15 text-gray-400 border border-gray-500/20";
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pagination.total} total users
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       w-72 text-gray-100 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-indigo-400 mb-3" />
            <p className="text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <User size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Channels</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Videos</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Trust</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase min-w-[160px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            user.name?.charAt(0)?.toUpperCase() || "U"
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-200 truncate">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${roleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Tv size={15} className="text-amber-400" />
                        <span className="font-semibold text-gray-300">{user.totalChannels}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Video size={15} className="text-blue-400" />
                        <span className="font-semibold text-gray-300">{user.totalVideos}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-300">
                        {user.trustScore}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetail(user._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                                     text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 
                                     border border-emerald-500/20 rounded-lg transition"
                          title="View Full Details"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          onClick={() => openEdit(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                                     text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 
                                     border border-indigo-500/20 rounded-lg transition"
                          title="Edit User"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                                     text-red-400 bg-red-500/10 hover:bg-red-500/20 
                                     border border-red-500/20 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Page {pagination.page || page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg border border-gray-700 text-gray-400 
                           hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-gray-700 text-gray-400 
                           hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========== DETAIL MODAL ========== */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setDetailModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-indigo-400 mb-3" />
                <p className="text-gray-400">Loading full details...</p>
              </div>
            ) : selectedUser ? (
              <div className="p-5 space-y-5">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-bold">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        className="w-16 h-16 rounded-full object-cover"
                        alt={selectedUser.name}
                      />
                    ) : (
                      selectedUser.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <span
                      className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${roleColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-amber-400">
                      {selectedUser.totalChannels}
                    </p>
                    <p className="text-xs text-amber-500/80">Channels</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {selectedUser.totalVideos}
                    </p>
                    <p className="text-xs text-blue-500/80">Videos</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-emerald-400">
                      {selectedUser.trustScore}
                    </p>
                    <p className="text-xs text-emerald-500/80">Trust Score</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {selectedUser.rewardPoints}
                    </p>
                    <p className="text-xs text-purple-500/80">Points</p>
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Tv size={18} className="text-amber-400" />
                    Channels ({selectedUser.totalChannels})
                  </h4>
                  {!selectedUser.channels?.length ? (
                    <p className="text-sm text-gray-500">No channels found</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUser.channels.map((ch) => {
                        const isActive = selectedChannel?._id === ch._id;
                        return (
                          <button
                            key={ch._id}
                            type="button"
                            onClick={() => setSelectedChannel(ch)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                              isActive
                                ? "bg-amber-500/10 border-amber-500/30"
                                : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                              {ch.channelImage ? (
                                <img
                                  src={ch.channelImage}
                                  className="w-10 h-10 rounded-lg object-cover"
                                  alt={ch.name}
                                />
                              ) : (
                                <Tv size={18} className="text-amber-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p
                                className={`font-medium truncate ${
                                  isActive ? "text-amber-200" : "text-gray-200"
                                }`}
                              >
                                {ch.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {ch.totalVideos} videos
                              </p>
                            </div>
                            {isActive && (
                              <Check
                                size={18}
                                className="text-amber-400 flex-shrink-0"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Media Tabs */}
                <div>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab("videos")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition ${
                        activeMediaTab === "videos"
                          ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                          : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <Video size={16} />
                      Videos ({channelVideos.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab("shorts")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition ${
                        activeMediaTab === "shorts"
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                          : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      }`}
                    >
                      <Clapperboard size={16} />
                      Shorts ({channelShorts.length})
                    </button>
                  </div>

                  {activeMediaTab === "videos" ? (
                    channelVideos.length === 0 ? (
                      <p className="text-sm text-gray-500">No videos found</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {channelVideos.map((v) => (
                          <VideoListItem key={v._id} video={v} />
                        ))}
                      </div>
                    )
                  ) : channelShorts.length === 0 ? (
                    <p className="text-sm text-gray-500">No shorts found</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {channelShorts.map((v) => (
                        <VideoListItem key={v._id} video={v} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Update Button */}
                <div className="pt-2 border-t border-gray-800">
                  <button
                    onClick={openEditFromDetail}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Edit size={18} />
                    Update User
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                User not found
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== EDIT MODAL ========== */}
      {editModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Edit User</h2>
              <button
                onClick={() => setEditModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Trust Score</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.trustScore}
                    onChange={(e) =>
                      setFormData({ ...formData, trustScore: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                               text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Reward Points</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.rewardPoints}
                    onChange={(e) =>
                      setFormData({ ...formData, rewardPoints: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                               text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg 
                             font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}