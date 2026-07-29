

import React from "react";
import { Eye, Clock, IndianRupee, ArrowUpDown } from "lucide-react";

const myVideos = [
  {
    id: "v1",
    title: "After 100th Attempt – Cute Cats Funny Moments",
    thumbnail: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
    views: 12496,
    avgWatchPercent: 68,
    earnings: 42.5,
    totalWatchTime: "18h 45m",
    status: "Public",
    uploadDate: "2025-12-15",
  },
  {
    id: "v2",
    title: "How I Made ₹50K in One Month – Side Hustle Tips",
    thumbnail: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800",
    views: 45800,
    avgWatchPercent: 42,
    earnings: 185.2,
    totalWatchTime: "3d 12h",
    status: "Limited",
    uploadDate: "2025-11-28",
  },
  {
    id: "v3",
    title: "Quick 5-Minute Breakfast Ideas for Busy People",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    views: 9200,
    avgWatchPercent: 55,
    earnings: 18.9,
    totalWatchTime: "6h 20m",
    status: "Public",
    uploadDate: "2026-01-10",
  },
  {
    id: "v4",
    title: "Best Places to Visit in Bhopal 2026 | Budget Travel Guide",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    views: 28500,
    avgWatchPercent: 61,
    earnings: 92.8,
    totalWatchTime: "2d 8h",
    status: "Public",
    uploadDate: "2026-01-05",
  },
];

export default function YourVideosTab({ openDetail, sortBy, onSortChange }) {
  const sortedVideos = [...myVideos].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.uploadDate) - new Date(a.uploadDate);
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "earnings") return b.earnings - a.earnings;
    return 0;
  });

  const getStatusBadge = (status) => {
    const isPublic = status?.toLowerCase() === "public";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isPublic
            ? "bg-green-900/40 text-green-400 border border-green-800/50"
            : "bg-amber-900/40 text-amber-400 border border-amber-800/50"
        }`}
      >
        {isPublic ? "Public" : "Limited"}
      </span>
    );
  };

  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      {/* Header with sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg md:text-xl font-semibold">Your Videos</h3>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <ArrowUpDown size={16} className="text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-red-600 appearance-none"
          >
            <option value="latest">Latest</option>
            <option value="views">Most Viewed</option>
            <option value="earnings">Most Earnings</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      {sortedVideos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <p className="text-xl md:text-2xl font-medium">No videos uploaded yet</p>
          <p className="mt-3 text-sm md:text-base">Upload your first video to get started</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {sortedVideos.map((video) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-3.5 md:p-4 flex-1 flex flex-col">
                  <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2.5 group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h4>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm text-zinc-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Eye size={14} />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{video.avgWatchPercent}% avg</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <IndianRupee size={14} />
                      <span>₹{video.earnings.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto">
                    {getStatusBadge(video.status)}
                    <span>Uploaded {video.uploadDate}</span>
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