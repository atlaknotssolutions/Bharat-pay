import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import { formatTime } from "../../components/player/utils";
import { API_ORIGIN as BACKEND_URL } from "../../config/api";

export default function WatchHistoryTab({ openDetail }) {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thumbnail / media URL fix
  const resolveMediaUrl = (value) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;

    const normalized = value.replace(/\\/g, "/");
    if (normalized.startsWith("uploads/")) {
      return `${BACKEND_URL}/${normalized}`;
    }
    if (normalized.includes("uploads/")) {
      return `${BACKEND_URL}/${normalized.split("uploads/").pop()}`;
    }
    if (normalized.startsWith("/uploads/")) {
      return `${BACKEND_URL}${normalized}`;
    }
    return `${BACKEND_URL}/${normalized}`;
  };

  // Fetch history
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVideos([]);
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/api/uservideo/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data.videos) ? data.videos : [];
        setVideos(list);
      })
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

  const handleRemove = async (e, videoId) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/uservideo/history/${videoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => prev.filter((v) => (v._id || v.id) !== videoId));
        toast.success("Removed from watch history");
      } else {
        toast.error(data.message || "Failed to remove from history");
      }
    } catch (err) {
      console.error("Error removing from history:", err);
      toast.error("Something went wrong");
    }
  };

  const handleClearAll = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/uservideo/history`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setVideos([]);
        toast.success("Watch history cleared");
      } else {
        toast.error(data.message || "Failed to clear history");
      }
    } catch (err) {
      console.error("Error clearing watch history:", err);
      toast.error("Something went wrong");
    }
  };

  const formatViews = (num) => {
    if (!num) return "0 views";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M views";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K views";
    return num + " views";
  };

  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <Clock size={22} />
          Watch History
        </h3>
        {videos.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-zinc-400 hover:text-red-400 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          Loading...
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <Clock size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-xl md:text-2xl">No watch history yet</p>
          <p className="mt-3 text-sm md:text-base">
            Videos you watch will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {videos.map((video) => {
            const videoId = video._id || video.id;
            return (
              <div
                key={videoId}
                onClick={() => handleOpen(video)}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="relative aspect-video sm:aspect-video sm:w-44 md:w-52 flex-shrink-0 bg-zinc-800">
                    <img
                      src={resolveMediaUrl(video.thumbnail)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/320x180?text=No+Thumbnail";
                      }}
                    />
                    {video.duration && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatTime(video.duration)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 md:p-4 flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-sm text-zinc-400 mb-1">
                        {video.channel?.name ||
                          video.channelName ||
                          "Unknown channel"}
                      </p>
                      <p className="text-xs md:text-sm text-zinc-500">
                        {formatViews(video.views)}
                        {video.watchedAt && (
                          <span>
                            {" "}
                            • Watched{" "}
                            {new Date(video.watchedAt).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Remove button */}
                  <div className="flex items-start p-3 sm:pr-4">
                    <button
                      onClick={(e) => handleRemove(e, videoId)}
                      className="p-2 rounded-full text-zinc-500 hover:text-red-400 hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove from history"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
