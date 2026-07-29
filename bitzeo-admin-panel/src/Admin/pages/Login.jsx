// // // src/pages/Login.jsx
// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
// //  import axios from 'axios';

// // export default function Login() {
// //   const navigate = useNavigate();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setIsLoading(true);

// //     try {
// //       const response = await fetch('http://localhost:8000/api/admin/login', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ email, password }),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Login failed');
// //       }

// //       // Save token (most common & simple way for admin dashboard)
// //       localStorage.setItem('adminToken', data.token);
// //       // Optional: save user info
// //       localStorage.setItem('adminUser', JSON.stringify(data.admin));

// //       navigate('/', { replace: true });
// //     } catch (err) {
// //       setError(err.message || 'Something went wrong');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
// //       <div className="w-full max-w-md">
// //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
// //           <div className="bg-indigo-600 px-8 py-10 text-center">
// //             <h1 className="text-3xl font-bold text-white">AdminX</h1>
// //             <p className="text-indigo-200 mt-2">Sign in to continue</p>
// //           </div>

// //           <div className="p-8">
// //             {error && (
// //               <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
// //                 {error}
// //               </div>
// //             )}

// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               {/* Email */}
// //               <div>
// //                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
// //                   Email
// //                 </label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     id="email"
// //                     type="email"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
// //                     placeholder="admin@example.com"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Password - same as before */}
// //               <div>
// //                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
// //                   Password
// //                 </label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     id="password"
// //                     type={showPassword ? 'text' : 'password'}
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
// //                     placeholder="••••••••"
// //                     required
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                   >
// //                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="flex items-center justify-between text-sm">
// //                 <label className="flex items-center">
// //                   <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
// //                   <span className="ml-2 text-gray-600">Remember me</span>
// //                 </label>
// //                 <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">
// //                   Forgot password?
// //                 </a>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={isLoading}
// //                 className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
// //               >
// //                 {isLoading ? (
// //                   <span className="flex items-center justify-center">
// //                     <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
// //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
// //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
// //                     </svg>
// //                     Signing in...
// //                   </span>
// //                 ) : (
// //                   'Sign In'
// //                 )}
// //               </button>
// //             </form>
// //           </div>
// //         </div>

// //         <p className="mt-6 text-center text-sm text-gray-500">
// //           © {new Date().getFullYear()} AdminX • Made with ❤️ in Indore
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/Login.jsx

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
// import axios from 'axios';

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:8000/api/admin/login', {
//         email,
//         password,
//       });

//       const { success, token, user, message } = response.data;

//       if (!success) {
//         throw new Error(message || 'Login failed');
//       }

//       // ── Save authentication data ────────────────────────────────
//       localStorage.setItem('adminToken', token);

//       // Optional: save minimal user info (you can expand later)
//       localStorage.setItem('adminUser', JSON.stringify(user));

//       // Optional: "Remember me" → you can skip clearing on browser close
//       // if (!rememberMe) localStorage.removeItem on logout or timeout

//       navigate('/', { replace: true });
//     } catch (err) {
//       // Handle different kinds of errors nicely
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else if (err.message) {
//         setError(err.message);
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//           {/* Header */}
//           <div className="bg-indigo-600 px-8 py-10 text-center">
//             <h1 className="text-3xl font-bold text-white">AdminX</h1>
//             <p className="text-indigo-200 mt-2">Sign in to continue</p>
//           </div>

//           {/* Form Area */}
//           <div className="p-8">
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//                   <input
//                     id="email"
//                     type="email"
//                     autoComplete="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value.trim())}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                     placeholder="admin@example.com"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//                   <input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     autoComplete="current-password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                     placeholder="••••••••"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
//                   />
//                   <span className="ml-2 text-gray-600 select-none">Remember me</span>
//                 </label>

//                 <a
//                   href="#"
//                   className="text-indigo-600 hover:text-indigo-800 hover:underline transition"
//                 >
//                   Forgot password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`
//                   w-full py-3 px-4
//                   bg-indigo-600 hover:bg-indigo-700
//                   text-white font-medium rounded-lg
//                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
//                   transition
//                   disabled:opacity-60 disabled:cursor-not-allowed
//                   flex items-center justify-center gap-2
//                 `}
//               >
//                 {isLoading && (
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                     />
//                   </svg>
//                 )}
//                 {isLoading ? 'Signing in...' : 'Sign In'}
//               </button>
//             </form>
//           </div>
//         </div>

//         <p className="mt-8 text-center text-sm text-gray-500">
//           © {new Date().getFullYear()} AdminX • Made with ❤️ in Indore
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      // Save token & admin info
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      navigate("/", { replace: true });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white text-center py-8">
          <h1 className="text-3xl font-bold">AdminX</h1>
          <p className="text-indigo-200 mt-1">Admin Login</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition flex justify-center"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
