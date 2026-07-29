// // WatchLaterTab.jsx
// import React, { useState } from "react";
// import { Bookmark, Clock, X } from "lucide-react";

// // Fake data (in real app, load from localStorage / context / backend)
// const initialWatchLater = [
//   {
//     id: "wl1",
//     title: "Complete Python Bootcamp 2026 – Zero to Hero",
//     thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
//     channel: "Programming with Mosh",
//     duration: "4h 45m",
//     addedDate: "2026-02-02",
//   },
//   {
//     id: "wl2",
//     title: "Advanced Tailwind CSS – Best Practices & Tricks 2026",
//     thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
//     channel: "Traversy Media",
//     duration: "1h 38m",
//     addedDate: "2026-01-30",
//   },
//   {
//     id: "wl3",
//     title: "Build a Full YouTube Clone with React, Firebase & Tailwind",
//     thumbnail: "https://images.unsplash.com/photo-1611162617210-7a028c9e2da0?w=800",
//     channel: "Web Dev Simplified",
//     duration: "2h 12m",
//     addedDate: "2026-01-25",
//   },
//   {
//     id: "wl4",
//     title: "Next.js 15 + App Router Masterclass – Full Project",
//     thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
//     channel: "Codevolution",
//     duration: "3h 20m",
//     addedDate: "2026-01-18",
//   },
// ];

// export default function WatchLaterTab({ openDetail }) {
//   const [videos, setVideos] = useState(initialWatchLater);

//   const handleRemove = (id) => {
//     setVideos((prev) => prev.filter((v) => v.id !== id));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold">Watch Later</h3>
//         <span className="text-sm text-zinc-500">
//           {videos.length} videos
//         </span>
//       </div>

//       {videos.length === 0 ? (
//         <div className="text-center py-20 text-zinc-500">
//           <Bookmark size={48} className="mx-auto mb-4 text-zinc-700" strokeWidth={1.5} />
//           <p className="text-xl font-medium">Your Watch Later is empty</p>
//           <p className="mt-3 text-sm">
//             Save videos to watch later by clicking the bookmark icon
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide pb-4">
//           {videos.map((video) => (
//             <div
//               key={video.id}
//               onClick={() => openDetail(video)}
//               className="
//                 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden
//                 hover:border-zinc-600 transition-all duration-200 cursor-pointer
//                 active:scale-[0.995] group relative
//               "
//             >
//               <div className="flex flex-col sm:flex-row">
//                 {/* Thumbnail */}
//                 <div className="relative w-full sm:w-44 h-56 sm:h-28 flex-shrink-0">
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1 p-4 flex flex-col">
//                   <h4 className="font-medium text-base line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
//                     {video.title}
//                   </h4>

//                   <p className="text-sm text-zinc-400 mb-1">{video.channel}</p>

//                   <div className="flex items-center gap-4 text-sm text-zinc-500 mt-auto">
//                     <div className="flex items-center gap-1.5">
//                       <Clock size={14} />
//                       <span>{video.duration}</span>
//                     </div>
//                     <span className="text-zinc-600">•</span>
//                     <span>Added {video.addedDate}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Remove button (appears on hover) */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleRemove(video.id);
//                 }}
//                 className="
//                   absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-zinc-400
//                   hover:bg-black/90 hover:text-red-400 transition-colors
//                   opacity-0 group-hover:opacity-100
//                 "
//                 title="Remove from Watch Later"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { Bookmark, Clock, X } from "lucide-react";

const initialWatchLater = [
  {
    id: "wl1",
    title: "Complete Python Bootcamp 2026 – Zero to Hero",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    channel: "Programming with Mosh",
    duration: "4h 45m",
    addedDate: "2026-02-02",
  },
  {
    id: "wl2",
    title: "Advanced Tailwind CSS – Best Practices & Tricks 2026",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    channel: "Traversy Media",
    duration: "1h 38m",
    addedDate: "2026-01-30",
  },
  {
    id: "wl3",
    title: "Build a Full YouTube Clone with React, Firebase & Tailwind",
    thumbnail: "https://images.unsplash.com/photo-1611162617210-7a028c9e2da0?w=800",
    channel: "Web Dev Simplified",
    duration: "2h 12m",
    addedDate: "2026-01-25",
  },
  {
    id: "wl4",
    title: "Next.js 15 + App Router Masterclass – Full Project",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    channel: "Codevolution",
    duration: "3h 20m",
    addedDate: "2026-01-18",
  },
];

export default function WatchLaterTab({ openDetail }) {
  const [videos, setVideos] = useState(initialWatchLater);

  const handleRemove = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold">Watch Later</h3>
        <span className="text-sm text-zinc-500">{videos.length} videos</span>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <Bookmark size={48} className="mx-auto mb-4 text-zinc-600" strokeWidth={1.5} />
          <p className="text-xl md:text-2xl font-medium">Watch Later is empty</p>
          <p className="mt-3 text-sm md:text-base">Save videos for later</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => openDetail(video)}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group relative"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-video sm:aspect-[4/3] sm:w-44 md:w-52 flex-shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-3.5 md:p-4 flex-1 flex flex-col">
                  <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2 group-hover:text-red-400">
                    {video.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">{video.channel}</p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 mt-auto">
                    <Clock size={14} />
                    <span>{video.duration}</span>
                    <span>•</span>
                    <span>Added {video.addedDate}</span>
                  </div>
                </div>
              </div>

              {/* Remove button - visible on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(video.id);
                }}
                className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full bg-black/70 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}