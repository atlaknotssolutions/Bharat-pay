// import { useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";

// export default function VideoUpload() {
//   const [view, setView] = useState("list"); // list | upload | player | update
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: "",
//     duration: "",
//   });

//   const [videoFile, setVideoFile] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/adminvideo`);
//       setVideos(res.data?.videos || []);
//     } catch (err) {
//       setError("Failed to load videos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UPLOAD / UPDATE HANDLER ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (view === "upload" && !videoFile) {
//       return setMessage("Select a video to upload");
//     }

//     const data = new FormData();
//     Object.entries(formData).forEach(([k, v]) => {
//       if (v) data.append(k, v);
//     });
//     if (videoFile) data.append("video", videoFile);

//     try {
//       setSubmitting(true);
//       let res;

//       if (view === "upload") {
//         res = await axios.post(`${BASE_URL}/adminvideo/upload`, data);
//         setMessage("Video uploaded successfully");
//       } else if (view === "update" && selectedVideo) {
//         res = await axios.put(`${BASE_URL}/adminvideo/update/${selectedVideo._id}`, data);
//         setMessage("Video updated successfully");
//       }

//       fetchVideos();
//       setView("list");
//       setVideoFile(null);
//       setFormData({ title: "", description: "", type: "", duration: "" });
//       setSelectedVideo(null);
//     } catch (err) {
//       console.error(err);
//       setMessage("Operation failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this video?")) return;
//     await axios.delete(`${BASE_URL}/adminvideo/${id}`);
//     fetchVideos();
//     setView("list");
//   };

//   /* ================= PLAYER ================= */
//   if (view === "player" && selectedVideo) {
//     const videoSrc = `${BASE_URL}/${selectedVideo.videoUrl}`;

//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <button
//           onClick={() => setView("list")}
//           className="mb-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
//         >
//           ← Back
//         </button>

//         <video
//           src={videoSrc}
//           controls
//           autoPlay
//           muted
//           playsInline
//           preload="metadata"
//           className="w-full aspect-video rounded-lg shadow-lg"
//           onError={() => alert("Video load failed")}
//         />

//         <h2 className="mt-4 text-2xl font-bold">{selectedVideo.title}</h2>
//         <p className="text-gray-400">{selectedVideo.description}</p>

//         <div className="mt-6 flex gap-3">
//           <button
//             onClick={() => {
//               setFormData({
//                 title: selectedVideo.title,
//                 description: selectedVideo.description,
//                 type: selectedVideo.type,
//                 duration: selectedVideo.duration || "",
//               });
//               setView("update");
//             }}
//             className="bg-blue-600 px-5 py-2 rounded hover:bg-blue-500 transition"
//           >
//             Edit
//           </button>

//           <button
//             onClick={() => handleDelete(selectedVideo._id)}
//             className="bg-red-600 px-5 py-2 rounded hover:bg-red-500 transition"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ================= UPLOAD / UPDATE FORM ================= */
//   if (view === "upload" || view === "update") {
//     const isUpdate = view === "update";

//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-lg w-96 space-y-4 shadow-md"
//         >
//           <h2 className="text-xl font-bold text-gray-800">
//             {isUpdate ? "Update Video" : "Upload Video"}
//           </h2>

//           <input
//             placeholder="Title"
//             required
//             className="w-full border p-2 rounded"
//             value={formData.title}
//             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           />
//           <textarea
//             placeholder="Description"
//             className="w-full border p-2 rounded"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           />

//           <select
//             required
//             className="w-full border p-2 rounded"
//             value={formData.type}
//             onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//           >
//             <option value="">Select Type</option>
//             <option value="reel">Reel</option>
//             <option value="post">Post</option>
//           </select>

//           <input
//             type="number"
//             placeholder="Duration (seconds)"
//             className="w-full border p-2 rounded"
//             value={formData.duration}
//             onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
//           />

//           <input
//             type="file"
//             accept="video/mp4"
//             onChange={(e) => setVideoFile(e.target.files[0])}
//             className="w-full"
//           />

//           {message && <p className="text-green-600 font-semibold">{message}</p>}

//           <button
//             className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
//             disabled={submitting}
//           >
//             {submitting ? (isUpdate ? "Updating..." : "Uploading...") : isUpdate ? "Update" : "Upload"}
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setView("list");
//               setSelectedVideo(null);
//               setVideoFile(null);
//               setFormData({ title: "", description: "", type: "", duration: "" });
//               setMessage("");
//             }}
//             className="w-full text-center text-gray-600 hover:text-gray-800 transition"
//           >
//             Back
//           </button>
//         </form>
//       </div>
//     );
//   }

//   /* ================= LIST ================= */
//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Videos</h1>
//         <button
//           onClick={() => setView("upload")}
//           className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
//         >
//           + Upload
//         </button>
//       </div>

//       {loading ? (
//         "Loading..."
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {videos.map((video) => (
//             <div
//               key={video._id}
//               onClick={() => {
//                 setSelectedVideo(video);
//                 setView("player");
//               }}
//               className="cursor-pointer bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
//             >
//               <video
//                 src={`${BASE_URL}/${video.videoUrl}`}
//                 muted
//                 className="w-full aspect-video object-cover"
//               />
//               <div className="p-3">
//                 <h3 className="font-bold text-gray-800">{video.title}</h3>
//                 <p className="text-gray-500 text-sm">{video.type}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";

// export default function VideoUpload() {
//   const [view, setView] = useState("list"); // list | upload | player | update
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: "",
//     duration: "",
//   });
//   const [videoFile, setVideoFile] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await axios.get(`${BASE_URL}/adminvideo`);
//       setVideos(res.data?.videos || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load videos. Check server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SUBMIT (UPLOAD / UPDATE) ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (view === "upload" && !videoFile) {
//       return setMessage("Please select a video file");
//     }

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) data.append(key, value);
//     });
//     if (videoFile) data.append("video", videoFile);

//     try {
//       setSubmitting(true);
//       let res;
//       if (view === "upload") {
//         res = await axios.post(`${BASE_URL}/adminvideo/upload`, data);
//         setMessage("Video uploaded successfully!");
//       } else if (view === "update" && selectedVideo) {
//         res = await axios.put(
//           `${BASE_URL}/adminvideo/update/${selectedVideo._id}`,
//           data
//         );
//         setMessage("Video updated successfully!");
//       }

//       fetchVideos();
//       resetForm();
//       setView("list");
//     } catch (err) {
//       console.error(err);
//       setMessage(
//         err.response?.data?.message || "Operation failed. Try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ title: "", description: "", type: "", duration: "" });
//     setVideoFile(null);
//     setSelectedVideo(null);
//     setMessage("");
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/adminvideo/${id}`);
//       fetchVideos();
//       setView("list");
//     } catch (err) {
//       setMessage("Delete failed");
//     }
//   };

//   /* ================= PLAYER VIEW ================= */
//   if (view === "player" && selectedVideo) {
//     const videoSrc = selectedVideo.videoUrl.startsWith("http")
//       ? selectedVideo.videoUrl
//       : `${BASE_URL}/${selectedVideo.videoUrl}`;

//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
//         <button
//           onClick={() => setView("list")}
//           className="self-start mb-6 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded transition"
//         >
//           ← Back to list
//         </button>

//         <div className="flex-1 flex flex-col items-center">
//           <video
//             src={`http://localhost:8000/${videoSrc}`}
//             controls
//             autoPlay
//             playsInline
//             className="w-full max-w-5xl rounded-xl shadow-2xl"
//             onError={() => alert("Cannot load video – check URL or file")}
//           />

//           <div className="mt-6 w-full max-w-4xl">
//             <h2 className="text-3xl font-bold">{selectedVideo.title}</h2>
//             <p className="text-gray-400 mt-2">{selectedVideo.description || "No description"}</p>

//             <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-500">Category:</span>
//                 <p className="font-medium">{selectedVideo.category?.name || "—"}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">SubCategory:</span>
//                 <p className="font-medium">{selectedVideo.subCategory?.name || "—"}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Type:</span>
//                 <p className="font-medium">{selectedVideo.type || "—"}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Duration:</span>
//                 <p className="font-medium">{selectedVideo.duration || "—"} sec</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Views:</span>
//                 <p className="font-medium">{selectedVideo.views || 0}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Likes:</span>
//                 <p className="font-medium">{selectedVideo.likesCount || 0}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Dislikes:</span>
//                 <p className="font-medium">{selectedVideo.dislikesCount || 0}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Uploaded:</span>
//                 <p className="font-medium">
//                   {new Date(selectedVideo.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-8 flex gap-4">
//               <button
//                 onClick={() => {
//                   setFormData({
//                     title: selectedVideo.title,
//                     description: selectedVideo.description || "",
//                     type: selectedVideo.type || "",
//                     duration: selectedVideo.duration || "",
//                   });
//                   setView("update");
//                 }}
//                 className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition"
//               >
//                 Edit Video
//               </button>
//               <button
//                 onClick={() => handleDelete(selectedVideo._id)}
//                 className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded transition"
//               >
//                 Delete Video
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ================= UPLOAD / UPDATE FORM ================= */
//   if (view === "upload" || view === "update") {
//     const isUpdate = view === "update";
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-5"
//         >
//           <h2 className="text-2xl font-bold text-center">
//             {isUpdate ? "Update Video" : "Upload New Video"}
//           </h2>

//           <input
//             placeholder="Video Title *"
//             required
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
//             value={formData.title}
//             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           />

//           <textarea
//             placeholder="Description"
//             rows={3}
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           />

//           <select
//             required
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
//             value={formData.type}
//             onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//           >
//             <option value="">Select Type *</option>
//             <option value="short">Short</option>
//             <option value="long">Long</option>
//             {/* Adjust options as per your backend */}
//           </select>

//           <input
//             type="number"
//             placeholder="Duration (seconds)"
//             className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
//             value={formData.duration}
//             onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
//           />

//           <div>
//             <label className="block text-sm text-gray-600 mb-1">
//               {isUpdate ? "New Video File (optional)" : "Video File *"}
//             </label>
//             <input
//               type="file"
//               accept="video/*"
//               onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
//               className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
//             />
//           </div>

//           {message && (
//             <p className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
//               {message}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={submitting}
//             className={`w-full py-3 rounded font-semibold transition ${
//               submitting
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-black text-white hover:bg-gray-800"
//             }`}
//           >
//             {submitting ? (isUpdate ? "Updating..." : "Uploading...") : isUpdate ? "Update Video" : "Upload Video"}
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setView("list");
//               resetForm();
//             }}
//             className="w-full text-center text-gray-600 hover:text-black transition"
//           >
//             Cancel
//           </button>
//         </form>
//       </div>
//     );
//   }

//   /* ================= MAIN LIST VIEW ================= */
//   return (
//     <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">All Videos</h1>
//         <button
//           onClick={() => setView("upload")}
//           className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow"
//         >
//           + Upload Video
//         </button>
//       </div>

//       {error && <p className="text-red-600 text-center mb-6">{error}</p>}

//       {loading ? (
//         <p className="text-center text-gray-600 text-xl">Loading videos...</p>
//       ) : videos.length === 0 ? (
//         <p className="text-center text-gray-500 text-xl">No videos found</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {videos.map((video) => (
//             <div
//               key={video._id}
//               onClick={() => {
//                 setSelectedVideo(video);
//                 setView("player");
//               }}
//               className="bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden cursor-pointer"
//             >
//               <div className="relative">
//                 <video
//                   src={
//                     video.videoUrl.startsWith("http")
//                       ? video.videoUrl
//                       : `${BASE_URL}/${video.videoUrl}`
//                   }
//                   muted
//                   loop
//                   playsInline
//                   className="w-full aspect-video object-cover"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition">
//                   <span className="text-white text-4xl">▶</span>
//                 </div>
//               </div>

//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
//                   {video.title}
//                 </h3>

//                 <div className="mt-2 text-sm text-gray-600 space-y-1">
//                   <p>
//                     <span className="font-medium">Category:</span>{" "}
//                     {video.category?.name || "—"}
//                   </p>
//                   <p>
//                     <span className="font-medium">SubCategory:</span>{" "}
//                     {video.subCategory?.name || "—"}
//                   </p>
//                   <p>
//                     <span className="font-medium">Views:</span> {video.views || 0}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-2">
//                     {new Date(video.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Plus, ArrowLeft, Edit, Trash2, Play } from "lucide-react";

const BASE_URL = "http://localhost:8000/api";

export default function VideoManagement() {
  const [view, setView] = useState("list"); // list | upload | player | update
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/adminvideo`);
      setVideos(res.data?.videos || []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (view === "upload" && !videoFile) {
      setMessage("Please select a video file");
      return;
    }

    if (!formData.title.trim()) {
      setMessage("Title is required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    if (formData.description)
      data.append("description", formData.description.trim());
    if (formData.type) data.append("type", formData.type);
    if (formData.duration) data.append("duration", formData.duration);
    if (videoFile) data.append("video", videoFile);

    try {
      setSubmitting(true);
      setMessage("");

      let res;
      if (view === "upload") {
        res = await axios.post(`${BASE_URL}/adminvideo/upload`, data);
        setMessage("Video uploaded successfully!");
      } else if (view === "update" && selectedVideo) {
        res = await axios.put(
          `${BASE_URL}/adminvideo/update/${selectedVideo._id}`,
          data,
        );
        setMessage("Video updated successfully!");
      }

      fetchVideos();
      resetForm();
      setView("list");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Operation failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", type: "", duration: "" });
    setVideoFile(null);
    setSelectedVideo(null);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${BASE_URL}/adminvideo/${id}`);
      fetchVideos();
      if (view === "player") setView("list");
    } catch (err) {
      setMessage("Failed to delete video");
    }
  };

  // ================= VIDEO PLAYER VIEW =================
  if (view === "player" && selectedVideo) {
    const videoSrc = selectedVideo.videoUrl?.startsWith("http")
      ? selectedVideo.videoUrl
      : `${BASE_URL.replace("/api", "")}/${selectedVideo.videoUrl}`;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
        <button
          onClick={() => setView("list")}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          Back to list
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              src={videoSrc}
              controls
              autoPlay
              playsInline
              className="w-full aspect-video"
              onError={() =>
                setMessage("Cannot load video – check file or server")
              }
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {selectedVideo.title}
            </h2>
            <p className="text-gray-400 mt-2">
              {selectedVideo.description || "No description provided"}
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <div className="text-gray-500">Category</div>
                <div className="font-medium">
                  {selectedVideo.category?.name || "—"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Type</div>
                <div className="font-medium">{selectedVideo.type || "—"}</div>
              </div>
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="font-medium">
                  {selectedVideo.duration
                    ? `${selectedVideo.duration} sec`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Views</div>
                <div className="font-medium">{selectedVideo.views || 0}</div>
              </div>
              <div>
                <div className="text-gray-500">Uploaded</div>
                <div className="font-medium">
                  {new Date(selectedVideo.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setFormData({
                    title: selectedVideo.title,
                    description: selectedVideo.description || "",
                    type: selectedVideo.type || "",
                    duration: selectedVideo.duration || "",
                  });
                  setView("update");
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg transition"
              >
                <Edit size={18} />
                Edit Video
              </button>

              <button
                onClick={() => handleDelete(selectedVideo._id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
              >
                <Trash2 size={18} />
                Delete Video
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= FORM (UPLOAD / UPDATE) =================
  if (view === "upload" || view === "update") {
    const isUpdate = view === "update";

    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isUpdate ? "Update Video" : "Upload New Video"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                required
                placeholder="Enter video title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter description (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="">Select type</option>
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds)
              </label>
              <input
                type="number"
                placeholder="e.g. 120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isUpdate ? "Replace Video (optional)" : "Video File *"}
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-5 file:rounded file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {message && (
              <p
                className={`text-center font-medium ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {submitting
                  ? isUpdate
                    ? "Updating..."
                    : "Uploading..."
                  : isUpdate
                    ? "Update Video"
                    : "Upload Video"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("list");
                }}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= LIST VIEW =================
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
          <button
            onClick={() => setView("upload")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            <Plus size={20} />
            Upload Video
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No videos found</p>
            <p className="mt-2">Start by uploading a new video</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                onClick={() => {
                  setSelectedVideo(video);
                  setView("player");
                }}
                className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="relative">
                  <video
                    src={
                      video.videoUrl?.startsWith("http")
                        ? video.videoUrl
                        : `${BASE_URL.replace("/api", "")}/${video.videoUrl}`
                    }
                    muted
                    loop
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={48} className="text-white" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                    {video.title}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {video.category?.name || "—"}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {video.type || "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
