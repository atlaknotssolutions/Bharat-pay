// import React from "react";
// import { Heart, X } from "lucide-react";

// // Fake data for liked videos (you can later replace with real data from context/API)
// const likedVideos = [
//   {
//     id: "l1",
//     title: "Best Budget Smartphones 2026 – Under ₹25,000",
//     thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
//     channel: "GadgetMatch India",
//     likes: "12.4K",
//     likedDate: "2026-02-01",
//   },
//   {
//     id: "l2",
//     title: "React 19 New Features – Everything You Need to Know",
//     thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
//     channel: "Code with Harry",
//     likes: "8.7K",
//     likedDate: "2026-01-29",
//   },
//   {
//     id: "l3",
//     title: "Ultimate No-Equipment Home Workout for Beginners",
//     thumbnail: "https://images.unsplash.com/photo-1571019613454-1cf27fe73f6b?w=800",
//     channel: "Fit With Aditya",
//     likes: "19.2K",
//     likedDate: "2026-01-20",
//   },
//   {
//     id: "l4",
//     title: "How I Made ₹1 Lakh+ with Affiliate Marketing in 2025",
//     thumbnail: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
//     channel: "Side Hustle Guru",
//     likes: "15.6K",
//     likedDate: "2026-01-15",
//   },
// ];

// export default function LikedVideosTab({ openDetail }) {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold">Liked Videos</h3>
//         <span className="text-sm text-zinc-500">
//           {likedVideos.length} videos
//         </span>
//       </div>

//       {likedVideos.length === 0 ? (
//         <div className="text-center py-20 text-zinc-500">
//           <Heart size={48} className="mx-auto mb-4 text-zinc-700" />
//           <p className="text-xl font-medium">No liked videos yet</p>
//           <p className="mt-3 text-sm">
//             Tap the heart on any video to save it here
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide pb-4">
//           {likedVideos.map((video) => (
//             <div
//               key={video.id}
//               onClick={() => openDetail(video)}
//               className="
//                 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden
//                 hover:border-zinc-600 transition-all duration-200 cursor-pointer
//                 active:scale-[0.995] group
//               "
//             >
//               <div className="flex flex-col sm:flex-row">
//                 {/* Thumbnail + overlay gradient on hover */}
//                 <div className="relative w-full sm:w-44 h-56 sm:h-28 flex-shrink-0">
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 p-4 flex flex-col">
//                   <h4 className="font-medium text-base line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
//                     {video.title}
//                   </h4>

//                   <p className="text-sm text-zinc-400 mb-1">{video.channel}</p>

//                   <div className="flex items-center gap-4 text-sm text-zinc-500 mt-auto">
//                     <div className="flex items-center gap-1.5 text-red-400">
//                       <Heart size={14} className="fill-red-500" />
//                       <span>{video.likes}</span>
//                     </div>
//                     <span className="text-zinc-600">•</span>
//                     <span>Liked on {video.likedDate}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";
import { Heart } from "lucide-react";

const likedVideos = [
  {
    id: "l1",
    title: "Best Budget Smartphones 2026 – Under ₹25,000",
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    channel: "GadgetMatch India",
    likes: "12.4K",
    likedDate: "2026-02-01",
  },
  {
    id: "l2",
    title: "React 19 New Features – Everything You Need to Know",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    channel: "Code with Harry",
    likes: "8.7K",
    likedDate: "2026-01-29",
  },
  {
    id: "l3",
    title: "Ultimate No-Equipment Home Workout for Beginners",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cf27fe73f6b?w=800",
    channel: "Fit With Aditya",
    likes: "19.2K",
    likedDate: "2026-01-20",
  },
  {
    id: "l4",
    title: "How I Made ₹1 Lakh+ with Affiliate Marketing in 2025",
    thumbnail: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
    channel: "Side Hustle Guru",
    likes: "15.6K",
    likedDate: "2026-01-15",
  },
];
export default function LikedVideosTab({ openDetail }) {
  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold pl-10">Liked Videos</h3>
        <span className="text-sm text-zinc-500">{likedVideos.length} videos</span>
      </div>

      {likedVideos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <Heart size={48} className="mx-auto mb-4 text-zinc-600" />
          <p className="text-xl md:text-2xl font-medium">No liked videos yet</p>
          <p className="mt-3 text-sm md:text-base">Tap the heart to save videos here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {likedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => openDetail(video)}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group"
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
                    <div className="flex items-center gap-1.5 text-red-400">
                      <Heart size={14} className="fill-red-500" />
                      <span>{video.likes}</span>
                    </div>
                    <span>•</span>
                    <span className="text-xs md:text-sm">Liked {video.likedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}