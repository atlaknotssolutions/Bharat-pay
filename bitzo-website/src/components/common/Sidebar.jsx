
// import React, { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   Home,
//   Flame,
//   PlusCircle,
//   Library,
//   User,
//   ChevronDown,
//   ChevronUp,
//   Tv,           
// } from "lucide-react";

// const sidebarMainItems = [
//   { icon: Home, label: "Home", path: "/" },
//   { icon: Flame, label: "Shorts", path: "/shorts" },
//   { icon: PlusCircle, label: "Upload", path: "/uploadvideo" },
//   { icon: Library, label: "You", path: "/profile" },
// ];

// // Sample subscriptions (in real app → fetch from API / user context)
// const subscriptionData = [
//   { name: "AB Cricinfo", avatar: "🔴", path: "/channel/abcricinfo" },
//   { name: "SonyMusicIndia...", avatar: "🎵", path: "/channel/sonymusicindia" },
//   { name: "T-Series", avatar: "🎤", path: "/channel/tseries" },
//   { name: "Geet MP3", avatar: "🎧", path: "/channel/geetmp3" },
//   { name: "Single Track Studio", avatar: "🎼", path: "/channel/singletrackstudio" },
//   { name: "Bankers Way by ...", avatar: "💼", path: "/channel/bankersway" },
//   { name: "Unacademy GATE", avatar: "📚", path: "/channel/unacademygate" },
//   // You can add 10–20 more — only first 6–7 shown initially
// ];

// const bottomNavItems = [
//   { icon: Home, label: "Home", path: "/" },
//   { icon: Flame, label: "Shorts", path: "/shorts" },
//   {
//     icon: PlusCircle,
//     label: "Upload",
//     path: "/uploadvideo",
//     isCenter: true,
//   },
//   { icon: User, label: "You", path: "/profile" },

  
// ];

// export default function Navigation({ isOpen }) {
//   const location = useLocation();
//   const [showAllSubs, setShowAllSubs] = useState(false);

//   // Show first 6 by default, rest on "Show more"
//   const visibleSubs = showAllSubs 
//     ? subscriptionData 
//     : subscriptionData.slice(0, 6);

//   const hasMore = subscriptionData.length > 6;

//   return (
//     <>
    
//       {/* ===== DESKTOP / TABLET SIDEBAR ===== */}
//       <aside
//         className={`
//           hidden md:block fixed top-14 left-0 z-40
//           h-[calc(100vh-3.5rem)]
//           bg-[#0f0f0f] border-r border-gray-800
//           overflow-y-auto
//           transition-all duration-300
//           ${isOpen ? "w-64" : "w-16 hover:w-64 group/sidebar"}
//         `}
//       >
//         <div className="py-2 flex flex-col">

//           {/* Main navigation items */}
//           {sidebarMainItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className={`
//                   group/item relative flex items-center gap-6
//                   px-5 py-3 text-sm font-medium
//                   transition-all
//                   hover:bg-[#272727]
//                   ${isActive ? "bg-[#272727] text-white" : "text-gray-300"}
//                 `}
//               >
//                 <Icon
//                   size={24}
//                   strokeWidth={isActive ? 2.5 : 1.8}
//                   className={isActive ? "text-white" : "text-gray-300"}
//                 />

//                 <span
//                   className={`
//                     whitespace-nowrap transition-opacity
//                     ${isOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"}
//                   `}
//                 >
//                   {item.label}
//                 </span>

//                 {isActive && (
//                   <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full" />
//                 )}
//               </NavLink>
//             );
//           })}

//           {/* ===== SUBSCRIPTIONS SECTION ===== */}
//           {isOpen && (
//             <>
//               {/* Separator */}
//               <div className="h-px bg-gray-800 my-2 mx-6" />

//               {/* Section header */}
//               <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
//                 Subscriptions
//               </div>

//               {/* Subscription list */}
//               {visibleSubs.map((sub, index) => {
//                 const isActive = location.pathname === sub.path;

//                 return (
//                   <NavLink
//                     key={index}
//                     to={sub.path}
//                     className={`
//                       group/item relative flex items-center gap-5
//                       px-5 py-2.5 text-sm
//                       transition-all
//                       hover:bg-[#272727]
//                       ${isActive ? "bg-[#272727] text-white" : "text-gray-300"}
//                     `}
//                   >
//                     {/* Avatar / Icon */}
//                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
//                       {sub.avatar}
//                     </div>

//                     <span className="truncate">
//                       {sub.name}
//                     </span>

//                     {isActive && (
//                       <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
//                     )}
//                   </NavLink>
//                 );
//               })}

//               {/* Show more / Show less */}
//               {hasMore && (
//                 <button
//                   onClick={() => setShowAllSubs(!showAllSubs)}
//                   className={`
//                     flex items-center gap-5
//                     px-5 py-2.5 text-sm text-gray-300
//                     hover:bg-[#272727] w-full text-left
//                     transition-all
//                   `}
//                 >
//                   <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
//                     {showAllSubs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                   </div>
//                   <span>
//                     {showAllSubs ? "Show less" : "Show more"}
//                   </span>
//                 </button>
//               )}
//             </>
//           )}

//           {/* Collapsed mode: just show Subscriptions icon */}
//           {!isOpen && (
//             <div className="group/item relative flex items-center justify-center py-3 hover:bg-[#272727]">
//               <Tv size={24} className="text-gray-300 group-hover:text-white" />
//               {/* Tooltip on hover */}
//               <div className="
//                 absolute left-full ml-2 px-3 py-1.5
//                 bg-[#1f1f1f] text-white text-sm rounded
//                 opacity-0 group-hover:opacity-100
//                 pointer-events-none whitespace-nowrap
//                 border border-gray-700 shadow-xl
//               ">
//                 Subscriptions
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ===== MOBILE BOTTOM NAV ===== */}
//       <nav
//         className="
//           md:hidden fixed bottom-0 inset-x-0 z-50
//           bg-[#0f0f0f]/90 backdrop-blur-xl
//           border-t border-gray-800
//           flex items-center justify-around h-[4.5rem]
//         "
//       >
//         {bottomNavItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;
//           const isCenter = item.isCenter;

//           if (isCenter) {
//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 className="
//                   relative -top-6 w-16 h-16
//                   flex items-center justify-center
//                   rounded-full bg-red-600 text-white
//                   shadow-lg active:scale-95
//                 "
//               >
//                 <Icon size={32} />
//               </NavLink>
//             );
//           }

//           return (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={`
//                 flex flex-col items-center justify-center flex-1
//                 transition-all
//                 ${isActive ? "text-white" : "text-gray-400"}
//               `}
//             >
//               <Icon size={26} strokeWidth={isActive ? 2.6 : 2} />
//               <span className="text-[10px] mt-1">{item.label}</span>

//               {isActive && (
//                 <span className="mt-1 w-6 h-1 bg-white rounded-full" />
//               )}
//             </NavLink>
//           );
//         })}
//       </nav>
//     </>
//   );
// }





import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Flame,
  PlusCircle,
  Library,
  User,
  ChevronDown,
  ChevronUp,
  Tv,
  History,
  Heart,
  Clock,
  Video,
} from "lucide-react";

const sidebarMainItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Flame, label: "Shorts", path: "/shorts" },
  { icon: PlusCircle, label: "Upload", path: "/uploadvideo" },
  { icon: Library, label: "You", path: "/profile" },
];

// Sample subscriptions (in real app → fetch from API / user context)
const subscriptionData = [
  { name: "AB Cricinfo", avatar: "🔴", path: "/channel/abcricinfo" },
  { name: "SonyMusicIndia...", avatar: "🎵", path: "/channel/sonymusicindia" },
  { name: "T-Series", avatar: "🎤", path: "/channel/tseries" },
  { name: "Geet MP3", avatar: "🎧", path: "/channel/geetmp3" },
  { name: "Single Track Studio", avatar: "🎼", path: "/channel/singletrackstudio" },
  { name: "Bankers Way by ...", avatar: "💼", path: "/channel/bankersway" },
  { name: "Unacademy GATE", avatar: "📚", path: "/channel/unacademygate" },
];

const bottomNavItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Flame, label: "Shorts", path: "/shorts" },
  {
    icon: PlusCircle,
    label: "Upload",
    path: "/uploadvideo",
    isCenter: true,
  },
  { icon: User, label: "You", path: "/profile" },
];

export default function Navigation({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAllSubs, setShowAllSubs] = useState(false);
  const [isYouDropdownOpen, setIsYouDropdownOpen] = useState(false);

  // Show first 6 subscriptions by default
  const visibleSubs = showAllSubs ? subscriptionData : subscriptionData.slice(0, 6);
  const hasMore = subscriptionData.length > 6;

  // Close dropdown when clicking outside or navigating
  const handleYouClick = (e) => {
    e.preventDefault(); // prevent navigation on click
    setIsYouDropdownOpen((prev) => !prev);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsYouDropdownOpen(false); // close dropdown after navigation
  };

  return (
    <>
      {/* ===== DESKTOP / TABLET SIDEBAR ===== */}
      <aside
        className={`
          hidden md:block fixed top-14 left-0 z-40
          h-[calc(100vh-3.5rem)]
          bg-[#0f0f0f] border-r border-gray-800
          overflow-y-auto
          transition-all duration-300
          ${isOpen ? "w-64" : "w-16 hover:w-64 group/sidebar"}
        `}
      >
        <div className="py-2 flex flex-col">
          {/* Main navigation items */}
          {sidebarMainItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isYouItem = item.label === "You";

            if (isYouItem) {
              return (
                <div key={item.path} className="relative">
                  <button
                    onClick={handleYouClick}
                    className={`
                      group/item relative flex items-center gap-6
                      px-5 py-3 text-sm font-medium w-full text-left
                      transition-all hover:bg-[#272727]
                      ${isActive ? "bg-[#272727] text-white" : "text-gray-300"}
                    `}
                  >
                    <Icon
                      size={24}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={isActive ? "text-white" : "text-gray-300"}
                    />

                    <div className="flex items-center justify-between flex-1">
                      <span
                        className={`
                          whitespace-nowrap transition-opacity
                          ${isOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"}
                        `}
                      >
                        {item.label}
                      </span>
                      {isOpen && (
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isYouDropdownOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>

                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full" />
                    )}
                  </button>

                  {/* Dropdown for "You" */}
                  {isYouDropdownOpen && isOpen && (
                    <div className="bg-[#1a1a1a] border-t border-b border-gray-800 py-1">
                      <button
                        onClick={() => handleNavClick("/history")}
                        className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                      >
                        <History size={18} />
                        <span>History</span>
                      </button>
                      <button
                        onClick={() => handleNavClick("/liked-videos")}
                        className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                      >
                        <Heart size={18} />
                        <span>Liked Videos</span>
                      </button>
                      <button
                        onClick={() => handleNavClick("/watch-later")}
                        className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                      >
                        <Clock size={18} />
                        <span>Watch Later</span>
                      </button>
                      <button
                        onClick={() => handleNavClick("/your-videos")}
                        className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                      >
                        <Video size={18} />
                        <span>Your Videos</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  group/item relative flex items-center gap-6
                  px-5 py-3 text-sm font-medium
                  transition-all hover:bg-[#272727]
                  ${isActive ? "bg-[#272727] text-white" : "text-gray-300"}
                `}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-white" : "text-gray-300"}
                />

                <span
                  className={`
                    whitespace-nowrap transition-opacity
                    ${isOpen ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"}
                  `}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full" />
                )}
              </NavLink>
            );
          })}

          {/* ===== SUBSCRIPTIONS SECTION ===== */}
          {isOpen && (
            <>
              <div className="h-px bg-gray-800 my-2 mx-6" />

              <div className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Subscriptions
              </div>

              {visibleSubs.map((sub, index) => {
                const isActive = location.pathname === sub.path;

                return (
                  <NavLink
                    key={index}
                    to={sub.path}
                    className={`
                      group/item relative flex items-center gap-5
                      px-5 py-2.5 text-sm
                      transition-all hover:bg-[#272727]
                      ${isActive ? "bg-[#272727] text-white" : "text-gray-300"}
                    `}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                      {sub.avatar}
                    </div>
                    <span className="truncate">{sub.name}</span>

                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}
                  </NavLink>
                );
              })}

              {hasMore && (
                <button
                  onClick={() => setShowAllSubs(!showAllSubs)}
                  className={`
                    flex items-center gap-5
                    px-5 py-2.5 text-sm text-gray-300
                    hover:bg-[#272727] w-full text-left transition-all
                  `}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {showAllSubs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <span>{showAllSubs ? "Show less" : "Show more"}</span>
                </button>
              )}
            </>
          )}

          {/* Collapsed mode: Subscriptions icon */}
          {!isOpen && (
            <div className="group/item relative flex items-center justify-center py-3 hover:bg-[#272727]">
              <Tv size={24} className="text-gray-300 group-hover:text-white" />
              <div
                className="
                  absolute left-full ml-2 px-3 py-1.5
                  bg-[#1f1f1f] text-white text-sm rounded
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  whitespace-nowrap border border-gray-700 shadow-xl
                "
              >
                Subscriptions
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav
        className="
          md:hidden fixed bottom-0 inset-x-0 z-50
          bg-[#0f0f0f]/90 backdrop-blur-xl
          border-t border-gray-800
          flex items-center justify-around h-[4.5rem]
        "
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isCenter = item.isCenter;

          if (item.label === "You") {
            return (
              <div key={item.path} className="relative flex-1">
                <button
                  onClick={handleYouClick}
                  className={`
                    flex flex-col items-center justify-center w-full h-full
                    transition-all ${isActive ? "text-white" : "text-gray-400"}
                  `}
                >
                  <Icon size={26} strokeWidth={isActive ? 2.6 : 2} />
                  <span className="text-[10px] mt-1">{item.label}</span>
                  {isActive && (
                    <span className="mt-1 w-6 h-1 bg-white rounded-full" />
                  )}
                </button>

                {/* Mobile dropdown - appears above */}
                {isYouDropdownOpen && (
                  <div
                    className="
                      absolute bottom-full left-0 right-0 mb-2
                      bg-[#1a1a1a] border border-gray-700 rounded-lg
                      shadow-xl overflow-hidden
                    "
                  >
                    <button
                      onClick={() => handleNavClick("/history")}
                      className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 text-sm"
                    >
                      <History size={18} />
                      <span>History</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("/liked-videos")}
                      className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 text-sm"
                    >
                      <Heart size={18} />
                      <span>Liked Videos</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("/watch-later")}
                      className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 text-sm"
                    >
                      <Clock size={18} />
                      <span>Watch Later</span>
                    </button>
                    <button
                      onClick={() => handleNavClick("/your-videos")}
                      className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 text-sm"
                    >
                      <Video size={18} />
                      <span>Your Videos</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          if (isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="
                  relative -top-6 w-16 h-16
                  flex items-center justify-center
                  rounded-full bg-red-600 text-white
                  shadow-lg active:scale-95
                "
              >
                <Icon size={32} />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center flex-1
                transition-all ${isActive ? "text-white" : "text-gray-400"}
              `}
            >
              <Icon size={26} strokeWidth={isActive ? 2.6 : 2} />
              <span className="text-[10px] mt-1">{item.label}</span>
              {isActive && (
                <span className="mt-1 w-6 h-1 bg-white rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}