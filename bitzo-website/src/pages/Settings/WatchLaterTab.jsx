import React, { useEffect, useState } from "react";
import { Bookmark, Clock, X } from "lucide-react";
import { toast } from "react-toastify";
import { formatTime } from "../../components/player/utils";
import { API_USERVIDEO as API_BASE } from "../../config/api";

export default function WatchLaterTab({ openDetail }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVideos([]);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/watch-later`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const normalizedVideos = Array.isArray(data.videos)
          ? data.videos.map((video) => ({
              ...video,
              channel:
                typeof video.channel === "object" && video.channel !== null
                  ? video.channel
                  : {
                      name:
                        video.channelName || video.channel || "Unknown channel",
                    },
            }))
          : [];

        setVideos(normalizedVideos);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/watch-later/${videoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        const targetId = String(videoId);
        setVideos((prev) =>
          prev.filter((v) => String(v._id || v.id) !== targetId),
        );
        toast.success("Removed from Watch Later");
      } else {
        toast.error(data.message || "Failed to remove from Watch Later");
      }
    } catch (error) {
      console.error("Failed to remove from Watch Later:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold">Watch Later</h3>
        <span className="text-sm text-zinc-500">{videos.length} videos</span>
      </div>

      {loading ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          Loading...
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <Bookmark
            size={48}
            className="mx-auto mb-4 text-zinc-600"
            strokeWidth={1.5}
          />
          <p className="text-xl md:text-2xl font-medium">
            Watch Later is empty
          </p>
          <p className="mt-3 text-sm md:text-base">Save videos for later</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {videos.map((video) => (
            <div
              key={video._id || video.id}
              onClick={() => openDetail(video)}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer active:scale-[0.995] group relative"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-video sm:aspect-[4/3] sm:w-44 md:w-52 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3.5 md:p-4 flex-1 flex flex-col">
                  <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2 group-hover:text-red-400">
                    {video.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">
                    {video.channel?.name || "Unknown channel"}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 mt-auto">
                    {video.duration && (
                      <>
                        <Clock size={14} />
                        <span>{formatTime(video.duration)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Remove button - visible on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(video._id || video.id);
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
