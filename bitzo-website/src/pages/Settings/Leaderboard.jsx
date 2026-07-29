// import React from 'react';

// const leaderboardData = {
//   topCreators: [
//     { rank: 1, name: "TechWithAdi", username: "@adiTech07", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", followers: "1.2M", points: 9420 },
//     { rank: 2, name: "CodeWithRohit", username: "@rohitcodes", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", followers: "874K", points: 8150 },
//     { rank: 3, name: "UIQueen", username: "@uiqueen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", followers: "652K", points: 7630 },
//     { rank: 4, name: "DevVibes", username: "@devvibesonly", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", followers: "421K", points: 5980 },
//     { rank: 5, name: "PixelWizard", username: "@pixelwizard", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400", followers: "298K", points: 5120 },
//   ],
//   topViews: [
//     { rank: 1, title: "React 19 – Everything New", views: "2.4M", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800", creator: "@adiTech07" },
//     { rank: 2, title: "Tailwind in 100 Seconds", views: "1.8M", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800", creator: "@tailwindfan" },
//     { rank: 3, title: "Build Netflix Clone in 4 Hours", views: "1.5M", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", creator: "@codewithrohit" },
//     { rank: 4, title: "Framer Motion Magic", views: "987K", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800", creator: "@motionmaster" },
//     { rank: 5, title: "Next.js 15 Deep Dive", views: "842K", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800", creator: "@nextjsguru" },
//   ]
// };

// const Leaderboard = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
//             Community Leaderboard
//           </h1>
//           <p className="mt-3 text-gray-400 text-lg">
//             Top Creators & Most Viewed Content • February 2026
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">

//           {/* ===== TOP CREATORS ===== */}
//           <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 px-6 py-5 border-b border-gray-700/50">
//               <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-3">
//                 <span className="text-3xl">🏆</span> Top Creators
//               </h2>
//             </div>

//             <div className="divide-y divide-gray-800/60">
//               {leaderboardData.topCreators.map((creator) => (
//                 <div
//                   key={creator.rank}
//                   className="px-6 py-5 flex items-center gap-5 hover:bg-gray-800/40 transition-colors"
//                 >
//                   <div className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full ${
//                     creator.rank === 1 ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/50' :
//                     creator.rank === 2 ? 'bg-gray-400/20 text-gray-300 border-2 border-gray-400/50' :
//                     creator.rank === 3 ? 'bg-amber-700/20 text-amber-300 border-2 border-amber-600/50' :
//                     'bg-gray-700/40 text-gray-400'
//                   }`}>
//                     {creator.rank}
//                   </div>

//                   <img
//                     src={creator.avatar}
//                     alt={creator.name}
//                     className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
//                   />

//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-lg truncate">{creator.name}</p>
//                     <p className="text-gray-400 text-sm">{creator.username}</p>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-cyan-400 font-bold">{creator.followers}</p>
//                     <p className="text-xs text-gray-500">followers</p>
//                   </div>

//                   <div className="text-right min-w-[80px]">
//                     <p className="text-purple-400 font-bold">{creator.points.toLocaleString()}</p>
//                     <p className="text-xs text-gray-500">points</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ===== TOP VIEWS ===== */}
//           <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-pink-600/30 to-rose-600/30 px-6 py-5 border-b border-gray-700/50">
//               <h2 className="text-2xl font-bold text-pink-300 flex items-center gap-3">
//                 <span className="text-3xl">🔥</span> Top Viewed Content
//               </h2>
//             </div>

//             <div className="divide-y divide-gray-800/60">
//               {leaderboardData.topViews.map((item) => (
//                 <div
//                   key={item.rank}
//                   className="px-6 py-5 flex items-center gap-5 hover:bg-gray-800/40 transition-colors"
//                 >
//                   <div className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full ${
//                     item.rank === 1 ? 'bg-yellow-500/20 text-yellow-300 border-2 border-yellow-500/50' :
//                     item.rank === 2 ? 'bg-gray-400/20 text-gray-300 border-2 border-gray-400/50' :
//                     item.rank === 3 ? 'bg-amber-700/20 text-amber-300 border-2 border-amber-600/50' :
//                     'bg-gray-700/40 text-gray-400'
//                   }`}>
//                     {item.rank}
//                   </div>

//                   <img
//                     src={item.thumbnail}
//                     alt={item.title}
//                     className="w-20 h-12 object-cover rounded-md border border-gray-700"
//                   />

//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-base line-clamp-1">{item.title}</p>
//                     <p className="text-gray-400 text-sm">{item.creator}</p>
//                   </div>

//                   <div className="text-right">
//                     <p className="text-cyan-400 font-bold text-lg">{item.views}</p>
//                     <p className="text-xs text-gray-500">views</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>

//         {/* Footer note */}
//         <div className="text-center mt-12 text-gray-500 text-sm">
//           Want to be on the leaderboard? Keep creating awesome content! 🚀
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Leaderboard;

import React from 'react';

const leaderboardData = {
  topCreators: [
    { rank: 1, name: "TechWithAdi", username: "@adiTech07", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", followers: "1.2M", points: 9420 },
    { rank: 2, name: "CodeWithRohit", username: "@rohitcodes", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", followers: "874K", points: 8150 },
    { rank: 3, name: "UIQueen", username: "@uiqueen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", followers: "652K", points: 7630 },
    { rank: 4, name: "DevVibes", username: "@devvibesonly", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", followers: "421K", points: 5980 },
    { rank: 5, name: "PixelWizard", username: "@pixelwizard", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400", followers: "298K", points: 5120 },
  ],
  topViews: [
    { rank: 1, title: "React 19 – Everything New", views: "2.4M", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800", creator: "@adiTech07" },
    { rank: 2, title: "Tailwind in 100 Seconds", views: "1.8M", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800", creator: "@tailwindfan" },
    { rank: 3, title: "Build Netflix Clone in 4 Hours", views: "1.5M", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", creator: "@codewithrohit" },
    { rank: 4, title: "Framer Motion Magic", views: "987K", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800", creator: "@motionmaster" },
    { rank: 5, title: "Next.js 15 Deep Dive", views: "842K", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800", creator: "@nextjsguru" },
  ]
};

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-red-600">
            LEADERBOARD
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Top Creators & Most Viewed Content • February 2026
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">

          {/* TOP CREATORS */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-red-950/30">
            <div className="bg-red-950/60 px-6 py-5 border-b border-red-900/50">
              <h2 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                <span className="text-3xl">🏆</span> TOP CREATORS
              </h2>
            </div>

            <div className="divide-y divide-gray-800">
              {leaderboardData.topCreators.map((creator) => (
                <div
                  key={creator.rank}
                  className="px-6 py-5 flex items-center gap-5 hover:bg-gray-900 transition-colors"
                >
                  <div className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full min-w-[48px] ${
                    creator.rank === 1 ? 'bg-yellow-600 text-white border-2 border-yellow-500' :
                    creator.rank === 2 ? 'bg-gray-500 text-white border-2 border-gray-400' :
                    creator.rank === 3 ? 'bg-amber-700 text-white border-2 border-amber-600' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {creator.rank}
                  </div>

                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-white truncate">{creator.name}</p>
                    <p className="text-gray-400 text-sm">{creator.username}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-bold">{creator.followers}</p>
                    <p className="text-xs text-gray-500">followers</p>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-red-400 font-bold">{creator.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP VIEWS */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-red-950/30">
            <div className="bg-red-950/60 px-6 py-5 border-b border-red-900/50">
              <h2 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                <span className="text-3xl">🔥</span> TOP VIEWS
              </h2>
            </div>

            <div className="divide-y divide-gray-800">
              {leaderboardData.topViews.map((item) => (
                <div
                  key={item.rank}
                  className="px-6 py-5 flex items-center gap-5 hover:bg-gray-900 transition-colors"
                >
                  <div className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full min-w-[48px] ${
                    item.rank === 1 ? 'bg-yellow-600 text-white border-2 border-yellow-500' :
                    item.rank === 2 ? 'bg-gray-500 text-white border-2 border-gray-400' :
                    item.rank === 3 ? 'bg-amber-700 text-white border-2 border-amber-600' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {item.rank}
                  </div>

                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-12 object-cover rounded-md border border-gray-700"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-white line-clamp-1">{item.title}</p>
                    <p className="text-gray-400 text-sm">{item.creator}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{item.views}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          Keep creating fire content to reach the top! 🔥
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;