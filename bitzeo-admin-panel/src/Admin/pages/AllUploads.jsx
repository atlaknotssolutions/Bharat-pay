import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Upload,
  Film,
  Video,
} from "lucide-react";
import { fetchUploads, setSearch } from "../../redux/slices/adminUploadsSlice";
import { API_BASE_URL } from "../../api";

const MEDIA_BASE = API_BASE_URL.replace(/\/api\/?$/, "");
const TYPE_MAP = { all: "all", videos: "long", shorts: "short" };

const TAB_DEFS = [
  { key: "all", label: "All" },
  { key: "videos", label: "Videos" },
  { key: "shorts", label: "Shorts" },
];

const LIMIT = 10;

function formatDuration(sec) {
  if (!sec && sec !== 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-gray-800/60">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-24 h-14 bg-gray-800 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-6 w-14 bg-gray-800 rounded-full animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-10 bg-gray-800 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-10 bg-gray-800 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-10 bg-gray-800 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-800 rounded animate-pulse" /></td>
    </tr>
  ));
}

export default function AllUploads() {
  const dispatch = useDispatch();
  const { tabs, counts } = useSelector((s) => s.adminUploads);

  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef(null);

  const tab = tabs[activeTab] || tabs.all;
  const { items, pagination, _loading, _loaded, _error, _search } = tab;

  const loadData = useCallback(
    (type, page, search, force = false) => {
      dispatch(
        fetchUploads({
          tabKey: type,
          type: TYPE_MAP[type],
          page,
          limit: LIMIT,
          search,
          force,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (!_loaded && !_loading) {
      loadData(activeTab, 1, _search || "");
    }
  }, [activeTab, _loaded, _loading, _search, loadData]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const t = tabs[newTab] || tabs.all;
    setSearchInput(t._search || "");
    if (!t._loaded && !t._loading) {
      loadData(newTab, 1, t._search || "");
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setSearch({ type: activeTab, search: val }));
      loadData(activeTab, 1, val);
    }, 400);
  };

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const handlePageChange = (newPage) => {
    loadData(activeTab, newPage, _search || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIdx = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endIdx = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-400" />
          Uploads
        </h1>
        <p className="text-gray-400 mt-1">Manage all videos and shorts</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {TAB_DEFS.map((t) => {
          const isActive = activeTab === t.key;
          const count = counts[t.key] || 0;
          return (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search uploads..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Error */}
      {_error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="flex-1">{_error}</span>
          <button
            onClick={() => loadData(activeTab, 1, _search || "", true)}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 text-left text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {_loading && !_loaded ? (
                <SkeletonRows />
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Film size={40} className="text-gray-600" />
                      <p className="text-lg font-medium text-gray-400">
                        {_search
                          ? `No uploads found for "${_search}"`
                          : "No uploads yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const thumbSrc = item.thumbnail
                    ? item.thumbnail.startsWith("http")
                      ? item.thumbnail
                      : `${MEDIA_BASE}/${item.thumbnail}`
                    : null;
                  const isVideo =
                    Array.isArray(item.videoType)
                      ? item.videoType.includes("long")
                      : item.videoType === "long";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Content */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            {thumbSrc ? (
                              <img
                                src={thumbSrc}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video size={18} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-200 truncate max-w-[200px]">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.category?.name || "—"}
                              {" · "}
                              {formatDuration(item.duration)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {item.uploadedBy?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">
                              {item.uploadedBy?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.uploadedBy?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            isVideo
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                              : "bg-pink-500/15 text-pink-400 border border-pink-500/20"
                          }`}
                        >
                          {isVideo ? "Video" : "Short"}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {(item.views || 0).toLocaleString()}
                      </td>

                      {/* Likes */}
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {(item.likesCount || 0).toLocaleString()}
                      </td>

                      {/* Comments */}
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {(item.commentCount || 0).toLocaleString()}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Loading overlay for tab switch / pagination */}
        {_loading && _loaded && (
          <div className="flex items-center justify-center py-4 border-t border-gray-800">
            <Loader2 size={20} className="animate-spin text-indigo-400 mr-2" />
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 text-sm text-gray-400">
            <span>
              Showing {startIdx}–{endIdx} of {pagination.total.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPreviousPage}
                className="p-2 rounded-lg border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.totalPages || 0 }).map((_, i) => {
                const p = i + 1;
                if (
                  pagination.totalPages > 7 &&
                  p > 2 &&
                  p < pagination.totalPages - 1 &&
                  Math.abs(p - pagination.page) > 1
                ) {
                  if (p === 3 || p === pagination.totalPages - 2) {
                    return (
                      <span key={p} className="px-1 text-gray-600">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      p === pagination.page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
