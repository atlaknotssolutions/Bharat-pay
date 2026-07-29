// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Clock } from "lucide-react";

// // export default function WatchHistoryTab({ openDetail }) {
// //   const navigate = useNavigate();
// //   const [videos, setVideos] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       setVideos([]);
// //       setLoading(false);
// //       return;
// //     }

// //     fetch("http://localhost:8000/api/uservideo/history", {
// //       headers: { Authorization: `Bearer ${token}` },
// //     })
// //       .then((res) => res.json())
// //       .then((data) => setVideos(Array.isArray(data.videos) ? data.videos : []))
// //       .catch(() => setVideos([]))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const handleOpen = (video) => {
// //     if (openDetail) {
// //       openDetail(video);
// //       return;
// //     }

// //     navigate(`/video/${video._id || video.id}`);
// //   };

// //   return (
// //     <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
// //       <h3 className="text-lg md:text-xl font-semibold">Watch History</h3>

// //       {loading ? (
// //         <div className="text-center py-16 md:py-24 text-zinc-500">
// //           Loading...
// //         </div>
// //       ) : videos.length === 0 ? (
// //         <div className="text-center py-16 md:py-24 text-zinc-500">
// //           <p className="text-xl md:text-2xl">No watch history yet</p>
// //           <p className="mt-3 text-sm md:text-base">
// //             Videos you watch will appear here
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
// //           {videos.map((video) => (
// //             <div
// //               key={video._id || video.id}
// //               onClick={() => handleOpen(video)}
// //               className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group"
// //             >
// //               <div className="flex flex-col sm:flex-row">
// //                 <div className="relative aspect-video sm:aspect-[4/3] sm:w-44 md:w-52 flex-shrink-0">
// //                   <img
// //                     src={video.thumbnail}
// //                     alt={video.title}
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </div>
// //                 <div className="p-3.5 md:p-4 flex-1">
// //                   <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2 group-hover:text-red-400">
// //                     {video.title}
// //                   </h4>
// //                   <p className="text-sm text-zinc-400 mb-1">{video.channel}</p>
// //                   <p className="text-xs md:text-sm text-zinc-500">
// //                     Watched {video.watchedDate} • {video.duration}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Clock } from "lucide-react";

// export default function WatchHistoryTab({ openDetail }) {
//   const navigate = useNavigate();
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setVideos([]);
//       setLoading(false);
//       return;
//     }

//     fetch("http://localhost:8000/api/uservideo/history", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setVideos(Array.isArray(data.videos) ? data.videos : []))
//       .catch(() => setVideos([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleOpen = (video) => {
//     if (openDetail) {
//       openDetail(video);
//       return;
//     }

//     navigate(`/video/${video._id || video.id}`);
//   };

//   return (
//     <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
//       <h3 className="text-lg md:text-xl font-semibold">Watch History</h3>

//       {loading ? (
//         <div className="text-center py-16 md:py-24 text-zinc-500">
//           Loading...
//         </div>
//       ) : videos.length === 0 ? (
//         <div className="text-center py-16 md:py-24 text-zinc-500">
//           <p className="text-xl md:text-2xl">No watch history yet</p>
//           <p className="mt-3 text-sm md:text-base">
//             Videos you watch will appear here
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
//           {videos.map((video) => (
//             <div
//               key={video._id || video.id}
//               onClick={() => handleOpen(video)}
//               className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group"
//             >
//               <div className="flex flex-col sm:flex-row">
//                 <div className="relative aspect-video sm:aspect-[4/3] sm:w-44 md:w-52 flex-shrink-0">
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-3.5 md:p-4 flex-1">
//                   <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2 group-hover:text-red-400">
//                     {video.title}
//                   </h4>
//                   <p className="text-sm text-zinc-400 mb-1">
//                     {video.channel?.name || "Unknown channel"}
//                   </p>
//                   <p className="text-xs md:text-sm text-zinc-500">
//                     {video.duration ? `${video.duration}` : ""}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

export default function WatchHistoryTab({ openDetail }) {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVideos([]);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/uservideo/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVideos(Array.isArray(data.videos) ? data.videos : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (video) => {
    if (openDetail) {
      openDetail(video);
      return;
    }
    navigate(`/video/${video._id || video.id}`);
  };

  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <h3 className="text-lg md:text-xl font-semibold">Watch History</h3>

      {loading ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          Loading...
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <p className="text-xl md:text-2xl">No watch history yet</p>
          <p className="mt-3 text-sm md:text-base">
            Videos you watch will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {videos.map((video) => (
            <div
              key={video._id || video.id}
              onClick={() => handleOpen(video)}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-video sm:aspect-[4/3] sm:w-44 md:w-52 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3.5 md:p-4 flex-1">
                  <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2 group-hover:text-red-400">
                    {video.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-1">
                    {video.channel?.name || "Unknown channel"}
                  </p>
                  <p className="text-xs md:text-sm text-zinc-500">
                    {video.duration ? video.duration : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}