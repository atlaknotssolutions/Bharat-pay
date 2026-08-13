// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 8) {
//       toast.error("Password must be at least 8 characters");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await axios.post(
//         "https://bharat-pay.onrender.com/api/admin/register", // ← apna endpoint check kar lena
//         {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (!res.data.success) {
//         throw new Error(res.data.message || "Registration failed");
//       }

//       toast.success(res.data.message || "Registered successfully!");
//       navigate("/login");
//     } catch (err) {
//       const message =
//         err.response?.data?.message ||
//         err.message ||
//         "Registration failed. Please try again.";
//       toast.error(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="bg-indigo-600 text-white text-center py-8">
//           <h1 className="text-3xl font-bold">AdminX</h1>
//           <p className="text-indigo-200 mt-1">Create Admin Account</p>
//         </div>

//         <div className="p-8">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   placeholder="John Doe"
//                   className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   placeholder="admin@gmail.com"
//                   className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   placeholder="••••••••"
//                   className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   placeholder="••••••••"
//                   className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition"
//             >
//               {isLoading ? "Creating Account..." : "Register"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 mt-6">
//             Already have an account?{" "}
//             <Link to="/login" className="text-indigo-600 font-medium hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://bharat-pay.onrender.com/api/admin/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Registration failed");
      }

      toast.success(res.data.message || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white text-center py-8">
          <h1 className="text-3xl font-bold tracking-tight">AdminX</h1>
          <p className="text-indigo-200 mt-1">Create Admin Account</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg 
                             placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg 
                             placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg 
                             placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg 
                             placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed 
                         text-white py-3 rounded-lg font-medium transition-all duration-200 mt-2"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
