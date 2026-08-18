import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  Users,
  Mail,
  Shield,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Lock,
  EyeOff,
  BriefcaseBusiness,
  Phone,
  Calendar,
  Camera,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import API from "../../../api";
import toast from "react-hot-toast";
import { hasFeature } from "../../../config/roleConfig";

// Country list
const countries = [
  { name: "India", code: "IN", dial: "+91" },
  { name: "United States", code: "US", dial: "+1" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "UAE", code: "AE", dial: "+971" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Russia", code: "RU", dial: "+7" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Pakistan", code: "PK", dial: "+92" },
  { name: "Bangladesh", code: "BD", dial: "+880" },
  { name: "Nepal", code: "NP", dial: "+977" },
  { name: "Sri Lanka", code: "LK", dial: "+94" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "Indonesia", code: "ID", dial: "+62" },
  { name: "Thailand", code: "TH", dial: "+66" },
  { name: "Philippines", code: "PH", dial: "+63" },
  { name: "Vietnam", code: "VN", dial: "+84" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "Switzerland", code: "CH", dial: "+41" },
  { name: "Sweden", code: "SE", dial: "+46" },
  { name: "Norway", code: "NO", dial: "+47" },
  { name: "Denmark", code: "DK", dial: "+45" },
  { name: "Finland", code: "FI", dial: "+358" },
  { name: "Poland", code: "PL", dial: "+48" },
  { name: "Turkey", code: "TR", dial: "+90" },
  { name: "Egypt", code: "EG", dial: "+20" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "New Zealand", code: "NZ", dial: "+64" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "Argentina", code: "AR", dial: "+54" },
  { name: "Chile", code: "CL", dial: "+56" },
  { name: "Colombia", code: "CO", dial: "+57" },
  { name: "Ireland", code: "IE", dial: "+353" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Belgium", code: "BE", dial: "+32" },
  { name: "Austria", code: "AT", dial: "+43" },
  { name: "Israel", code: "IL", dial: "+972" },
  { name: "Qatar", code: "QA", dial: "+974" },
  { name: "Kuwait", code: "KW", dial: "+965" },
  { name: "Bahrain", code: "BH", dial: "+973" },
  { name: "Oman", code: "OM", dial: "+968" },
  { name: "Hong Kong", code: "HK", dial: "+852" },
  { name: "Taiwan", code: "TW", dial: "+886" },
];

export default function UsersManagement() {
  const navigate = useNavigate();

  // ========== All Users State ==========
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 1,
  });

  // ========== Modal + Form State ==========
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    contactNumber: "",
    dateOfJoining: "",
    experienceYears: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dial.includes(countrySearch)
  );

  // ========== Fetch Users ==========
  const fetchUsers = async (pageNum = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const res = await API.get("/admin/roles");

      if (res.data.success) {
        setUsers(res.data.data || []);
        setPagination({
          page: 1,
          limit: res.data.data?.length || 15,
          total: res.data.data?.length || 0,
          pages: 1,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ========== Form Handlers ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber") {
      const onlyNums = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    toast.error("Copy / Paste not allowed");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
      contactNumber: "",
      dateOfJoining: "",
      experienceYears: "",
    });
    setProfilePhoto(null);
    setPhotoPreview(null);
    setSelectedCountry(countries[0]);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (formData.contactNumber.length < 7) {
      toast.error("Please enter a valid contact number");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullContact = `${selectedCountry.dial}${formData.contactNumber}`;
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      data.append("contactNumber", fullContact);
      data.append("countryCode", selectedCountry.dial);
      data.append("dateOfJoining", formData.dateOfJoining);
      data.append("experienceYears", formData.experienceYears);
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      const res = await API.post("/admin/employee/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Registration failed");
      }

      toast.success(res.data.message || "Employee created successfully!");
      setShowAddModal(false);
      resetForm();
      fetchUsers(page, search);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await API.delete(`/admin/users/${id}`);
      if (res.data.success) {
        toast.success("User deleted");
        fetchUsers(page, search);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ========== View Employee ==========
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-400" />
              All Users
            </h1>
            <p className="text-gray-400 mt-1">
              Manage users & create new employees
            </p>
          </div>

          {hasFeature("canCreateEmployee") && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-indigo-900/30"
            >
              <UserPlus size={18} />
              Add Employee
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800/80 text-gray-300 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-800/40 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                            {user.profilePhoto ? (
                              <img
                                src={user.profilePhoto}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-medium">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.contactNumber || "No contact"} •{" "}
                              {user.experienceYears ?? 0} yrs
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-gray-500" />
                          {user.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-indigo-500/20 text-indigo-300"
                              : user.role === "finance"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : user.role === "support"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          <Shield size={12} />
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {user.isActive !== false ? (
                          <span className="text-emerald-400 text-sm flex items-center gap-1">
                            <CheckCircle2 size={14} /> Active
                          </span>
                        ) : (
                          <span className="text-red-400 text-sm flex items-center gap-1">
                            <XCircle size={14} /> Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(user)}
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                            title="View Employee"
                          >
                            <Eye size={16} />
                          </button>
                          {hasFeature("canCreateEmployee") && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Delete Employee"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.pages} •{" "}
                {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== VIEW EMPLOYEE MODAL ==================== */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-indigo-600 text-white px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold">Employee Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Photo + Name */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-indigo-500/50 overflow-hidden flex items-center justify-center mb-3">
                  {selectedUser.profilePhoto ? (
                    <img
                      src={selectedUser.profilePhoto}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-white font-bold">
                      {selectedUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{selectedUser.email}</p>

                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.role === "admin"
                        ? "bg-indigo-500/20 text-indigo-300"
                        : selectedUser.role === "finance"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : selectedUser.role === "support"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    <Shield size={12} />
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Phone size={14} />
                    Contact Number
                  </div>
                  <p className="text-white font-medium">
                    {selectedUser.contactNumber || "—"}
                  </p>
                </div>

                {/* Country Code */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Phone size={14} />
                    Country Code
                  </div>
                  <p className="text-white font-medium">
                    {selectedUser.countryCode || "—"}
                  </p>
                </div>

                {/* Date of Joining */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Calendar size={14} />
                    Date of Joining
                  </div>
                  <p className="text-white font-medium">
                    {selectedUser.dateOfJoining
                      ? new Date(
                          selectedUser.dateOfJoining
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                {/* Experience */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Briefcase size={14} />
                    Experience
                  </div>
                  <p className="text-white font-medium">
                    {selectedUser.experienceYears
                      ? `${selectedUser.experienceYears} Years`
                      : "—"}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Shield size={14} />
                    Status
                  </div>
                  <p className="text-white font-medium">
                    {selectedUser.isActive !== false ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={16} /> Active
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <XCircle size={16} /> Inactive
                      </span>
                    )}
                  </p>
                </div>

                {/* Joined On */}
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Calendar size={14} />
                    Account Created
                  </div>
                  <p className="text-white font-medium">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD EMPLOYEE MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-indigo-600 text-white px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold">Add New Employee</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
              autoComplete="off"
            >
              {/* Profile Photo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-7 h-7 text-gray-500" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-full cursor-pointer">
                    <Camera size={12} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-9 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="employee@gmail.com"
                      className="w-full pl-9 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Contact Number
                  </label>
                  <div className="relative flex">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryList(!showCountryList)}
                        className="h-full flex items-center gap-1 px-3 py-2.5 bg-gray-800 border border-gray-700 border-r-0 rounded-l-lg text-white text-sm min-w-[85px]"
                      >
                        {selectedCountry.dial}
                        <ChevronDown size={14} className="text-gray-400" />
                      </button>
                      {showCountryList && (
                        <div className="absolute top-full left-0 mt-1 w-60 max-h-48 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                          <div className="sticky top-0 p-2 bg-gray-800 border-b border-gray-700">
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search..."
                              className="w-full px-2 py-1.5 bg-gray-900 border border-gray-600 text-white text-sm rounded outline-none"
                              autoFocus
                            />
                          </div>
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setShowCountryList(false);
                                setCountrySearch("");
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-indigo-600/30 flex justify-between"
                            >
                              <span>{c.name}</span>
                              <span className="text-gray-400">{c.dial}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        maxLength={15}
                        placeholder="9876543210"
                        className="w-full pl-9 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-r-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Date of Joining
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Experience + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Experience (Years)
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      required
                      min="0"
                      max="50"
                      step="0.5"
                      placeholder="2.5"
                      className="w-full pl-9 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="finance">Finance</option>
                      <option value="support">Support</option>
                      <option value="read-only">Read Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onCopy={preventCopyPaste}
                      onPaste={preventCopyPaste}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onCopy={preventCopyPaste}
                      onPaste={preventCopyPaste}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                {hasFeature("canCreateEmployee") && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-lg font-medium transition"
                  >
                    {isSubmitting ? "Creating..." : "Create Employee"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}