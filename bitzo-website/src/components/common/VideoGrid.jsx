import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight, Play, Plus, Info } from "lucide-react";
import { toast } from "react-toastify";
import { fetchHomeVideos } from "../../features/videos/videosSlice";

const BACKEND_URL = "http://localhost:8000";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

const romanticShows = [
  {
    id: 1,
    title: "Love in the Clouds",
    thumb:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=225&fit=crop",
  },
  {
    id: 2,
    title: "Hidden Love",
    thumb:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=225&fit=crop",
  },
  {
    id: 3,
    title: "Queen of Tears",
    thumb:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=225&fit=crop",
  },
  {
    id: 4,
    title: "Inheritors",
    thumb:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
  },
  {
    id: 5,
    title: "When I Fly Towards You",
    thumb:
      "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&h=225&fit=crop",
  },
];

const kidsFilms = [
  {
    id: 101,
    title: "Chhota Bheem: The Crown",
    thumb:
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=225&fit=crop",
  },
  {
    id: 102,
    title: "Motu Patlu: Kung Fu",
    thumb:
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=225&fit=crop",
  },
  {
    id: 103,
    title: "Doraemon: Nobita",
    thumb:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop",
  },
  {
    id: 104,
    title: "Oggy & Cockroaches",
    thumb:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop",
  },
  {
    id: 105,
    title: "Shinchan Movie",
    thumb:
      "https://images.unsplash.com/photo-1606164587034-81b84c4e11d0?w=400&h=225&fit=crop",
  },
  {
    id: 106,
    title: "Tom & Jerry",
    thumb:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=225&fit=crop",
  },
];

// ────────────────────────────────────────────────
// Reusable components
// ────────────────────────────────────────────────

function useWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

function SectionHeader({ title }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-white text-xl font-semibold flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
        {title}
        <ChevronRight size={20} className="text-zinc-400" />
      </h2>
    </div>
  );
}

function MovieCard({ item, onClick, onAddToWatchLater }) {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handlePlusClick = async (e) => {
    e.stopPropagation(); // video open na ho
    if (adding || !onAddToWatchLater) return;
    setAdding(true);
    try {
      await onAddToWatchLater(item);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      className="shrink-0 rounded-md overflow-hidden relative bg-zinc-900 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 hover:ring-2 hover:ring-white/30 w-60 h-[135px] md:w-70 md:h-[158px]"
    >
      <img
        src={item.thumb}
        alt={item.title}
        className="h-full w-full object-cover"
      />

      {isHovered && (
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {/* Play button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(item);
                  }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90"
                >
                  <Play size={16} fill="black" />
                </button>

                {/* + button → Watch Later */}
                <button
                  onClick={handlePlusClick}
                  disabled={adding}
                  className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center hover:border-white disabled:opacity-50"
                  title="Add to Watch Later"
                >
                  <Plus size={16} />
                </button>

                {/* Info button */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center hover:border-white"
                >
                  <Info size={16} />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">{item.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NetflixStylePage() {
  const navigate = useNavigate();
  const isMobile = useWidth() < 768;
  const dispatch = useDispatch();
  const { recommended, trending, latest, subscriptions, shorts, loading } =
    useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchHomeVideos());
  }, [dispatch]);

  const isShortContent = (item) => {
    const rawTypes = item?.videoType ?? item?.raw?.videoType ?? [];
    const normalizedTypes = (Array.isArray(rawTypes) ? rawTypes : [rawTypes])
      .filter(Boolean)
      .map((type) => String(type).toLowerCase());

    return (
      Boolean(item?.isShort) ||
      normalizedTypes.some(
        (type) =>
          type === "short" || type === "shorts" || type.includes("short"),
      )
    );
  };

  const handleItemClick = (item) => {
    if (isShortContent(item)) {
      navigate(`/shorts/${item.id}`, { state: { video: item } });
      return;
    }

    navigate(`/video/${item.id}`, { state: { video: item } });
  };

  // ✅ Add to Watch Later
  const handleAddToWatchLater = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/watch-later/${item.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Added to Watch Later");
      } else {
        toast.error(data.message || "Failed to add");
      }
    } catch (err) {
      console.error("Add to Watch Later error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-show:hover::-webkit-scrollbar { display: block; height: 8px; }
        .scrollbar-show:hover::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .scrollbar-show:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
        .scrollbar-show:hover::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
      `}</style>

      <div className="mx-auto max-w-screen-2xl px-4 pt-20 md:px-12 lg:px-16 -mt-24 relative z-10 pb-10">
        {/* Recommended Videos */}
        <div className="mb-8 pt-8">
          <SectionHeader title="Recommended Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {loading && recommended.length === 0 ? (
              <p className="text-sm text-gray-400">
                Loading recommended videos...
              </p>
            ) : recommended.length > 0 ? (
              recommended.map((item) => (
                <div key={item.id} className="shrink-0 w-60 md:w-70">
                  <div className="relative">
                    <MovieCard
                      item={item}
                      onClick={handleItemClick}
                      onAddToWatchLater={handleAddToWatchLater}
                    />
                    <div className="mt-2">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 w-[70%]"></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.views?.toLocaleString() || 0} views
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                No recommended videos available right now.
              </p>
            )}
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-8">
          <SectionHeader title="Trending Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {loading && trending.length === 0 ? (
              <p className="text-sm text-gray-400">
                Loading trending videos...
              </p>
            ) : trending.length > 0 ? (
              trending.map((item) => (
                <div key={item.id} className="shrink-0 w-60 md:w-70">
                  <div className="relative">
                    <MovieCard
                      item={item}
                      onClick={handleItemClick}
                      onAddToWatchLater={handleAddToWatchLater}
                    />
                    <div className="mt-2">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 w-[70%]"></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.views?.toLocaleString() || 0} views
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                No trending videos available right now.
              </p>
            )}
          </div>
        </div>

        {/* Trending Shorts */}
        <div className="mb-12">
          <SectionHeader title="Trending Shorts" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loading && shorts.length === 0 ? (
              <p className="text-sm text-gray-400">
                Loading trending shorts...
              </p>
            ) : shorts.length > 0 ? (
              shorts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                    <img
                      src={
                        item.thumbnail ||
                        item.thumb ||
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs">
                      #{item.id % 10 || 1}
                    </div>
                  </div>
                  <h3 className="text-white text-sm font-medium truncate">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                    <span>
                      {Number(item.views || 0).toLocaleString()} views
                    </span>
                    <span>
                      {Number(item.likes || 0).toLocaleString()} likes
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                No trending shorts available right now.
              </p>
            )}
          </div>
        </div>

        {/* Latest Videos */}
        <div className="mb-8">
          <SectionHeader title="Latest Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {loading && latest.length === 0 ? (
              <p className="text-sm text-gray-400">Loading latest videos...</p>
            ) : latest.length > 0 ? (
              latest.map((item) => (
                <div key={item.id} className="shrink-0 w-60 md:w-70">
                  <div className="relative">
                    <MovieCard
                      item={item}
                      onClick={handleItemClick}
                      onAddToWatchLater={handleAddToWatchLater}
                    />
                    <div className="mt-2">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 w-[70%]"></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.views?.toLocaleString() || 0} views
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                No latest videos available right now.
              </p>
            )}
          </div>
        </div>

        {/* Subscription Videos */}
        <div className="mb-8">
          <SectionHeader title="Subscription Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {loading && subscriptions.length === 0 ? (
              <p className="text-sm text-gray-400">
                Loading subscription videos...
              </p>
            ) : subscriptions.length > 0 ? (
              subscriptions.map((item) => (
                <div key={item.id} className="shrink-0 w-60 md:w-70">
                  <MovieCard
                    item={item}
                    onClick={handleItemClick}
                    onAddToWatchLater={handleAddToWatchLater}
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                Subscribe to channels to see their videos here.
              </p>
            )}
          </div>
        </div>

        {/* Top Shorts */}
        <div className="mb-12">
          <SectionHeader title="Top Shorts" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loading && shorts.length === 0 ? (
              <p className="text-sm text-gray-400">Loading top shorts...</p>
            ) : shorts.length > 0 ? (
              shorts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                    <img
                      src={
                        item.thumbnail ||
                        item.thumb ||
                        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs">
                      #{item.id % 10 || 1}
                    </div>
                  </div>
                  <h3 className="text-white text-sm font-medium truncate">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                    <span>
                      {Number(item.views || 0).toLocaleString()} views
                    </span>
                    <span>
                      {Number(item.likes || 0).toLocaleString()} likes
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                No top shorts available right now.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
