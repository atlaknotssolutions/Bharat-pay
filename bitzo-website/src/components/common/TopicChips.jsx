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

const API_URL = "http://localhost:8000/api/category";

export default function TopicChips() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("For you");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_URL);
        setTopics(res.data);

        // ✅ ensure "For you" is selected after API load
        const hasForYou = res.data.some((item) => item.name === "For you");

        if (!hasForYou && res.data.length > 0) {
          setSelectedTopic(res.data[0].name);
          setIsForYouSubmenuOpen(false);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);

    if (topic === "For you") {
      setIsForYouSubmenuOpen((prev) => !prev);
    } else {
      setIsForYouSubmenuOpen(false);
    }
  };

  return (
    <div className="sticky top-14 z-30 bg-[#0f0f0f] border-b border-gray-800">
      {/* Main topics */}
      <div className="flex items-center gap-3 px-6 py-3 overflow-x-auto scrollbar-hide">
        {topics.map((topic) => (
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
