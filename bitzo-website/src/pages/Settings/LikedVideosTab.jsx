import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function LikedVideosTab({ openDetail }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVideos([]);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/uservideo/liked", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVideos(Array.isArray(data.videos) ? data.videos : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 md:space-y-6 px-3 sm:px-4 md:px-0 ml-5 mt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold pl-10">Liked Videos</h3>
        <span className="text-sm text-zinc-500">{videos.length} videos</span>
      </div>

      {loading ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          Loading...
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 md:py-24 text-zinc-500">
          <Heart size={48} className="mx-auto mb-4 text-zinc-600" />
          <p className="text-xl md:text-2xl font-medium">No liked videos yet</p>
          <p className="mt-3 text-sm md:text-base">Tap the heart to save videos here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {videos.map((video) => (
            <div
              key={video._id || video.id}
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
                <div className="p-3.5 md:p-4 flex-1 flex flex-col">
                  <h4 className="font-medium text-base md:text-lg line-clamp-2 mb-2 group-hover:text-red-400">
                    {video.title}
                  </h4>
                  <p className="text-sm text-zinc-400 mb-2">
                    {video.channel?.name || "Unknown channel"}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 mt-auto">
                    <div className="flex items-center gap-1.5 text-red-400">
                      <Heart size={14} className="fill-red-500" />
                      <span>{video.likes || 0}</span>
                    </div>
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