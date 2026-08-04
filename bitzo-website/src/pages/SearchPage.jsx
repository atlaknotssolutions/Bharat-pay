import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import {
  API_BASE,
  clearSearch,
  searchVideos,
} from "../features/videos/videosSlice";
import { MovieCard } from "../components/common/VideoGrid";
import ShortCard from "../components/common/ShortCard";

const PAGE_SIZE = 20;

export default function SearchPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);

  const { searchVideos: videoResults, searchShorts: shortResults, searchTotal, searchLoading, searchError } =
    useSelector((state) => state.videos);

  useEffect(() => {
    if (!q) {
      dispatch(clearSearch());
      return;
    }
    dispatch(searchVideos({ query: q, page, limit: PAGE_SIZE }));
  }, [q, page, dispatch]);

  const totalPages = Math.max(Math.ceil(searchTotal / PAGE_SIZE), 1);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setSearchParams({ q, page: String(nextPage) });
    window.scrollTo({ top: 0 });
  };

  const handleVideoClick = (item) => {
    navigate(`/video/${item.id}`, { state: { video: item } });
  };

  const handleShortClick = (item) => {
    navigate(`/shorts/${item.id}`, { state: { video: item } });
  };

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

  if (!q) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-12 lg:px-16 py-8">
          <p className="text-sm text-gray-400">
            Search for videos, shorts and channels.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-12 lg:px-16 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-white text-2xl font-semibold">
            Results for &quot;{q}&quot;
          </h1>
          <span className="text-sm text-gray-400">
            {searchTotal.toLocaleString()} results
          </span>
        </div>

        {searchLoading ? (
          <p className="text-sm text-gray-400">
            Searching for &quot;{q}&quot;...
          </p>
        ) : searchError ? (
          <p className="text-sm text-red-400">{searchError}</p>
        ) : videoResults.length === 0 && shortResults.length === 0 ? (
          <p className="text-sm text-gray-400">
            No results found for &quot;{q}&quot;.
          </p>
        ) : (
          <>
            {videoResults.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white text-xl font-semibold mb-3">
                  Videos
                </h2>
                <div className="flex flex-wrap gap-4">
                  {videoResults.map((item) => (
                    <MovieCard
                      key={item.id}
                      item={item}
                      onClick={handleVideoClick}
                      onAddToWatchLater={handleAddToWatchLater}
                    />
                  ))}
                </div>
              </div>
            )}

            {shortResults.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white text-xl font-semibold mb-3">
                  Shorts
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {shortResults.map((item) => (
                    <ShortCard
                      key={item.id}
                      item={item}
                      onClick={handleShortClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-sm flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-sm flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
