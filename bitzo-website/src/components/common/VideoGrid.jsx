

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Play, Plus, Info } from "lucide-react";

// ────────────────────────────────────────────────
// Different content arrays for each section
// ────────────────────────────────────────────────
const romanticShows = [
  { id: 1, title: "Love in the Clouds", thumb: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=225&fit=crop" },
  { id: 2, title: "Hidden Love", thumb: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=225&fit=crop" },
  { id: 3, title: "Queen of Tears", thumb: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=225&fit=crop" },
  { id: 4, title: "Inheritors", thumb: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop" },
  { id: 5, title: "When I Fly Towards You", thumb: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&h=225&fit=crop" },
  // { id: 6, title: "Lovely Runner", thumb: "https://images.unsplash.com/photo-1519741497674-281450b9b157?w=400&h=225&fit=crop" },
];

const kidsFilms = [
  { id: 101, title: "Chhota Bheem: The Crown", thumb: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=225&fit=crop" },
  { id: 102, title: "Motu Patlu: Kung Fu", thumb: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=225&fit=crop" },
  { id: 103, title: "Doraemon: Nobita", thumb: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop" },
  { id: 104, title: "Oggy & Cockroaches", thumb: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop" },
  { id: 105, title: "Shinchan Movie", thumb: "https://images.unsplash.com/photo-1606164587034-81b84c4e11d0?w=400&h=225&fit=crop" },
  { id: 106, title: "Tom & Jerry", thumb: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=225&fit=crop" },
];

const koreanContent = [
  { id: 201, title: "Vincenzo", thumb: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&fit=crop" },
  { id: 202, title: "Crash Landing on You", thumb: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop" },
  { id: 203, title: "Squid Game", thumb: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=225&fit=crop" },
  { id: 204, title: "Weak Hero Class 1", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop" },
  { id: 205, title: "Moving", thumb: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=225&fit=crop" },
  { id: 206, title: "Sweet Home", thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=225&fit=crop" },
];

const actionMovies = [
  { id: 301, title: "Extraction 2", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop" },
  // { id: 303, title: "RRR", thumb: "https://images.unsplash.com/photo-1626814026160-223b8cadc179?w=400&h=225&fit=crop" },
  { id: 304, title: "Top Gun: Maverick", thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=225&fit=crop" },
  // { id: 305, title: "Mission: Impossible", thumb: "https://images.unsplash.com/photo-1598979151858-4a36b04f146a?w=400&h=225&fit=crop" },
];

const trendingShorts = [
  ...koreanContent.slice(0, 3),
  ...actionMovies.slice(0, 3),
  { id: 401, title: "Viral Dance", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop" },
  { id: 402, title: "Funny Reels", thumb: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=225&fit=crop" },
];

// ────────────────────────────────────────────────
// Reusable components (unchanged)
// ────────────────────────────────────────────────

function useWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
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

function MovieCard({ item, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      className="flex-shrink-0 rounded-md overflow-hidden relative bg-zinc-900 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 hover:ring-2 hover:ring-white/30 w-[240px] h-[135px] md:w-[280px] md:h-[158px]"
    >
      <img
        src={item.thumb}
        alt={item.title}
        className="h-full w-full object-cover"
      />

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90">
                  <Play size={16} fill="black" />
                </button>
                <button className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center hover:border-white">
                  <Plus size={16} />
                </button>
                <button className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center hover:border-white">
                  <Info size={16} />
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center text-xs text-gray-300 mb-1">
                <span className="mr-2">New</span>
                <span className="mr-2">2024–25</span>
                <span className="border border-gray-500 px-1">U/A</span>
              </div>
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

  const handleItemClick = (item) => {
    navigate(`/video/${item.id}`, { state: { item } });
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

        {/* Different content per section – design same rakh rahe hain */}

        <div className="mb-8 pt-8">
          <SectionHeader title="Recommended Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {romanticShows.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[240px] md:w-[280px]">
                <div className="relative">
                  <MovieCard item={item} onClick={handleItemClick} />
                  <div className="mt-2">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[${Math.floor(Math.random()*60 + 40)}%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.floor(Math.random()*40 + 50)}% watched
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader title="Trending Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {koreanContent.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[240px] md:w-[280px]">
                <div className="relative">
                  <MovieCard item={item} onClick={handleItemClick} />
                  <div className="mt-2">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[${Math.floor(Math.random()*60 + 40)}%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.floor(Math.random()*40 + 50)}% watched
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <SectionHeader title="Trending Shorts" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingShorts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                  <img
                    src={item.thumb}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs">
                    #{item.id % 10 || 1}
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader title="Latest  Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {kidsFilms.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[240px] md:w-[280px]">
                <div className="relative">
                  <MovieCard item={item} onClick={handleItemClick} />
                  <div className="mt-2">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[${Math.floor(Math.random()*60 + 40)}%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Family friendly</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
{/* 
        <div className="mb-8">
          <SectionHeader title="Action & Adventure" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {actionMovies.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[240px] md:w-[280px]">
                <MovieCard item={item} onClick={handleItemClick} />
              </div>
            ))}
          </div>
        </div> */}

        <div className="mb-8">
          <SectionHeader title="Subscription Videos" />
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide hover:scrollbar-show">
            {[...romanticShows.slice(2), ...koreanContent.slice(1, 4), ...actionMovies.slice(0, 3)].map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[240px] md:w-[280px]">
                <MovieCard item={item} onClick={handleItemClick} />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <SectionHeader title="Top Shorts" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingShorts.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                  <img
                    src={item.thumb}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs">
                    #{item.id % 10 || 1}
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}