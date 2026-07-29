import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Send,
  ChevronDown,
  Check,
} from "lucide-react";

const BACKEND_URL = "http://localhost:8000";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

// Fake data (same as yours + some additions)
const VIDEO_POOL = [
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
  },
  {
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
  },
  {
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
  },
];

const UP_NEXT_VIDEOS = [
  {
    id: 2,
    title: "Sintel – Short Fantasy Film",
    channel: "Blender Foundation",
    views: "4.2M",
    time: "2 days ago",
  },
  {
    id: 3,
    title: "Elephants Dream – Surreal Animation",
    channel: "Blender Foundation",
    views: "1.8M",
    time: "1 week ago",
  },
  {
    id: 4,
    title: "Tears of Steel – Post-Apocalyptic CGI",
    channel: "Blender Foundation",
    views: "3.1M",
    time: "5 days ago",
  },
  {
    id: 5,
    title: "Big Buck Bunny – Funny Animation",
    channel: "Blender Foundation",
    views: "12M",
    time: "3 years ago",
  },
  {
    id: 6,
    title: "Cosmos – A Spacetime Odyssey (clip)",
    channel: "National Geographic",
    views: "8.7M",
    time: "1 month ago",
  },
];

function getVideoEntry(id) {
  const idx =
    (typeof id === "number" ? id : parseInt(id) || 1) % VIDEO_POOL.length;
  return VIDEO_POOL[idx];
}

export default function YouTubeLikeVideoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const videoData = location.state?.video || {
    id: id || 1,
    title: "Big Buck Bunny",
    channel: "Blender Foundation",
  };

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
  const [viewCounted, setViewCounted] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const videoRef = useRef(null);
  const controlsTimer = useRef(null);
  const viewTracked = useRef(false);

  const entry = getVideoEntry(videoData.id);
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

  const resolvedVideoUrl = videoDetails?.videoUrl
    ? resolveMediaUrl(videoDetails.videoUrl)
    : entry.video;
  const resolvedPoster = videoDetails?.thumbnail
    ? resolveMediaUrl(videoDetails.thumbnail)
    : entry.poster;

  // Format time MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.load();
    if (playing) v.play().catch(() => {});
    else v.pause();

    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [playing, resolvedVideoUrl]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await response.json();
        if (data.success && data.video) {
          setVideoDetails(data.video);
          setStats({
            likes: data.video.likesCount || 0,
            dislikes: data.video.dislikesCount || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/${id}/comments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (data.success) {
          setComments(Array.isArray(data.comments) ? data.comments : []);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchVideo();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (!id || viewTracked.current) return;

    viewTracked.current = true;
    fetch(`${API_BASE}/${id}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        watchedPercent: 0,
        userId: localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))._id ||
            JSON.parse(localStorage.getItem("user")).id
          : null,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (data.success && typeof data.views === "number") {
          setVideoDetails((prev) =>
            prev ? { ...prev, views: data.views } : prev,
          );
        }
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!id || !duration || !videoRef.current || viewCounted) return;

    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
    if (percent >= 80) {
      setViewCounted(true);
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;

      fetch(`${API_BASE}/${id}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          watchedPercent: 100,
          userId: parsedUser?._id || parsedUser?.id || null,
        }),
      }).catch(() => {});
    }
  }, [currentTime, duration, id, viewCounted]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    setShowControls(true);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    if (val === 0) setMuted(true);
    else setMuted(false);
  };

  const handleReaction = async (type) => {
    if (!id) return;

    const token = localStorage.getItem("token");
    const endpoint =
      type === "like" ? `${API_BASE}/${id}/like` : `${API_BASE}/${id}/dislike`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();

      if (data.success) {
        if (type === "like") {
          setReaction((prev) => (prev === "like" ? null : "like"));
          setStats((prev) => ({
            likes: prev.likes + (reaction === "like" ? 0 : 1),
            dislikes: prev.dislikes,
          }));
        } else {
          setReaction((prev) => (prev === "dislike" ? null : "dislike"));
          setStats((prev) => ({
            likes: prev.likes,
            dislikes: prev.dislikes + (reaction === "dislike" ? 0 : 1),
          }));
        }
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  const handleSubscribe = async () => {
    const channelId = videoDetails?.channel?._id || videoDetails?.channel?.id;
    if (!channelId) return;

    setSubscribeLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/subscribe/${channelId}`, {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.success) {
        setIsSubscribed(Boolean(data.subscribed));
      }
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;

    setCommentLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ commentText: commentText.trim() }),
      });
      const data = await response.json();

      if (data.success) {
        const newComment = {
          _id: Date.now().toString(),
          text: commentText.trim(),
          createdAt: new Date().toISOString(),
        };
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const openVideo = (vid) => {
    navigate(`/video/${vid.id}`, { state: { video: vid }, replace: true });
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">
      <style jsx global>{`
        .seek-bar:hover .seek-progress {
          background: #f00 !important;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>

      {/* Video + Metadata + Comments + Sidebar */}
      <div className="max-w-[1750px] mx-auto px-4 pt-4 flex flex-col lg:flex-row gap-6">
        {/* Left – Video + Description + Comments */}
        <div className="flex-1 max-w-[1280px]">
          {/* Video Player */}
          <div
            className="relative bg-black rounded-xl overflow-hidden aspect-video group"
            onMouseMove={handleMouseMove}
            onClick={handlePlayPause}
          >
            <video
              key={resolvedVideoUrl}
              ref={videoRef}
              src={resolvedVideoUrl}
              poster={resolvedPoster}
              muted={muted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Controls overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${
                showControls || !playing
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Top – Title & Close */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <h1 className="text-xl md:text-2xl font-bold line-clamp-2 max-w-[70%] drop-shadow-lg">
                  {videoDetails?.title || videoData.title}
                </h1>
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/80"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Center – Big Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  {playing ? (
                    <Pause size={36} />
                  ) : (
                    <Play size={36} fill="white" />
                  )}
                </div>
              </button>

              {/* Bottom controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                {/* Progress bar */}
                <div
                  className="h-1.5 bg-white/30 rounded-full cursor-pointer seek-bar group/seek"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-red-600 rounded-full relative seek-progress"
                    style={{
                      width:
                        duration > 0
                          ? `${(currentTime / duration) * 100}%`
                          : "0%",
                    }}
                  >
                    <div className="absolute -top-2 -right-1.5 w-4 h-4 bg-red-600 rounded-full scale-0 group-hover/seek:scale-100 transition-transform" />
                  </div>
                </div>

                {/* Time + Volume + Actions */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setMuted(!muted)}>
                        {muted || volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 accent-red-600 volume-slider"
                      />
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <ThumbsUp size={20} />
                    <ThumbsDown size={20} />
                    <Share2 size={20} />
                    <MoreHorizontal size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info Card */}
          <div className="mt-4 bg-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                  alt="Channel"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold">
                  {videoDetails?.title || videoData.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                  <span>
                    {(videoDetails?.views || 0).toLocaleString()} views
                  </span>
                  <span>•</span>
                  <span>
                    {videoDetails?.createdAt
                      ? new Date(videoDetails.createdAt).toLocaleDateString()
                      : "Recently added"}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {videoDetails?.channel?.name ||
                        videoData.channel ||
                        "Channel"}
                    </span>
                    <div className="bg-gray-600 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={12} /> Verified
                    </div>
                  </div>
                  <span className="text-gray-400">• 1.24M subscribers</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleReaction("like")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      reaction === "like"
                        ? "bg-white/20"
                        : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <ThumbsUp
                      size={18}
                      fill={reaction === "like" ? "white" : "none"}
                    />
                    <span>{stats.likes}</span>
                  </button>

                  <button
                    onClick={() => handleReaction("dislike")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      reaction === "dislike"
                        ? "bg-white/20"
                        : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <ThumbsDown
                      size={18}
                      fill={reaction === "dislike" ? "white" : "none"}
                    />
                    <span>{stats.dislikes}</span>
                  </button>

                  <button
                    onClick={handleSubscribe}
                    disabled={subscribeLoading}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition ${
                      isSubscribed
                        ? "bg-white/15 text-white hover:bg-white/20"
                        : "bg-white text-black hover:bg-gray-200"
                    } ${subscribeLoading ? "opacity-70" : ""}`}
                  >
                    {subscribeLoading
                      ? "Please wait..."
                      : isSubscribed
                        ? "Subscribed"
                        : "Subscribe"}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 text-gray-300 text-sm leading-relaxed">
              <p>
                {videoDetails?.description ||
                  "This video is being loaded from the server. The selected content will play here."}
              </p>
              <button className="text-blue-400 hover:underline mt-2">
                Show more
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 bg-[#1a1a1a] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Comments • {Math.floor(Math.random() * 8000 + 500)}
            </h3>

            <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0" />
              <div className="flex-1">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setCommentText("")}
                    className="px-4 py-1.5 text-sm hover:bg-white/10 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                    className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-60"
                  >
                    <Send size={16} />{" "}
                    {commentLoading ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </form>

            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="rounded-lg bg-[#0f0f0f] p-3 border border-gray-800"
                  >
                    <p className="text-sm text-white">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No comments yet • Be the first to share what you think!
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar – Up Next */}
        <div className="w-full lg:w-96 xl:w-[402px] flex-shrink-0">
          <h2 className="text-lg font-semibold mb-3 px-1">Up next</h2>

          <div className="space-y-3">
            {UP_NEXT_VIDEOS.map((vid) => {
              const e = getVideoEntry(vid.id);
              return (
                <div
                  key={vid.id}
                  onClick={() => openVideo(vid)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="relative w-40 md:w-44 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={e.poster}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1.5 py-0.5 rounded">
                      14:23
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-white/90">
                      {vid.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{vid.channel}</p>
                    <p className="text-xs text-gray-400">
                      {vid.views} views • {vid.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
