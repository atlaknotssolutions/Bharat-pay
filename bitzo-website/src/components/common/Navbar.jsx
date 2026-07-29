// import React, { useState, useRef, useEffect, use } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Menu,
//   Search,
//   Mic,
//   Plus,
//   Bell,
//   Star,
//   User,
//   Settings,
//   LogOut,
//   Wallet,
//   History,
//   Heart,
//   Clock,
//   Video,
//   ChevronRight,
//   ChevronDown,
//   HelpCircle,
//   FileText,
//   MessageCircle,
//   PhoneCall,
// } from "lucide-react";
// import { useRewards } from "../../context/RewardContext";
// import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";

// export default function Navbar({ toggleSidebar }) {
//   const { points } = useRewards();
//   const navigate = useNavigate();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     Boolean(localStorage.getItem("token")),
//   );
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch user profile when logged in
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!isLoggedIn) return;

//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`${API_BASE_URL}/api/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setUser(response.data.user || response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Profile fetch failed:", error);
//         if (error.response?.status === 401) {
//           // Token invalid/expired → logout
//           handleSignOut();
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();

//     // Listen for auth changes from other tabs/components
//     const handleAuthChange = () => {
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(Boolean(token));
//       if (token) fetchProfile();
//       else setUser(null);
//     };

//     globalThis.addEventListener("auth-change", handleAuthChange);
//     globalThis.addEventListener("storage", handleAuthChange);

//     return () => {
//       globalThis.removeEventListener("auth-change", handleAuthChange);
//       globalThis.removeEventListener("storage", handleAuthChange);
//     };
//   }, [isLoggedIn]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//         setIsSettingsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//     setIsSettingsOpen(false);
//   };

//   const handleSignOut = async () => {
//     try {
//       // Optional: Call logout API if your backend has one
//       const token = localStorage.getItem("token");
//       if (token) {
//         await axios
//           .post(
//             `${API_BASE_URL}/api/logout`,
//             {},
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             },
//           )
//           .catch((err) => {
//             console.log("Logout API failed (continuing anyway):", err);
//           });
//       }
//     } catch (err) {
//       console.error("Sign out error:", err);
//     } finally {
//       // Clear local storage
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       setUser(null);
//       setIsLoggedIn(false);
//       setIsDropdownOpen(false);
//       setIsSettingsOpen(false);

//       // Notify other tabs/components
//       window.dispatchEvent(new Event("auth-change"));

//       navigate("/login");
//     }
//   };

//   // Fallback avatar letter
//   const getInitial = () => {
//     return user?.name ? user.name.charAt(0).toUpperCase() : "U";
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b border-gray-800 h-14 flex items-center">
//       <div className="flex items-center justify-between w-full px-4">
//         {/* Left side */}
//         <div className="flex items-center gap-4 md:gap-6">
//           <button
//             onClick={toggleSidebar}
//             className="p-2 hover:bg-[#272727] rounded-full transition-colors"
//           >
//             <Menu size={24} className="text-white" />
//           </button>
//           <div className="flex items-center gap-3">
//             <span className="text-red-600 text-3xl font-bold">Vidoo</span>
//             <div className="hidden sm:flex items-center gap-1.5 bg-[#272727] px-3 py-1 rounded-full border border-yellow-600/30">
//               <Star size={18} className="text-yellow-400 fill-yellow-400" />
//               <span className="text-white font-semibold text-sm">
//                 {points.toFixed(2)}
//               </span>
//               <span className="text-gray-400 text-xs">pts</span>
//             </div>
//           </div>
//         </div>

//         {/* Center: Search */}
//         <div className="flex-1 max-w-2xl mx-8 hidden md:flex">
//           <div className="relative w-full">
//             <input
//               type="text"
//               placeholder="Search"
//               className="w-full bg-[#121212] border border-gray-700 rounded-l-full py-2 px-5 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
//             />
//             <button className="absolute right-0 top-0 bottom-0 bg-[#222] px-6 rounded-r-full border border-gray-700 border-l-0 hover:bg-[#333] transition-colors">
//               <Search size={20} className="text-gray-300" />
//             </button>
//           </div>
//         </div>

//         {/* Right side */}
//         <div className="flex items-center gap-4 sm:gap-6">
//           <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block">
//             <Mic size={22} className="text-white" />
//           </button>

//           <Link
//             to="/uploadvideo"
//             className="p-2 hover:bg-[#272727] rounded-full transition-colors flex items-center justify-center"
//           >
//             <Plus size={22} className="text-white" />
//           </Link>

//           <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block">
//             <Bell size={22} className="text-white" />
//           </button>

//           {/* Profile / Auth section */}
//           <div className="relative" ref={dropdownRef}>
//             {isLoggedIn ? (
//               <button
//                 onClick={toggleDropdown}
//                 className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <span className="text-white text-sm font-semibold">
//                     {getInitial()}
//                   </span>
//                 )}
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/login")}
//                 className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition"
//               >
//                 Sign in
//               </button>
//             )}

//             {isLoggedIn && isDropdownOpen && (
//               <div className="absolute right-0 mt-3 w-80 bg-[#0f0f0f] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 text-white">
//                 {/* User Header */}
//                 {/* User Header with Real Avatar */}
//                 <div className="px-5 py-5 border-b border-gray-800 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
//                   <div className="flex items-center gap-4">
//                     {/* Avatar - Real Image ya Initial Fallback */}
//                     <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0 shadow-md overflow-hidden">
//                       {user?.avatar ? (
//                         <img
//                           src={user.avatar}
//                           alt={user.name || "User"}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             // Agar image load na ho to fallback initial dikhaye
//                             e.target.style.display = "none";
//                             e.target.parentElement.innerHTML = `
//               <span class="text-2xl font-bold text-white flex items-center justify-center h-full">
//                 ${user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//               </span>
//             `;
//                           }}
//                         />
//                       ) : (
//                         <span className="text-2xl font-bold text-white flex items-center justify-center h-full">
//                           {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
//                         </span>
//                       )}
//                     </div>

//                     {/* User Info */}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-lg font-semibold truncate">
//                         {user?.name || "User"}
//                       </p>
//                       <p className="text-sm text-gray-400 mt-0.5 truncate">
//                         {user?.email || "@username"}
//                       </p>

//                       <div className="flex items-center gap-1.5 mt-1 text-xs text-yellow-400">
//                         <Star size={14} className="fill-yellow-400" />
//                         <span>{points.toFixed(0)} pts</span>
//                       </div>

//                       <button
//                         onClick={() => {
//                           navigate(
//                             `/channel/${user?._id || user?.email || "me"}`,
//                           );
//                           setIsDropdownOpen(false);
//                         }}
//                         className="mt-3 w-full py-2 bg-[#272727] hover:bg-[#3a3a3a] rounded text-sm font-medium transition-colors"
//                       >
//                         View your channel
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Navigation Items */}
//                 <div className="py-1">
//                   <button
//                     onClick={() => {
//                       navigate("/profile");
//                       setIsDropdownOpen(false);
//                     }}
//                     className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition"
//                   >
//                     <User size={20} className="text-gray-300" />
//                     <span>My Profile</span>
//                   </button>

//                   <button
//                     onClick={() => {
//                       navigate("/studio");
//                       setIsDropdownOpen(false);
//                     }}
//                     className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition"
//                   >
//                     <Video size={20} className="text-gray-300" />
//                     <span>Vidoo Studio</span>
//                   </button>

//                   {/* Settings Submenu */}
//                   <div className="relative">
//                     <button
//                       onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//                       className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center justify-between transition"
//                     >
//                       <div className="flex items-center gap-4">
//                         <Settings size={20} className="text-gray-300" />
//                         <span>Settings</span>
//                       </div>
//                       {isSettingsOpen ? (
//                         <ChevronDown size={18} />
//                       ) : (
//                         <ChevronRight size={18} />
//                       )}
//                     </button>

//                     {isSettingsOpen && (
//                       <div className="bg-[#1a1a1a] border-t border-b border-gray-800 py-1">
//                         <button
//                           onClick={() => {
//                             navigate("/history");
//                             setIsDropdownOpen(false);
//                             setIsSettingsOpen(false);
//                           }}
//                           className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
//                         >
//                           <History size={18} />
//                           <span>History</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             navigate("/liked-videos");
//                             setIsDropdownOpen(false);
//                             setIsSettingsOpen(false);
//                           }}
//                           className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
//                         >
//                           <Heart size={18} />
//                           <span>Liked Videos</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             navigate("/watch-later");
//                             setIsDropdownOpen(false);
//                             setIsSettingsOpen(false);
//                           }}
//                           className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
//                         >
//                           <Clock size={18} />
//                           <span>Watch Later</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             navigate("/your-videos");
//                             setIsDropdownOpen(false);
//                             setIsSettingsOpen(false);
//                           }}
//                           className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
//                         >
//                           <Video size={18} />
//                           <span>Your Videos</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <Link
//                     to="/withdraw"
//                     onClick={() => {
//                       setIsDropdownOpen(false);
//                       setIsSettingsOpen(false);
//                     }}
//                     className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 mt-1"
//                   >
//                     <Wallet size={20} className="text-gray-300" />
//                     <span>Withdraw Rewards</span>
//                   </Link>
//                 </div>
//                 <Link
//                   to="/leaderboard"
//                   onClick={() => {
//                     setIsDropdownOpen(false);
//                     setIsSettingsOpen(false);
//                   }}
//                   className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 mt-1"
//                 >
//                   <Wallet size={20} className="text-gray-300" />
//                   <span>Leadbaord Rewards</span>
//                 </Link>
//                 {/* Support & Info */}
//                 <div className="py-1 border-t border-gray-800">
//                   <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
//                     <HelpCircle size={20} className="text-gray-300" />
//                     <span>FAQ</span>
//                   </button>
//                   <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
//                     <MessageCircle size={20} className="text-gray-300" />
//                     <span>Feedback</span>
//                   </button>
//                   <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
//                     <PhoneCall size={20} className="text-gray-300" />
//                     <span>Customer Support</span>
//                   </button>
//                   <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
//                     <FileText size={20} className="text-gray-300" />
//                     <span>Terms and Conditions</span>
//                   </button>

//                   <button
//                     onClick={handleSignOut}
//                     className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 text-red-400 hover:text-red-300"
//                   >
//                     <LogOut size={20} />
//                     <span>Sign out</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Mic,
  Plus,
  Bell,
  Star,
  User,
  Settings,
  LogOut,
  Wallet,
  History,
  Heart,
  Clock,
  Video,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileText,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { useRewards } from "../../context/RewardContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export default function Navbar({ toggleSidebar }) {
  const { points } = useRewards();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user || response.data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
        if (error.response?.status === 401) {
          handleSignOut();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
      if (token) fetchProfile();
      else setUser(null);
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [isLoggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsSettingsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${API_BASE_URL}/api/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => {});
      }
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      setIsSettingsOpen(false);

      window.dispatchEvent(new Event("auth-change"));
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b border-gray-800 h-14 flex items-center">
      <div className="flex items-center justify-between w-full px-4">
        {/* Left side */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#272727] rounded-full transition-colors"
          >
            <Menu size={24} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-red-600 text-3xl font-bold">Vidoo</span>
            <div className="hidden sm:flex items-center gap-1.5 bg-[#272727] px-3 py-1 rounded-full border border-yellow-600/30">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold text-sm">
                {points.toFixed(2)}
              </span>
              <span className="text-gray-400 text-xs">pts</span>
            </div>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-8 hidden md:flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#121212] border border-gray-700 rounded-l-full py-2 px-5 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-[#222] px-6 rounded-r-full border border-gray-700 border-l-0 hover:bg-[#333] transition-colors">
              <Search size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block">
            <Mic size={22} className="text-white" />
          </button>

          <Link
            to="/uploadvideo"
            className="p-2 hover:bg-[#272727] rounded-full transition-colors flex items-center justify-center"
          >
            <Plus size={22} className="text-white" />
          </Link>

          <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block">
            <Bell size={22} className="text-white" />
          </button>

          {/* Profile / Auth section */}
          <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <button
                onClick={toggleDropdown}
                className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition"
              >
                Sign in
              </button>
            )}

            {isLoggedIn && isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#0f0f0f] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 text-white">
                
                {/* User Header with Avatar */}
                <div className="px-5 py-5 border-b border-gray-800 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0 shadow-md overflow-hidden relative">
                      {user?.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.name || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                        
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5 truncate">
                        {user?.email || "@username"}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 text-xs text-yellow-400">
                        <Star size={14} className="fill-yellow-400" />
                        <span>{points.toFixed(0)} pts</span>
                      </div>

                      <button
                        onClick={() => {
                          navigate(`/channel/${user?._id || "me"}`);
                          setIsDropdownOpen(false);
                        }}
                        className="mt-3 w-full py-2 bg-[#272727] hover:bg-[#3a3a3a] rounded text-sm font-medium transition-colors"
                      >
                        View your channel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="py-1">
                  <button
                    onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition"
                  >
                    <User size={20} className="text-gray-300" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => { navigate("/studio"); setIsDropdownOpen(false); }}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition"
                  >
                    <Video size={20} className="text-gray-300" />
                    <span>Vidoo Studio</span>
                  </button>

                  {/* Settings Submenu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-4">
                        <Settings size={20} className="text-gray-300" />
                        <span>Settings</span>
                      </div>
                      {isSettingsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>

                    {isSettingsOpen && (
                      <div className="bg-[#1a1a1a] border-t border-b border-gray-800 py-1">
                        <button onClick={() => { navigate("/history"); setIsDropdownOpen(false); setIsSettingsOpen(false); }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition">
                          <History size={18} />
                          <span>History</span>
                        </button>
                        <button onClick={() => { navigate("/liked-videos"); setIsDropdownOpen(false); setIsSettingsOpen(false); }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition">
                          <Heart size={18} />
                          <span>Liked Videos</span>
                        </button>
                        <button onClick={() => { navigate("/watch-later"); setIsDropdownOpen(false); setIsSettingsOpen(false); }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition">
                          <Clock size={18} />
                          <span>Watch Later</span>
                        </button>
                        <button onClick={() => { navigate("/your-videos"); setIsDropdownOpen(false); setIsSettingsOpen(false); }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition">
                          <Video size={18} />
                          <span>Your Videos</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/withdraw"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 mt-1"
                  >
                    <Wallet size={20} className="text-gray-300" />
                    <span>Withdraw Rewards</span>
                  </Link>
                </div>

                <Link
                  to="/leaderboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 mt-1"
                >
                  <Star size={20} className="text-gray-300" />
                  <span>Leaderboard</span>
                </Link>

                {/* Support & Info */}
                <div className="py-1 border-t border-gray-800">
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <HelpCircle size={20} className="text-gray-300" />
                    <span>FAQ</span>
                  </button>
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <MessageCircle size={20} className="text-gray-300" />
                    <span>Feedback</span>
                  </button>
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <PhoneCall size={20} className="text-gray-300" />
                    <span>Customer Support</span>
                  </button>
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <FileText size={20} className="text-gray-300" />
                    <span>Terms and Conditions</span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 text-red-400 hover:text-red-300"
                  >
                    <LogOut size={20} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}