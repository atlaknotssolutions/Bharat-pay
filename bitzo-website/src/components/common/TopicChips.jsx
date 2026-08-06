// import React, { useState } from 'react';

// const mainTopics = [
//   'For you',
//   'Trending',
//   'Earning Tips',
//   'Tech Reviews',
//   'Comedy',
//   'Music',
//   'Sports',
//   'Education',
//   'Gaming',
//   'News',
//   'Travel',
//   'Food',
//   'Lifestyle',
//   'Fashion',
//   'Health',
// ];

// const forYouOptions = ['History', 'Liked', 'Watch later', 'Your videos'];

// export default function TopicChips() {
//   const [selectedTopic, setSelectedTopic] = useState('For you');
//   const [isForYouSubmenuOpen, setIsForYouSubmenuOpen] = useState(false);

//   const handleTopicClick = (topic) => {
//     setSelectedTopic(topic);

//     if (topic === 'For you') {
//       // Toggle submenu when clicking "For you"
//       setIsForYouSubmenuOpen((prev) => !prev);
//     } else {
//       // Close submenu when selecting any other main topic
//       setIsForYouSubmenuOpen(false);
//     }
//   };

//   return (
//     <div className="sticky top-14 z-30 bg-[#0f0f0f] border-b border-gray-800">
//       {/* Main topics row */}
//       <div className="flex items-center gap-3 px-6 py-3 overflow-x-auto scrollbar-hide">
//         {mainTopics.map((topic) => (
//           <button
//             key={topic}
//             onClick={() => handleTopicClick(topic)}
//             className={`
//               px-6 py-1.5 font-medium rounded-lg whitespace-nowrap flex-shrink-0 transition-colors
//               ${
//                 selectedTopic === topic
//                   ? 'bg-white text-black hover:bg-gray-200'
//                   : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
//               }
//             `}
//           >
//             {topic}
//           </button>
//         ))}
//       </div>

//       {/* Submenu - only visible when open */}
//       {isForYouSubmenuOpen && (
//         <div className="flex items-center gap-3 px-6 py-2.5 bg-[#0f0f0f] border-t border-gray-800 overflow-x-auto scrollbar-hide">
//           {forYouOptions.map((option) => (
//             <button
//               key={option}
//               className="
//                 px-5 py-1 font-medium text-sm rounded-full
//                 bg-[#272727] text-white hover:bg-[#3f3f3f]
//                 whitespace-nowrap flex-shrink-0 transition-colors
//               "
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "../../features/videos/videosSlice";

const API_URL = "http://localhost:8000/api/category";

const ALL_CHIP = { _id: "all", name: "All" };

export default function TopicChips() {
  const dispatch = useDispatch();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_URL);
        setTopics(res.data);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);

    if (topic === "All") {
      dispatch(setSelectedCategory(null));
    } else {
      const selected = topics.find((t) => t.name === topic);
      dispatch(setSelectedCategory(selected?._id || null));
    }
  };

  const chips = [ALL_CHIP, ...topics.filter((t) => t.name !== "All")];

  return (
    <div className="sticky top-14 z-30 bg-[#0f0f0f] border-b border-gray-800">
      {/* Main topics */}
      <div className="flex items-center gap-3 px-6 py-3 overflow-x-auto scrollbar-hide">
        {chips.map((topic) => (
          <button
            key={topic._id}
            onClick={() => handleTopicClick(topic.name)}
            className={`
              px-6 py-1.5 font-medium rounded-lg whitespace-nowrap flex-shrink-0 transition-colors
              ${
                selectedTopic === topic.name
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
              }
            `}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
