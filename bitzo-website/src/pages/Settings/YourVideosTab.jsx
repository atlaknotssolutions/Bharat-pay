import React, { useEffect, useState } from "react";
import { Eye, Clock, Heart, ArrowUpDown } from "lucide-react";
import { formatTime } from "../../components/player/utils";

const BACKEND_URL = "https://bharat-pay.onrender.com";

const toMediaUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value.replace(/\\/g, "/");

  const normalized = value.replace(/\\/g, "/");
  if (normalized.startsWith("/uploads/")) return `${BACKEND_URL}${normalized}`;
  if (normalized.startsWith("uploads/")) return `${BACKEND_URL}/${normalized}`;
  return `${BACKEND_URL}/${normalized.replace(/^\/+/, "")}`;
};

const normalizeVideo = (video) => ({
  id: video?._id || video?.id,
  title: video?.title || "Untitled video",
  channel: video?.channelName || video?.channel?.name || "Unknown channel",
  thumbnail:
    toMediaUrl(video?.thumbnail || video?.thumb || "") ||
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800",
  views: Number(video?.views || 0),
  duration: video?.duration || "—",
  likesCount: Number(video?.likesCount || video?.likes || 0),
  status: video?.status || "Public",
  uploadDate: video?.createdAt
    ? new Date(video.createdAt).toLocaleDateString()
    : "Recently uploaded",
  createdAt: video?.createdAt,
  raw: video,
});

export default function YourVideosTab({ openDetail, sortBy, onSortChange }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVideos([]);
      setLoading(false);
      return;
    }

    fetch("https://bharat-pay.onrender.com/api/uservideo/my-videos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data?.videos) ? data.videos : [];
        setVideos(list.map(normalizeVideo));
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "earnings") return b.likesCount - a.likesCount;
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

      {loading ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          Loading your videos...
        </div>
      ) : sortedVideos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <p className="text-xl md:text-2xl font-medium">
            No videos uploaded yet
          </p>
          <p className="mt-3 text-sm md:text-base">
            Upload your first video to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {sortedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => openDetail(video.raw || video)}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-video sm:aspect-[4/3] sm:w-44 md:w-52 flex-shrink-0">
                  <img
                    src={
                      video.thumbnail || "uploads/1785320561817-355290654.jpg"
                    }
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-3.5 md:p-4 flex-1 flex flex-col">
                  <p className="text-sm text-zinc-400 mb-1.5">
                    {video.channel || "Unknown channel"}
                  </p>
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
                      <span>{formatTime(video.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400">
                      <Heart size={14} className="fill-red-500" />
                      <span>{video.likesCount.toLocaleString()}</span>
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
