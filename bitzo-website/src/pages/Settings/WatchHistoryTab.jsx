import React from "react";
import { Clock } from "lucide-react";

const watchHistoryVideos = [
  {
    id: "h1",
    title: "Top 10 Gadgets Under ₹2000 in 2026",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    watchedDate: "2026-02-01",
    duration: "14:32",
    channel: "TechBit",
  },

    {
    id: "h2",
    title: "Top 20 Gadgets Under ₹2000 in 2026",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    watchedDate: "2026-02-01",
    duration: "14:32",
    channel: "TechBit",
  },
  // ... other items
];

export default function WatchHistoryTab({ openDetail }) {
  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <h3 className="text-lg md:text-xl font-semibold">Watch History</h3>

      {watchHistoryVideos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <p className="text-xl md:text-2xl">No watch history yet</p>
          <p className="mt-3 text-sm md:text-base">
            Videos you watch will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {watchHistoryVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => openDetail(video)}
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
                  <p className="text-sm text-zinc-400 mb-1">{video.channel}</p>
                  <p className="text-xs md:text-sm text-zinc-500">
                    Watched {video.watchedDate} • {video.duration}
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
