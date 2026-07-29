

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   Volume2,
//   VolumeX,
//   MoreHorizontal,
//   Music2,
// } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /* 🔹 SAMPLE REELS DATA (DIRECT MP4 ONLY) */
// const shortsData = [
//   {
//     id: "s1",
//     title: "Amazing Nature Moments",
//     views: "2.6M views",
//     likes: "145K",
//     comments: "3.2K",
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     id: "s2",
//     title: "Cute Cats Compilation",
//     views: "4.2M views",
//     likes: "220K",
//     comments: "8.5K",
//     videoUrl: "https://www.w3schools.com/html/movie.mp4",
//   },
// ];

// export default function Shorts() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [liked, setLiked] = useState({});
//   const [muted, setMuted] = useState(true);

//   const containerRef = useRef(null);
//   const videoRefs = useRef([]);

//   /* ▶️ PLAY ONLY ACTIVE VIDEO */
//   useEffect(() => {
//     videoRefs.current.forEach((video, index) => {
//       if (!video) return;

//       if (index === currentIndex) {
//         video.muted = true; // autoplay allow
//         video.play().catch(() => {});
//       } else {
//         video.pause();
//       }
//     });
//   }, [currentIndex]);

//   /* 📜 SMOOTH SCROLL + SNAP DETECTION */
//   const handleScroll = () => {
//     const scrollTop = containerRef.current.scrollTop;
//     const height = window.innerHeight;
//     setCurrentIndex(Math.round(scrollTop / height));
//   };

//   /* 🔔 TOAST */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       toast.info("👀 Watch more reels", {
//         position: "bottom-center",
//         theme: "dark",
//         autoClose: 3000,
//       });
//     }, 12000);

//     return () => clearTimeout(timer);
//   }, [currentIndex]);

//   return (
//     <div className="fixed inset-0 bg-black flex justify-center items-center">
//       {/* 🎥 REELS FEED (CENTERED + SMOOTH SCROLL) */}
//       <div
//         ref={containerRef}
//         onScroll={handleScroll}
//         className="
//           h-screen
//           w-full
//           max-w-[500px]
//           overflow-y-scroll
//           snap-y
//           snap-mandatory
//           scroll-smooth
//           overscroll-contain
//           touch-pan-y
//           scrollbar-hide
//         "
//       >
//         {shortsData.map((short, index) => (
//           <div
//             key={short.id}
//             className="relative h-screen snap-start snap-always"
//           >
//             {/* VIDEO */}
//             <video
//               ref={(el) => (videoRefs.current[index] = el)}
//               src={short.videoUrl}
//               className="w-full h-full object-cover"
//               loop
//               muted={muted}
//               playsInline
//             />

//             {/* OVERLAY */}
//             <div className="absolute inset-0 bg-black/20" />

//             {/* LEFT INFO */}
//             <div className="absolute bottom-24 left-4 z-10">
//               <h2 className="text-white font-semibold text-lg">
//                 {short.title}
//               </h2>
//               <p className="text-white/70 text-sm">{short.views}</p>
//               <p className="text-white/60 text-xs flex items-center gap-1">
//                 <Music2 size={14} />
//                 Original Audio
//               </p>
//             </div>

//             {/* RIGHT ACTIONS */}
//             <div className="absolute right-3 bottom-28 z-10 flex flex-col items-center gap-5 text-white">
//               <button
//                 onClick={() =>
//                   setLiked((p) => ({ ...p, [short.id]: !p[short.id] }))
//                 }
//               >
//                 <Heart
//                   size={28}
//                   className={
//                     liked[short.id]
//                       ? "text-red-500 fill-red-500"
//                       : ""
//                   }
//                 />
//                 <p className="text-xs">{short.likes}</p>
//               </button>

//               <button>
//                 <MessageCircle size={28} />
//                 <p className="text-xs">{short.comments}</p>
//               </button>

//               <button>
//                 <Share2 size={28} />
//               </button>

//               <button onClick={() => setMuted(!muted)}>
//                 {muted ? <VolumeX size={28} /> : <Volume2 size={28} />}
//               </button>

//               <MoreHorizontal size={24} />
//             </div>
//           </div>
//         ))}
//       </div>

//       <ToastContainer />
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
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

/* 🔹 SAMPLE REELS DATA (DIRECT MP4 ONLY) */
const shortsData = [
  {
    id: "s1",
    title: "Amazing Nature Moments",
    views: "2.6M views",
    likes: "145K",
    comments: "3.2K",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "s2",
    title: "Cute Cats Compilation",
    views: "4.2M views",
    likes: "220K",
    comments: "8.5K",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  // You can add 5–10 more items for better testing
];

export default function Shorts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(true);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // ─── Change video with bounds check ───
  const goToVideo = (newIndex) => {
    if (newIndex < 0 || newIndex >= shortsData.length) return;
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
  }, [currentIndex, muted]);

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
        {shortsData.map((short, index) => (
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
              <p className="text-white/80 text-base mt-1">{short.views}</p>
              <p className="text-white/70 text-sm flex items-center gap-1.5 mt-1">
                <Music2 size={16} />
                Original Audio
              </p>
            </div>

            {/* Right side buttons */}
            <div className="absolute right-5 bottom-32 z-10 flex flex-col items-center gap-6 text-white">
              <button
                onClick={() =>
                  setLiked((prev) => ({ ...prev, [short.id]: !prev[short.id] }))
                }
              >
                <Heart
                  size={32}
                  className={liked[short.id] ? "text-red-500 fill-red-500" : ""}
                />
                <p className="text-sm mt-1">{short.likes}</p>
              </button>

              <button>
                <MessageCircle size={32} />
                <p className="text-sm mt-1">{short.comments}</p>
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
        ))}
      </div>

      <ToastContainer limit={1} />
    </div>
  );
}