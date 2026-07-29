// import { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   ThumbsUp,
//   MessageSquare,
//   Share2,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   MoreHorizontal,
//   X,
//   Send,
//   ChevronRight,
//   Plus,
// } from "lucide-react";

// /* ───────── VIDEO POOL ───────── */
// const VIDEO_POOL = [
//   {
//     video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     poster:
//       "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
//   },
//   {
//     video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//     poster:
//       "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
//   },
//   {
//     video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     poster:
//       "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
//   },
//   {
//     video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
//     poster:
//       "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
//   },
// ];

// /* ───────── RECOMMENDED VIDEOS ───────── */
// const RECOMMENDED_VIDEOS = [
//   { 
//     id: 2, 
//     title: "Sintel Short Film", 
//     creator: "@studio",
//     description: "A fantasy adventure about a girl who befriends a dragon.",
//     year: "2022",
//     rating: "PG-13",
//     match: "95%",
//     duration: "14 min"
//   },
//   { 
//     id: 3, 
//     title: "Elephants Dream", 
//     creator: "@animation",
//     description: "A story about two characters exploring a surreal world.",
//     year: "2021",
//     rating: "PG",
//     match: "88%",
//     duration: "10 min"
//   },
//   { 
//     id: 4, 
//     title: "Tears of Steel", 
//     creator: "@scifi",
//     description: "Sci-fi short film set in a post-apocalyptic world.",
//     year: "2023",
//     rating: "TV-MA",
//     match: "92%",
//     duration: "12 min"
//   },
//   { 
//     id: 5, 
//     title: "Nature Documentary", 
//     creator: "@nature",
//     description: "Breathtaking views of wildlife in their natural habitat.",
//     year: "2020",
//     rating: "G",
//     match: "96%",
//     duration: "25 min"
//   },
//   { 
//     id: 6, 
//     title: "Amazing Wildlife", 
//     creator: "@wildlife",
//     description: "Discover the most incredible animals on our planet.",
//     year: "2024",
//     rating: "TV-PG",
//     match: "90%",
//     duration: "18 min"
//   },
// ];

// function getVideoEntry(id) {
//   const num =
//     typeof id === "number"
//       ? id
//       : String(id)
//           .split("")
//           .reduce((a, c) => a + c.charCodeAt(0), 0);
//   return VIDEO_POOL[num % VIDEO_POOL.length];
// }

// function ScrollableRow({ items, onItemClick, title }) {
//   const rowRef = useRef(null);

//   const scrollLeft = () => {
//     if (rowRef.current) {
//       rowRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (rowRef.current) {
//       rowRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="relative group mb-8">
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-white text-xl font-semibold flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
//           {title}
//           <ChevronRight size={20} className="text-zinc-400" />
//         </h2>
//       </div>

//       {/* Left scroll button */}
//       <button
//         onClick={scrollLeft}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-[calc(100%-2rem)] bg-linear-to-r from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
//       >
//         <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center ml-1">
//           <ChevronRight size={20} className="text-white rotate-180" />
//         </div>
//       </button>

//       {/* Scrollable row */}
//       <div
//         ref={rowRef}
//         className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show scroll-smooth"
//       >
//         {items.map((item) => {
//           const entry = getVideoEntry(item.id);
//           return (
//             <div
//               key={item.id}
//               onClick={() => onItemClick(item)}
//               className="flex-shrink-0 w-64 md:w-72 cursor-pointer group/card"
//             >
//               <div className="relative rounded-lg overflow-hidden bg-zinc-900">
//                 <img
//                   src={entry.poster}
//                   alt={item.title}
//                   className="w-full h-36 md:h-40 object-cover group-hover/card:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
//                 <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
//                   <Play size={16} fill="white" />
//                 </div>
//                 <div className="p-3">
//                   <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
//                   <p className="text-gray-400 text-xs mt-1">{item.creator}</p>
//                   <div className="flex items-center text-xs text-gray-300 mt-2">
//                     <span className="text-green-500 font-bold mr-2">{item.match}</span>
//                     <span className="mr-2">{item.year}</span>
//                     <span className="border border-gray-500 px-1">{item.rating}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Right scroll button */}
//       <button
//         onClick={scrollRight}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-[calc(100%-2rem)] bg-gradient-to-l from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
//       >
//         <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center ml-3">
//           <ChevronRight size={20} className="text-white" />
//         </div>
//       </button>
//     </div>
//   );
// }

// export default function FullVideo() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const videoData = location.state?.video || { 
//     id: 1, 
//     title: "Big Buck Bunny", 
//     creator: "@animation"
//   };

//   const [playing, setPlaying] = useState(true);
//   const [muted, setMuted] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [showControls, setShowControls] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [showInfo, setShowInfo] = useState(false);

//   const [watchTime, setWatchTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const videoRef = useRef(null);
//   const hideTimer = useRef(null);

//   const entry = getVideoEntry(videoData.id);

//   /* ───────── PLAY / PAUSE ───────── */
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     v.load();
//     playing ? v.play().catch(() => {}) : v.pause();
//   }, [playing, entry.video]);

//   /* ───────── WATCH TRACK ───────── */
//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const onTime = () => setWatchTime(v.currentTime);
//     const onMeta = () => setDuration(v.duration || 0);

//     v.addEventListener("timeupdate", onTime);
//     v.addEventListener("loadedmetadata", onMeta);

//     return () => {
//       v.removeEventListener("timeupdate", onTime);
//       v.removeEventListener("loadedmetadata", onMeta);
//     };
//   }, [entry.video]);

//   const watchedPercent =
//     duration > 0 ? Math.min((watchTime / duration) * 100, 100) : 0;

//   const handleTap = () => {
//     setShowControls(true);
//     clearTimeout(hideTimer.current);
//     hideTimer.current = setTimeout(() => {
//       if (playing) setShowControls(false);
//     }, 2000);
//   };

//   /* ───────── OPEN RECOMMENDED VIDEO ───────── */
//   const openRecommendedVideo = (video) => {
//     navigate(`/video/${video.id}`, { state: { video }, replace: true });
//     setPlaying(true);
//     setWatchTime(0);
//     setShowInfo(false);
//   };

//   // More recommended videos for horizontal scroll
//   const allRecommendedVideos = [
//     ...RECOMMENDED_VIDEOS,
//     { 
//       id: 7, 
//       title: "Space Adventure", 
//       creator: "@scifi",
//       description: "Journey through the cosmos in this epic space adventure.",
//       year: "2023",
//       rating: "TV-14",
//       match: "89%",
//       duration: "22 min"
//     },
//     { 
//       id: 8, 
//       title: "Ocean Wonders", 
//       creator: "@nature",
//       description: "Explore the mysterious depths of the ocean.",
//       year: "2022",
//       rating: "TV-G",
//       match: "94%",
//       duration: "19 min"
//     },
//     { 
//       id: 9, 
//       title: "Urban Stories", 
//       creator: "@drama",
//       description: "Life and drama in the big city.",
//       year: "2024",
//       rating: "TV-MA",
//       match: "87%",
//       duration: "16 min"
//     },
//   ];

//   return (
//     <div className="bg-black text-white min-h-screen pt-3 pr-0 md:pr-0 lg:pr-0 xl:pr-0 2xl:pr-0">
//       <style>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-show:hover::-webkit-scrollbar {
//           display: block;
//           height: 6px;
//         }
//         .scrollbar-show:hover::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 3px;
//         }
//         .scrollbar-show:hover::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.3);
//           border-radius: 3px;
//         }
//         .scrollbar-show:hover::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.5);
//         }
//       `}</style>

//       {/* HEADER */}
//       <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 py-4 bg-gradient-to-b from-black/80 to-transparent">
//         <button onClick={() => navigate(-1)}>
//           {/* <ArrowLeft size={22} /> */}
//         </button>
//         {/* <Grid size={20} /> */}
//       </header>

//       {/* VIDEO */}
//       <section className="relative h-[70vh] md:h-[80vh]" onClick={handleTap}>
//         <video
//           key={videoData.id}
//           ref={videoRef}
//           src={entry.video}
//           poster={entry.poster}
//           muted={muted}
//           loop
//           autoPlay
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//         />

//         {/* Progress Bar */}
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
//           <div 
//             className="h-full bg-red-600" 
//             style={{ width: `${watchedPercent}%` }}
//           />
//         </div>

//         {showControls && (
//           <button
//             onClick={() => setPlaying(!playing)}
//             className="absolute inset-0 flex items-center justify-center z-20"
//           >
//             <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
//               {playing ? <Pause size={30} /> : <Play size={30} />}
//             </div>
//           </button>
//         )}

//         {showControls && (
//           <button
//             onClick={() => setMuted(!muted)}
//             className="absolute top-24 right-6 z-30 bg-black/60 p-2 rounded-full"
//           >
//             {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
//           </button>
//         )}

//         {/* <div className="absolute bottom-28 left-6 z-20 max-w-lg">
//           <h1 className="text-3xl md:text-4xl font-bold mb-2">
//             {videoData.title || "Amazing Video"}
//           </h1>
//           <p className="text-lg text-gray-300 mb-4">
//             {videoData.creator || "@creator"}
//           </p>
//           <div className="flex gap-4">
//             <button className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-white/90 flex items-center gap-2">
//               <Play fill="black" size={18} />
//               Play
//             </button>
//             <button 
//               onClick={() => setShowInfo(true)}
//               className="px-6 py-2 bg-gray-500/70 text-white font-semibold rounded hover:bg-gray-500/50 flex items-center gap-2"
//             >
//               <Info size={18} />
//               More Info
//             </button>
//             <button className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:border-white">
//               <Plus size={20} />
//             </button>
//           </div>
//         </div> */}
//       </section>

//       {/* ACTION BAR */}
//       <section className="bg-[#111] px-6 py-5 flex justify-around border-b border-gray-800">
//         <div className="flex flex-col items-center">
//           <button
//             onClick={() => setLiked(!liked)}
//             className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
//           >
//             <ThumbsUp
//               size={20}
//               color={liked ? "#ff4d4d" : "#ccc"}
//               fill={liked ? "#ff4d4d" : "none"}
//             />
//           </button>
//           <span className="text-sm mt-1">Like</span>
//           <span className="text-xs text-gray-400">
//             {watchedPercent.toFixed(0)}% watched
//           </span>
//         </div>

//         <div
//           className="flex flex-col items-center cursor-pointer"
//           onClick={() => setShowComments(true)}
//         >
//           <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
//             <MessageSquare size={20} />
//           </div>
//           <span className="text-sm mt-1">Comment</span>
//         </div>

//         <div className="flex flex-col items-center cursor-pointer">
//           <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
//             <Share2 size={20} />
//           </div>
//           <span className="text-sm mt-1">Share</span>
//         </div>

//         <div className="flex flex-col items-center">
//           <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
//             <MoreHorizontal size={20} />
//           </div>
//           <span className="text-sm mt-1">More</span>
//         </div>
//       </section>

//       {/* MAIN CONTENT */}
//       <div className="mx-auto max-w-screen-2xl px-4 md:px-12 lg:px-16 py-6">
//         {/* Recommended Videos Horizontal Scroll */}
//         <ScrollableRow 
//           items={allRecommendedVideos}
//           onItemClick={openRecommendedVideo}
//           title="Recommended Videos"
//         />

//         {/* More Like This */}
//         <ScrollableRow 
//           items={[...allRecommendedVideos].reverse()}
//           onItemClick={openRecommendedVideo}
//           title="More Like This"
//         />

//         {/* Trending Now */}
//         <div className="mt-8">
//           <h2 className="text-white text-xl font-semibold mb-4">Trending Now</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {allRecommendedVideos.slice(0, 6).map((item) => {
//               const entry = getVideoEntry(item.id);
//               return (
//                 <div
//                   key={item.id}
//                   onClick={() => openRecommendedVideo(item)}
//                   className="cursor-pointer group/trending"
//                 >
//                   <div className="relative aspect-video rounded-md overflow-hidden mb-2">
//                     <img
//                       src={entry.poster}
//                       alt={item.title}
//                       className="w-full h-full object-cover group-hover/trending:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs">
//                       #{item.id}
//                     </div>
//                   </div>
//                   <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* MORE INFO MODAL */}
//       {showInfo && (
//         <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
//           <div className="bg-[#111] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//             <div className="relative">
//               <img
//                 src={entry.poster}
//                 alt={videoData.title}
//                 className="w-full h-48 object-cover rounded-t-lg"
//               />
//               <button
//                 onClick={() => setShowInfo(false)}
//                 className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
//               >
//                 <X size={20} />
//               </button>
//             </div>
            
//             <div className="p-6">
//               <h2 className="text-2xl font-bold mb-4">{videoData.title}</h2>
              
//               <div className="flex items-center text-gray-300 mb-6">
//                 <span className="text-green-500 font-bold mr-4">95% Match</span>
//                 <span className="mr-4">2023</span>
//                 <span className="mr-4">14 min</span>
//                 <span className="border border-gray-500 px-2">TV-14</span>
//               </div>

//               <p className="text-gray-300 mb-6">
//                 This is a sample video description. The video shows amazing content with 
//                 high-quality production. It's part of our collection of free-to-use 
//                 demonstration videos.
//               </p>

//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <p className="text-gray-400 text-sm">Starring</p>
//                   <p className="text-white">Various Artists</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-400 text-sm">Genre</p>
//                   <p className="text-white">Animation, Demo</p>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <button className="flex-1 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-white/90 flex items-center justify-center gap-2">
//                   <Play fill="black" size={18} />
//                   Play
//                 </button>
//                 <button className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center hover:border-white">
//                   <Plus size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* COMMENTS MODAL */}
//       {showComments && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-end">
//           <div className="bg-[#111] rounded-t-2xl p-4 h-[60%] w-full">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-semibold text-lg">Comments</h3>
//               <button onClick={() => setShowComments(false)}>
//                 <X />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto text-gray-400 text-sm p-2">
//               <div className="text-center py-10 text-gray-500">
//                 No comments yet. Be the first to comment!
//               </div>
//             </div>

//             <div className="flex gap-2 mt-3">
//               <input
//                 placeholder="Add a comment..."
//                 className="flex-1 bg-black/40 rounded-full px-4 py-3 text-sm outline-none"
//               />
//               <button className="p-3 rounded-full bg-blue-500 hover:bg-blue-600">
//                 <Send size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Send,
  ChevronDown,
  Check,
} from "lucide-react";

// Fake data (same as yours + some additions)
const VIDEO_POOL = [
  { video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg" },
  { video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg" },
  { video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg" },
  { video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg" },
];

const UP_NEXT_VIDEOS = [
  { id: 2, title: "Sintel – Short Fantasy Film", channel: "Blender Foundation", views: "4.2M", time: "2 days ago" },
  { id: 3, title: "Elephants Dream – Surreal Animation", channel: "Blender Foundation", views: "1.8M", time: "1 week ago" },
  { id: 4, title: "Tears of Steel – Post-Apocalyptic CGI", channel: "Blender Foundation", views: "3.1M", time: "5 days ago" },
  { id: 5, title: "Big Buck Bunny – Funny Animation", channel: "Blender Foundation", views: "12M", time: "3 years ago" },
  { id: 6, title: "Cosmos – A Spacetime Odyssey (clip)", channel: "National Geographic", views: "8.7M", time: "1 month ago" },
];

function getVideoEntry(id) {
  const idx = (typeof id === "number" ? id : parseInt(id) || 1) % VIDEO_POOL.length;
  return VIDEO_POOL[idx];
}

export default function YouTubeLikeVideoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoData = location.state?.video || { id: 1, title: "Big Buck Bunny", channel: "Blender Foundation" };

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(null); // null = neutral, true = like, false = dislike
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const videoRef = useRef(null);
  const controlsTimer = useRef(null);

  const entry = getVideoEntry(videoData.id);

  // Format time MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.load();
    if (playing) v.play().catch(() => {});
    else v.pause();

    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [playing, entry.video]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    setShowControls(true);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    if (val === 0) setMuted(true);
    else setMuted(false);
  };

  const openVideo = (vid) => {
    navigate(`/video/${vid.id}`, { state: { video: vid }, replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">
      <style jsx global>{`
        .seek-bar:hover .seek-progress { background: #f00 !important; }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>

      {/* Video + Metadata + Comments + Sidebar */}
      <div className="max-w-[1750px] mx-auto px-4 pt-4 flex flex-col lg:flex-row gap-6">
        {/* Left – Video + Description + Comments */}
        <div className="flex-1 max-w-[1280px]">
          {/* Video Player */}
          <div
            className="relative bg-black rounded-xl overflow-hidden aspect-video group"
            onMouseMove={handleMouseMove}
            onClick={handlePlayPause}
          >
            <video
              ref={videoRef}
              src={entry.video}
              poster={entry.poster}
              muted={muted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Controls overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${
                showControls || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top – Title & Close */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <h1 className="text-xl md:text-2xl font-bold line-clamp-2 max-w-[70%] drop-shadow-lg">
                  {videoData.title}
                </h1>
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/80"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Center – Big Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  {playing ? <Pause size={36} /> : <Play size={36} fill="white" />}
                </div>
              </button>

              {/* Bottom controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                {/* Progress bar */}
                <div
                  className="h-1.5 bg-white/30 rounded-full cursor-pointer seek-bar group/seek"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-red-600 rounded-full relative seek-progress"
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                  >
                    <div className="absolute -top-2 -right-1.5 w-4 h-4 bg-red-600 rounded-full scale-0 group-hover/seek:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Time + Volume + Actions */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setMuted(!muted)}>
                        {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 accent-red-600 volume-slider"
                      />
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <ThumbsUp size={20} />
                    <ThumbsDown size={20} />
                    <Share2 size={20} />
                    <MoreHorizontal size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info Card */}
          <div className="mt-4 bg-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                  alt="Channel"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold">{videoData.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                  <span>{Math.floor(Math.random() * 900 + 100)}K views</span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Blender Foundation</span>
                    <div className="bg-gray-600 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={12} /> Verified
                    </div>
                  </div>
                  <span className="text-gray-400">• 1.24M subscribers</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setLiked(liked === true ? null : true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      liked === true ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <ThumbsUp size={18} fill={liked === true ? "white" : "none"} />
                    <span>Like</span>
                  </button>

                  <button
                    onClick={() => setLiked(liked === false ? null : false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      liked === false ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <ThumbsDown size={18} fill={liked === false ? "white" : "none"} />
                  </button>

                  <button className="flex-1 md:flex-none bg-white text-black font-medium px-6 py-2 rounded-full hover:bg-gray-200 flex items-center justify-center gap-2">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 text-gray-300 text-sm leading-relaxed">
              <p>
                Big Buck Bunny (code-named Project Peach) is a 2008 short computer-animated
                comedy film by the Blender Institute...
              </p>
              <button className="text-blue-400 hover:underline mt-2">Show more</button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 bg-[#1a1a1a] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Comments • {Math.floor(Math.random() * 8000 + 500)}
            </h3>

            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <input
                  placeholder="Add a comment..."
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button className="px-4 py-1.5 text-sm hover:bg-white/10 rounded">Cancel</button>
                  <button className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <Send size={16} /> Comment
                  </button>
                </div>
              </div>
            </div>

            <div className="text-gray-500 text-center py-8">
              No comments yet • Be the first to share what you think!
            </div>
          </div>
        </div>

        {/* Right Sidebar – Up Next */}
        <div className="w-full lg:w-96 xl:w-[402px] flex-shrink-0">
          <h2 className="text-lg font-semibold mb-3 px-1">Up next</h2>

          <div className="space-y-3">
            {UP_NEXT_VIDEOS.map((vid) => {
              const e = getVideoEntry(vid.id);
              return (
                <div
                  key={vid.id}
                  onClick={() => openVideo(vid)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="relative w-40 md:w-44 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={e.poster}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1.5 py-0.5 rounded">
                      14:23
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-white/90">
                      {vid.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{vid.channel}</p>
                    <p className="text-xs text-gray-400">
                      {vid.views} views • {vid.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}