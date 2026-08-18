

"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { hasFeature } from "../../config/roleConfig";
import { API_BASE_URL } from "../../api";

const BASE_URL = API_BASE_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 15,
  });
  const [selectedUser, setSelectedUser] = useState(null);
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
      const res = await axios.get(`${BASE_URL}/users/alluser`, {
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

      const res = await axios.get(`${BASE_URL}/users/${userId}`);
      setSelectedUser(res.data?.data || null);
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Channels
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Videos
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Trust
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-400 uppercase min-w-[160px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-800/50 transition"
                  >
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
                          <p className="font-medium text-gray-200 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${roleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Tv size={15} className="text-amber-400" />
                        <span className="font-semibold text-gray-300">
                          {user.totalChannels}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Video size={15} className="text-blue-400" />
                        <span className="font-semibold text-gray-300">
                          {user.totalVideos}
                        </span>
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

                    {/* ========== ACTIONS ========== */}
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

                        {hasFeature("canEditUsers") && (
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
                        )}

                        {hasFeature("canDeleteUsers") && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                                       text-red-400 bg-red-500/10 hover:bg-red-500/20 
                                       border border-red-500/20 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
                <Loader2
                  size={40}
                  className="animate-spin text-indigo-400 mb-3"
                />
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
                    <h3 className="text-lg font-bold text-white">
                      {selectedUser.name}
                    </h3>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <span
                      className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${roleColor(
                        selectedUser.role,
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
                  {selectedUser.channels?.length === 0 ? (
                    <p className="text-sm text-gray-500">No channels yet</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUser.channels.map((ch) => (
                        <div
                          key={ch._id}
                          className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
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
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-200 truncate">
                              {ch.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {ch.totalVideos} videos
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos */}
                <div>
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Video size={18} className="text-blue-400" />
                    All Videos ({selectedUser.totalVideos})
                  </h4>
                  {selectedUser.videos?.length === 0 ? (
                    <p className="text-sm text-gray-500">No videos yet</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedUser.videos.map((v) => (
                        <div
                          key={v._id}
                          className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl"
                        >
                          <div className="w-16 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                            {v.thumbnail && (
                              <img
                                src={v.thumbnail}
                                className="w-full h-full object-cover"
                                alt={v.title}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-200 truncate">
                              {v.title}
                            </p>
                            <p className="text-xs text-amber-400">
                              {v.channelName}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {v.views || 0} views
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Update Button */}
                <div className="pt-2 border-t border-gray-800">
                  {hasFeature("canEditUsers") && (
                    <button
                      onClick={openEditFromDetail}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Edit size={18} />
                      Update User
                    </button>
                  )}
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
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
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
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Trust Score
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.trustScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trustScore: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                               text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Reward Points
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.rewardPoints}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rewardPoints: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                               text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {hasFeature("canEditUsers") && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg 
                               font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    Save Changes
                  </button>
                )}
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
