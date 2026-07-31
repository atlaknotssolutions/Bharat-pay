
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Music2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSwipeable } from "react-swipeable"; // ← install: npm install react-swipeable

const BACKEND_URL = "http://localhost:8000";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

const toMediaUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value.replace(/\\/g, "/");
  const normalized = value.replace(/\\/g, "/");
  if (normalized.startsWith("/uploads/")) return `${BACKEND_URL}${normalized}`;
  if (normalized.startsWith("uploads/")) return `${BACKEND_URL}/${normalized}`;
  return `${BACKEND_URL}/${normalized.replace(/^\/+/, "")}`;
};

const normalizeShort = (v) => ({
  id: v._id || v.id,
  title: v.title || "Untitled Short",
  videoUrl: toMediaUrl(v.videoUrl),
  views: Number(v.views) || 0,
  likes: Number(v.likesCount) || 0,
  comments: Array.isArray(v.comments) ? v.comments.length : Number(v.comments) || 0,
});

const formatViews = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(/\.0$/, "")}M views`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${v} views`;
};

const formatCount = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return `${v}`;
};

export default function Shorts() {
  const location = useLocation();
  const initialShort = location.state?.video || null;

  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(true);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // ─── Load real shorts from backend ───
  useEffect(() => {
    let cancelled = false;

    const fetchShorts = async () => {
      const token = localStorage.getItem("token");

      try {
        let fetched = [];
        if (token) {
          const response = await fetch(`${API_BASE}/trending-shorts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          fetched = Array.isArray(data.videos) ? data.videos : [];
        }

        if (cancelled) return;

        const list = fetched
          .map(normalizeShort)
          .filter((s) => s.videoUrl);

        let queue = list;
        let startIndex = 0;

        if (initialShort) {
          const existingIdx = list.findIndex(
            (s) => s.id === initialShort.id
          );

          if (existingIdx >= 0) {
            // Clicked short is already in the backend queue → start there
            startIndex = existingIdx;
          } else {
            // Clicked short not in queue → put it first, then the rest
            const clicked = normalizeShort(initialShort);
            queue = [clicked, ...list.filter((s) => s.id !== clicked.id)];
            startIndex = 0;
          }
        }

        if (queue.length === 0 && initialShort) {
          const clicked = normalizeShort(initialShort);
          if (clicked.videoUrl) {
            queue = [clicked];
            startIndex = 0;
          }
        }

        setShorts(queue);
        setCurrentIndex(startIndex);
      } catch (error) {
        console.error("Error loading shorts:", error);
        if (!cancelled && initialShort) {
          const clicked = normalizeShort(initialShort);
          if (clicked.videoUrl) {
            setShorts([clicked]);
            setCurrentIndex(0);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchShorts();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Change video with bounds check ───
  const goToVideo = (newIndex) => {
    if (newIndex < 0 || newIndex >= shorts.length) return;
    setCurrentIndex(newIndex);

    // Optional: smooth scroll to make vertical feel natural too
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: newIndex * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // ─── Swipe left = next ─── swipe right = previous ───
  const handlers = useSwipeable({
    onSwipedLeft: () => goToVideo(currentIndex + 1),
    onSwipedRight: () => goToVideo(currentIndex - 1),
    trackMouse: true,           // for desktop testing (optional)
    delta: 60,                  // how many px needed to count as swipe
    preventScrollOnSwipe: true, // prevents vertical scroll conflict
    swipeDuration: 400,
  });

  // Play only current video
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === currentIndex) {
        video.currentTime = 0; // restart from beginning (optional)
        video.muted = muted;   // respect global mute
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex, muted, shorts]);

  // Update current index when user scrolls vertically
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const toggleLike = async (short) => {
    const isNowLiked = !liked[short.id];
    setLiked((prev) => ({ ...prev, [short.id]: isNowLiked }));

    const token = localStorage.getItem("token");
    if (!token || !short.id) return;

    try {
      const response = await fetch(`${API_BASE}/${short.id}/like`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (data.success && typeof data.likes === "number") {
        setShorts((prev) =>
          prev.map((s) =>
            s.id === short.id ? { ...s, likes: data.likes } : s
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Toast reminder (runs once per video change)
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("👀 Watch more reels → swipe left", {
        position: "bottom-center",
        theme: "dark",
        autoClose: 2800,
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div
      className="fixed inset-0 bg-black flex justify-center items-center touch-none"
      {...handlers} // ← swipe gestures work on whole screen
    >
      {/* Main scroll container – vertical snap */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="
          h-screen w-full max-w-[500px]
          overflow-y-scroll
          snap-y snap-mandatory
          scroll-smooth
          overscroll-contain
          touch-pan-y
          scrollbar-hide
        "
      >
        {loading ? (
          <div className="h-screen w-full flex items-center justify-center">
            <p className="text-white/70 text-sm">Loading shorts...</p>
          </div>
        ) : shorts.length === 0 ? (
          <div className="h-screen w-full flex items-center justify-center">
            <p className="text-white/70 text-sm">No shorts available yet.</p>
          </div>
        ) : (
          shorts.map((short, index) => (
            <div
              key={short.id}
              className="relative h-screen w-full snap-start snap-always"
            >
              {/* VIDEO */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={short.videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={muted}
                playsInline
                preload="auto"
              />

              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />

              {/* Bottom left – info */}
              <div className="absolute bottom-28 left-5 z-10 text-white">
                <h2 className="font-semibold text-xl drop-shadow-md">
                  {short.title}
                </h2>
                <p className="text-white/80 text-base mt-1">
                  {formatViews(short.views)}
                </p>
                <p className="text-white/70 text-sm flex items-center gap-1.5 mt-1">
                  <Music2 size={16} />
                  Original Audio
                </p>
              </div>

              {/* Right side buttons */}
              <div className="absolute right-5 bottom-32 z-10 flex flex-col items-center gap-6 text-white">
                <button onClick={() => toggleLike(short)}>
                  <Heart
                    size={32}
                    className={liked[short.id] ? "text-red-500 fill-red-500" : ""}
                  />
                  <p className="text-sm mt-1">
                    {formatCount(liked[short.id] ? short.likes + 1 : short.likes)}
                  </p>
                </button>

                <button>
                  <MessageCircle size={32} />
                  <p className="text-sm mt-1">{formatCount(short.comments)}</p>
                </button>

                <button>
                  <Share2 size={32} />
                </button>

                <button onClick={() => setMuted(!muted)}>
                  {muted ? <VolumeX size={32} /> : <Volume2 size={32} />}
                </button>

                <MoreHorizontal size={28} />
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer limit={1} />
    </div>
  );
}
