// // import { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import {
// //   Bell,
// //   Check,
// //   Search,
// //   MoreVertical,
// //   Play,
// //   Link as LinkIcon,
// // } from "lucide-react";

// // const BACKEND_URL = "http://localhost:8000";
// // const API_BASE = `${BACKEND_URL}/api`;

// // export default function SubscribedChannels() {
// //   const { channelId } = useParams();
// //   const navigate = useNavigate();

// //   const [channel, setChannel] = useState(null);
// //   const [videos, setVideos] = useState([]);
// //   const [isSubscribed, setIsSubscribed] = useState(false);
// //   const [subscribersCount, setSubscribersCount] = useState(0);
// //   const [subscribeLoading, setSubscribeLoading] = useState(false);
// //   const [activeTab, setActiveTab] = useState("Home");
// //   const [loading, setLoading] = useState(true);

// //   const tabs = ["Home", "Videos", "Shorts", "Live", "Podcasts", "Playlists", "Posts"];

// //   useEffect(() => {
// //    const fetchChannel = async () => {
// //   if (!channelId) {
// //     console.log("channelId is missing!", channelId);
// //     return;
// //   }
// //   try {
// //     setLoading(true);
// //     const token = localStorage.getItem("token");
// //     console.log("Fetching:", `${API_BASE}/channel/${channelId}`);
// //     console.log("Token:", token);

// //     const res = await fetch(`${API_BASE}/channel/${channelId}`, {
// //       headers: token ? { Authorization: `Bearer ${token}` } : {},
// //     });

// //     console.log("Status:", res.status);
// //     const data = await res.json();
// //     console.log("API Response:", data);   // ← yeh sabse important

// //     if (data.success && data.channel) {
// //       setChannel(data.channel);
// //       setSubscribersCount(data.channel.subscribersCount || 0);
// //       setIsSubscribed(Boolean(data.channel.isSubscribed));
// //       setVideos(data.videos || []);
// //     } else {
// //       console.warn("Unexpected response structure:", data);
// //     }
// //   } catch (err) {
// //     console.error("Fetch error:", err);
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //     fetchChannel();
// //   }, [channelId]);

// //   const handleSubscribe = async () => {
// //     if (!channelId) return;
// //     setSubscribeLoading(true);
// //     const token = localStorage.getItem("token");

// //     try {
// //       const res = await fetch(`${API_BASE}/uservideo/subscribe/${channelId}`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //         },
// //       });
// //       const data = await res.json();
// //       if (data.success) {
// //         setIsSubscribed(data.subscribed);
// //         if (typeof data.subscribersCount === "number") {
// //           setSubscribersCount(data.subscribersCount);
// //         }
// //       }
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setSubscribeLoading(false);
// //     }
// //   };

// //   const formatCount = (num) => {
// //     if (!num) return "0";
// //     if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
// //     if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
// //     if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
// //     return num.toString();
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-white flex items-center justify-center">
// //         <p className="text-gray-500">Loading...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white text-[#0f0f0f]">
// //       {/* ========== CHANNEL HEADER ========== */}
// //       <div className="max-w-[1280px] mx-auto px-6 pt-6">
// //         <div className="flex gap-6 items-start">
// //           {/* Logo */}
// //           <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
// //             <img
// //               src={
// //                 channel?.channelImage
// //                   ? `${BACKEND_URL}/${channel.channelImage}`
// //                   : "https://via.placeholder.com/150"
// //               }
// //               alt={channel?.name}
// //               className="w-full h-full object-cover"
// //             />
// //           </div>

// //           {/* Info */}
// //           <div className="flex-1 pt-1">
// //             {/* Name + Verified */}
// //             <div className="flex items-center gap-2">
// //               <h1 className="text-[28px] font-bold leading-tight">
// //                 {channel?.name || "Channel Name"}
// //               </h1>
// //               <svg
// //                 className="w-5 h-5 text-[#606060]"
// //                 viewBox="0 0 24 24"
// //                 fill="currentColor"
// //               >
// //                 <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
// //               </svg>
// //             </div>

// //             {/* Handle + Subs + Videos */}
// //             <div className="flex items-center gap-1.5 mt-1 text-[14px] text-[#606060]">
// //               <span>@{channel?.handle || "channel"}</span>
// //               <span>•</span>
// //               <span>{formatCount(subscribersCount)} subscribers</span>
// //               <span>•</span>
// //               <span>{formatCount(channel?.videoCount || videos.length)} videos</span>
// //             </div>

// //             {/* Description */}
// //             <p className="mt-2 text-[14px] text-[#0f0f0f] max-w-[600px] leading-snug">
// //               {channel?.description ||
// //                 `"Music can change the world". T-Series is India's largest Music Label & Movie Studio, belie`}
// //               <button className="text-[#065fd4] font-medium ml-1 hover:underline">
// //                 ...more
// //               </button>
// //             </p>

// //             {/* Links */}
// //             <div className="mt-1.5 flex items-center gap-1 text-[14px]">
// //               <LinkIcon size={16} className="text-[#065fd4]" />
// //               <span className="text-[#065fd4] font-medium cursor-pointer hover:underline">
// //                 YouTube
// //               </span>
// //               <span className="text-[#606060]">and 3 more links</span>
// //             </div>

// //             {/* Subscribe Button */}
// //             <div className="mt-4">
// //               <button
// //                 onClick={handleSubscribe}
// //                 disabled={subscribeLoading}
// //                 className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-[14px] font-medium transition ${
// //                   isSubscribed
// //                     ? "bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]"
// //                     : "bg-[#0f0f0f] hover:bg-[#272727] text-white"
// //                 } ${subscribeLoading ? "opacity-70" : ""}`}
// //               >
// //                 {isSubscribed ? (
// //                   <>
// //                     <Bell size={18} />
// //                     <span>Subscribed</span>
// //                     <svg
// //                       className="w-4 h-4"
// //                       fill="currentColor"
// //                       viewBox="0 0 24 24"
// //                     >
// //                       <path d="M7 10l5 5 5-5H7z" />
// //                     </svg>
// //                   </>
// //                 ) : (
// //                   "Subscribe"
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ========== TABS ========== */}
// //       <div className="border-b border-[#e5e5e5] mt-5 sticky top-0 bg-white z-20">
// //         <div className="max-w-[1280px] mx-auto px-6">
// //           <div className="flex items-center">
// //             <div className="flex overflow-x-auto scrollbar-hide">
// //               {tabs.map((tab) => (
// //                 <button
// //                   key={tab}
// //                   onClick={() => setActiveTab(tab)}
// //                   className={`relative px-4 py-3 text-[14px] font-medium whitespace-nowrap ${
// //                     activeTab === tab
// //                       ? "text-[#0f0f0f]"
// //                       : "text-[#606060] hover:text-[#0f0f0f]"
// //                   }`}
// //                 >
// //                   {tab}
// //                   {activeTab === tab && (
// //                     <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0f0f0f] rounded-t-full" />
// //                   )}
// //                 </button>
// //               ))}
// //             </div>
// //             <button className="ml-auto p-2 text-[#606060] hover:bg-gray-100 rounded-full">
// //               <Search size={20} />
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ========== VIDEOS LIST ========== */}
// //       <div className="max-w-[1280px] mx-auto px-6 py-6">
// //         <div className="space-y-4">
// //           {videos.map((video) => (
// //             <div
// //               key={video._id}
// //               onClick={() => navigate(`/video/${video._id}`)}
// //               className="flex gap-4 cursor-pointer group"
// //             >
// //               {/* Thumbnail */}
// //               <div className="relative w-[246px] h-[138px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
// //                 <img
// //                   src={
// //                     video.thumbnail
// //                       ? `${BACKEND_URL}/${video.thumbnail}`
// //                       : "https://via.placeholder.com/246x138"
// //                   }
// //                   alt={video.title}
// //                   className="w-full h-full object-cover"
// //                 />
// //                 <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] font-medium px-1 rounded">
// //                   {video.duration || "4:10"}
// //                 </div>
// //               </div>

// //               {/* Details */}
// //               <div className="flex-1 min-w-0 pt-1">
// //                 <h3 className="text-[16px] font-medium leading-snug line-clamp-2">
// //                   {video.title}
// //                 </h3>

// //                 <div className="flex items-center gap-1 mt-1.5 text-[13px] text-[#606060]">
// //                   <span className="font-medium text-[#0f0f0f]">
// //                     {channel?.name}
// //                   </span>
// //                   <svg className="w-3.5 h-3.5 text-[#606060]" viewBox="0 0 24 24" fill="currentColor">
// //                     <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
// //                   </svg>
// //                   <span>•</span>
// //                   <span>{formatCount(video.views)} views</span>
// //                   <span>•</span>
// //                   <span>
// //                     {video.createdAt
// //                       ? new Date(video.createdAt).toLocaleDateString()
// //                       : "8 hours ago"}
// //                   </span>
// //                 </div>

// //                 <p className="mt-1.5 text-[13px] text-[#606060] line-clamp-2 max-w-[600px]">
// //                   {video.description ||
// //                     "The Ramayana Trailer. This is where the EPIC BEGINS. 🔥"}
// //                 </p>
// //               </div>

// //               {/* 3 dots */}
// //               <button
// //                 onClick={(e) => e.stopPropagation()}
// //                 className="self-start p-1.5 text-[#606060] opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full"
// //               >
// //                 <MoreVertical size={20} />
// //               </button>
// //             </div>
// //           ))}
// //         </div>

// //         {/* ========== PLAYLIST SECTION ========== */}
// //         {videos.length > 0 && (
// //           <div className="mt-10 pt-6 border-t border-[#e5e5e5]">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-[16px] font-medium">
// //                 {channel?.name} - Hindi Playlist
// //               </h2>
// //               <button className="flex items-center gap-1.5 text-[14px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-100">
// //                 <Play size={16} fill="currentColor" />
// //                 Play all
// //               </button>
// //             </div>

// //             {/* Horizontal playlist cards can go here */}
// //             <div className="flex gap-3 overflow-x-auto pb-2">
// //               {videos.slice(0, 4).map((video) => (
// //                 <div
// //                   key={video._id + "-pl"}
// //                   className="w-[210px] flex-shrink-0 cursor-pointer"
// //                   onClick={() => navigate(`/video/${video._id}`)}
// //                 >
// //                   <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-200">
// //                     <img
// //                       src={
// //                         video.thumbnail
// //                           ? `${BACKEND_URL}/${video.thumbnail}`
// //                           : "https://via.placeholder.com/210x118"
// //                       }
// //                       alt={video.title}
// //                       className="w-full h-full object-cover"
// //                     />
// //                     <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] px-1 rounded">
// //                       {video.duration || "4:10"}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Bell,
//   Search,
//   MoreVertical,
//   Play,
//   Link as LinkIcon,
// } from "lucide-react";

// const BACKEND_URL = "http://localhost:8000";
// const API_BASE = `${BACKEND_URL}/api/uservideo`;

// export default function SubscribedChannels() {
//   const { id } = useParams(); // route: subscribechannel/:id
//   const navigate = useNavigate();

//   const [channel, setChannel] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [subscribersCount, setSubscribersCount] = useState(0);
//   const [subscribeLoading, setSubscribeLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("Home");
//   const [loading, setLoading] = useState(true);

//   const tabs = [
//     "Home",
//     "Videos",
//     "Shorts",
//     "Live",
//     "Podcasts",
//     "Playlists",
//     "Posts",
//   ];

//   useEffect(() => {
//     const fetchChannel = async () => {
//       if (!id) {
//         console.log("id is missing!", id);
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         console.log("Fetching:", `${API_BASE}/channel/${id}`);

//         const res = await fetch(`${API_BASE}/channel/${id}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         console.log("Status:", res.status);
//         const data = await res.json();
//         console.log("API Response:", data);

//         if (data.success && data.channel) {
//           setChannel(data.channel);
//           setSubscribersCount(data.channel.subscribersCount || 0);
//           setIsSubscribed(Boolean(data.channel.isSubscribed));
//           setVideos(data.videos || []);
//         } else {
//           console.warn("Unexpected response structure:", data);
//           setChannel(null);
//           setVideos([]);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setChannel(null);
//         setVideos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChannel();
//   }, [id]);

//   const handleSubscribe = async () => {
//     if (!id) return;
//     setSubscribeLoading(true);
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`${API_BASE}/uservideo/subscribe/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         },
//       });
//       const data = await res.json();
//       if (data.success) {
//         setIsSubscribed(data.subscribed);
//         if (typeof data.subscribersCount === "number") {
//           setSubscribersCount(data.subscribersCount);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSubscribeLoading(false);
//     }
//   };

//   const formatCount = (num) => {
//     if (!num) return "0";
//     if (num >= 1_000_000_000)
//       return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
//     if (num >= 1_000_000)
//       return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
//     if (num >= 1_000)
//       return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
//     return num.toString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white text-[#0f0f0f]">
//       {/* ========== CHANNEL HEADER ========== */}
//       <div className="max-w-[1280px] mx-auto px-6 pt-6">
//         <div className="flex gap-6 items-start">
//           {/* Logo */}
//           <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
//             <img
//               src={
//                 channel?.channelImage
//                   ? channel.channelImage.startsWith("http")
//                     ? channel.channelImage
//                     : `${BACKEND_URL}/${channel.channelImage}`
//                   : "https://via.placeholder.com/150"
//               }
//               alt={channel?.name}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Info */}
//           <div className="flex-1 pt-1">
//             <div className="flex items-center gap-2">
//               <h1 className="text-[28px] font-bold leading-tight">
//                 {channel?.name || "Channel Name"}
//               </h1>
//               <svg
//                 className="w-5 h-5 text-[#606060]"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
//               </svg>
//             </div>

//             <div className="flex items-center gap-1.5 mt-1 text-[14px] text-[#606060]">
//               <span>@{channel?.handle || "channel"}</span>
//               <span>•</span>
//               <span>{formatCount(subscribersCount)} subscribers</span>
//               <span>•</span>
//               <span>
//                 {formatCount(channel?.videoCount || videos.length)} videos
//               </span>
//             </div>

//             <p className="mt-2 text-[14px] text-[#0f0f0f] max-w-[600px] leading-snug">
//               {channel?.description ||
//                 `"Music can change the world". T-Series is India's largest Music Label & Movie Studio, belie`}
//               <button className="text-[#065fd4] font-medium ml-1 hover:underline">
//                 ...more
//               </button>
//             </p>

//             <div className="mt-1.5 flex items-center gap-1 text-[14px]">
//               <LinkIcon size={16} className="text-[#065fd4]" />
//               <span className="text-[#065fd4] font-medium cursor-pointer hover:underline">
//                 YouTube
//               </span>
//               <span className="text-[#606060]">and 3 more links</span>
//             </div>

//             <div className="mt-4">
//               <button
//                 onClick={handleSubscribe}
//                 disabled={subscribeLoading}
//                 className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-[14px] font-medium transition ${
//                   isSubscribed
//                     ? "bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]"
//                     : "bg-[#0f0f0f] hover:bg-[#272727] text-white"
//                 } ${subscribeLoading ? "opacity-70" : ""}`}
//               >
//                 {isSubscribed ? (
//                   <>
//                     <Bell size={18} />
//                     <span>Subscribed</span>
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M7 10l5 5 5-5H7z" />
//                     </svg>
//                   </>
//                 ) : (
//                   "Subscribe"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========== TABS ========== */}
//       <div className="border-b border-[#e5e5e5] mt-5 sticky top-0 bg-white z-20">
//         <div className="max-w-[1280px] mx-auto px-6">
//           <div className="flex items-center">
//             <div className="flex overflow-x-auto scrollbar-hide">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`relative px-4 py-3 text-[14px] font-medium whitespace-nowrap ${
//                     activeTab === tab
//                       ? "text-[#0f0f0f]"
//                       : "text-[#606060] hover:text-[#0f0f0f]"
//                   }`}
//                 >
//                   {tab}
//                   {activeTab === tab && (
//                     <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0f0f0f] rounded-t-full" />
//                   )}
//                 </button>
//               ))}
//             </div>
//             <button className="ml-auto p-2 text-[#606060] hover:bg-gray-100 rounded-full">
//               <Search size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ========== VIDEOS LIST ========== */}
//       <div className="max-w-[1280px] mx-auto px-6 py-6">
//         <div className="space-y-4">
//           {videos.length === 0 ? (
//             <p className="text-gray-500 text-center py-10">
//               No videos found for this channel.
//             </p>
//           ) : (
//             videos.map((video) => (
//               <div
//                 key={video._id}
//                 onClick={() => navigate(`/video/${video._id}`)}
//                 className="flex gap-4 cursor-pointer group"
//               >
//                 <div className="relative w-[246px] h-[138px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
//                   <img
//                     src={
//                       video.thumbnail
//                         ? video.thumbnail.startsWith("http")
//                           ? video.thumbnail
//                           : `${BACKEND_URL}/${video.thumbnail}`
//                         : "https://via.placeholder.com/246x138"
//                     }
//                     alt={video.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] font-medium px-1 rounded">
//                     {video.duration || "4:10"}
//                   </div>
//                 </div>

//                 <div className="flex-1 min-w-0 pt-1">
//                   <h3 className="text-[16px] font-medium leading-snug line-clamp-2">
//                     {video.title}
//                   </h3>

//                   <div className="flex items-center gap-1 mt-1.5 text-[13px] text-[#606060]">
//                     <span className="font-medium text-[#0f0f0f]">
//                       {channel?.name}
//                     </span>
//                     <svg
//                       className="w-3.5 h-3.5 text-[#606060]"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
//                     </svg>
//                     <span>•</span>
//                     <span>{formatCount(video.views)} views</span>
//                     <span>•</span>
//                     <span>
//                       {video.createdAt
//                         ? new Date(video.createdAt).toLocaleDateString()
//                         : "8 hours ago"}
//                     </span>
//                   </div>

//                   <p className="mt-1.5 text-[13px] text-[#606060] line-clamp-2 max-w-[600px]">
//                     {video.description ||
//                       "The Ramayana Trailer. This is where the EPIC BEGINS. 🔥"}
//                   </p>
//                 </div>

//                 <button
//                   onClick={(e) => e.stopPropagation()}
//                   className="self-start p-1.5 text-[#606060] opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full"
//                 >
//                   <MoreVertical size={20} />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* ========== PLAYLIST SECTION ========== */}
//         {videos.length > 0 && (
//           <div className="mt-10 pt-6 border-t border-[#e5e5e5]">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-[16px] font-medium">
//                 {channel?.name} - Hindi Playlist
//               </h2>
//               <button className="flex items-center gap-1.5 text-[14px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-100">
//                 <Play size={16} fill="currentColor" />
//                 Play all
//               </button>
//             </div>

//             <div className="flex gap-3 overflow-x-auto pb-2">
//               {videos.slice(0, 4).map((video) => (
//                 <div
//                   key={video._id + "-pl"}
//                   className="w-[210px] flex-shrink-0 cursor-pointer"
//                   onClick={() => navigate(`/video/${video._id}`)}
//                 >
//                   <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-200">
//                     <img
//                       src={
//                         video.thumbnail
//                           ? video.thumbnail.startsWith("http")
//                             ? video.thumbnail
//                             : `${BACKEND_URL}/${video.thumbnail}`
//                           : "https://via.placeholder.com/210x118"
//                       }
//                       alt={video.title}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] px-1 rounded">
//                       {video.duration || "4:10"}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  MoreVertical,
  Play,
  Link as LinkIcon,
} from "lucide-react";

const BACKEND_URL = "http://localhost:8000";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

export default function SubscribedChannels() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Home",
    "Videos",
    "Shorts",
    "Live",
    "Podcasts",
    "Playlists",
    "Posts",
  ];

  useEffect(() => {
    const fetchChannel = async () => {
      if (!id) {
        console.log("id is missing!", id);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Fetching:", `${API_BASE}/channel/${id}`);

        const res = await fetch(`${API_BASE}/channel/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("Status:", res.status);
        const data = await res.json();
        console.log("API Response:", data);

        if (data.success && data.channel) {
          setChannel(data.channel);
          setSubscribersCount(data.channel.subscribersCount || 0);
          setIsSubscribed(Boolean(data.channel.isSubscribed));
          setVideos(data.videos || []);
        } else {
          console.warn("Unexpected response structure:", data);
          setChannel(null);
          setVideos([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setChannel(null);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  const handleSubscribe = async () => {
    if (!id) return;
    setSubscribeLoading(true);
    const token = localStorage.getItem("token");

    try {
      // ✅ Fixed URL (no double uservideo)
      const res = await fetch(`${API_BASE}/subscribe/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(data.subscribed);
        if (typeof data.subscribersCount === "number") {
          setSubscribersCount(data.subscribersCount);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const formatCount = (num) => {
    if (!num) return "0";
    if (num >= 1_000_000_000)
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000)
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0f0f0f]">
      {/* ========== CHANNEL HEADER ========== */}
      <div className="max-w-[1280px] mx-auto px-6 pt-6">
        <div className="flex gap-6 items-start">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            <img
              src={
                channel?.channelImage
                  ? channel.channelImage.startsWith("http")
                    ? channel.channelImage
                    : `${BACKEND_URL}/${channel.channelImage}`
                  : "https://via.placeholder.com/150"
              }
              alt={channel?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[28px] font-bold leading-tight">
                {channel?.name || "Channel Name"}
              </h1>
              <svg
                className="w-5 h-5 text-[#606060]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-[14px] text-[#606060]">
              <span>@{channel?.handle || "channel"}</span>
              <span>•</span>
              <span>{formatCount(subscribersCount)} subscribers</span>
              <span>•</span>
              <span>
                {formatCount(channel?.videoCount || videos.length)} videos
              </span>
            </div>

            <p className="mt-2 text-[14px] text-[#0f0f0f] max-w-[600px] leading-snug">
              {channel?.description ||
                channel?.channeldescription ||
                "No description available"}
              <button className="text-[#065fd4] font-medium ml-1 hover:underline">
                ...more
              </button>
            </p>

            <div className="mt-1.5 flex items-center gap-1 text-[14px]">
              <LinkIcon size={16} className="text-[#065fd4]" />
              <span className="text-[#065fd4] font-medium cursor-pointer hover:underline">
                YouTube
              </span>
              <span className="text-[#606060]">and 3 more links</span>
            </div>

            <div className="mt-4">
              <button
                onClick={handleSubscribe}
                disabled={subscribeLoading}
                className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-[14px] font-medium transition ${
                  isSubscribed
                    ? "bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#0f0f0f]"
                    : "bg-[#0f0f0f] hover:bg-[#272727] text-white"
                } ${subscribeLoading ? "opacity-70" : ""}`}
              >
                {isSubscribed ? (
                  <>
                    <Bell size={18} />
                    <span>Subscribed</span>
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== TABS ========== */}
      <div className="border-b border-[#e5e5e5] mt-5 sticky top-0 bg-white z-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-3 text-[14px] font-medium whitespace-nowrap ${
                    activeTab === tab
                      ? "text-[#0f0f0f]"
                      : "text-[#606060] hover:text-[#0f0f0f]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0f0f0f] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
            <button className="ml-auto p-2 text-[#606060] hover:bg-gray-100 rounded-full">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ========== VIDEOS LIST ========== */}
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <div className="space-y-4">
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No videos found for this channel.
            </p>
          ) : (
            videos.map((video) => (
              <div
                key={video._id}
                onClick={() => navigate(`/video/${video._id}`)}
                className="flex gap-4 cursor-pointer group"
              >
                <div className="relative w-[246px] h-[138px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                  <img
                    src={
                      video.thumbnail
                        ? video.thumbnail.startsWith("http")
                          ? video.thumbnail
                          : `${BACKEND_URL}/${video.thumbnail}`
                        : "https://via.placeholder.com/246x138"
                    }
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] font-medium px-1 rounded">
                    {video.duration || "4:10"}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-[16px] font-medium leading-snug line-clamp-2">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-1.5 text-[13px] text-[#606060]">
                    <span className="font-medium text-[#0f0f0f]">
                      {channel?.name}
                    </span>
                    <span>•</span>
                    <span>{formatCount(video.views)} views</span>
                    <span>•</span>
                    <span>
                      {video.createdAt
                        ? new Date(video.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[13px] text-[#606060] line-clamp-2 max-w-[600px]">
                    {video.description || ""}
                  </p>
                </div>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="self-start p-1.5 text-[#606060] opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {videos.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#e5e5e5]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-medium">
                {channel?.name} - Playlist
              </h2>
              <button className="flex items-center gap-1.5 text-[14px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-100">
                <Play size={16} fill="currentColor" />
                Play all
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {videos.slice(0, 4).map((video) => (
                <div
                  key={video._id + "-pl"}
                  className="w-[210px] flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/video/${video._id}`)}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-200">
                    <img
                      src={
                        video.thumbnail
                          ? video.thumbnail.startsWith("http")
                            ? video.thumbnail
                            : `${BACKEND_URL}/${video.thumbnail}`
                          : "https://via.placeholder.com/210x118"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[12px] px-1 rounded">
                      {video.duration || "4:10"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}