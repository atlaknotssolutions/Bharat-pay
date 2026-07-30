

// // "use client";

// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Loader2, Plus, ArrowLeft, Edit, Trash2, Play } from "lucide-react";

// // const BASE_URL = "http://localhost:8000/api";

// // export default function VideoManagement() {
// //   const [view, setView] = useState("list"); // list | upload | player | update
// //   const [selectedVideo, setSelectedVideo] = useState(null);
// //   const [videos, setVideos] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     type: "",
// //     duration: "",
// //   });
// //   const [videoFile, setVideoFile] = useState(null);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     fetchVideos();
// //   }, []);

// //   const fetchVideos = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const res = await axios.get(`${BASE_URL}/adminvideo`);
// //       setVideos(res.data?.videos || []);
// //     } catch (err) {
// //       console.error("Failed to fetch videos:", err);
// //       setError("Failed to load videos. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (view === "upload" && !videoFile) {
// //       setMessage("Please select a video file");
// //       return;
// //     }

// //     if (!formData.title.trim()) {
// //       setMessage("Title is required");
// //       return;
// //     }

// //     const data = new FormData();
// //     data.append("title", formData.title.trim());
// //     if (formData.description)
// //       data.append("description", formData.description.trim());
// //     if (formData.type) data.append("type", formData.type);
// //     if (formData.duration) data.append("duration", formData.duration);
// //     if (videoFile) data.append("video", videoFile);

// //     try {
// //       setSubmitting(true);
// //       setMessage("");

// //       let res;
// //       if (view === "upload") {
// //         res = await axios.post(`${BASE_URL}/adminvideo/upload`, data);
// //         setMessage("Video uploaded successfully!");
// //       } else if (view === "update" && selectedVideo) {
// //         res = await axios.put(
// //           `${BASE_URL}/adminvideo/update/${selectedVideo._id}`,
// //           data,
// //         );
// //         setMessage("Video updated successfully!");
// //       }

// //       fetchVideos();
// //       resetForm();
// //       setView("list");
// //     } catch (err) {
// //       console.error(err);
// //       setMessage(
// //         err.response?.data?.message || "Operation failed. Please try again.",
// //       );
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({ title: "", description: "", type: "", duration: "" });
// //     setVideoFile(null);
// //     setSelectedVideo(null);
// //     setMessage("");
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this video?")) return;

// //     try {
// //       await axios.delete(`${BASE_URL}/adminvideo/${id}`);
// //       fetchVideos();
// //       if (view === "player") setView("list");
// //     } catch (err) {
// //       setMessage("Failed to delete video");
// //     }
// //   };

// //   // ================= VIDEO PLAYER VIEW =================
// //   if (view === "player" && selectedVideo) {
// //     const videoSrc = selectedVideo.videoUrl?.startsWith("http")
// //       ? selectedVideo.videoUrl
// //       : `${BASE_URL.replace("/api", "")}/${selectedVideo.videoUrl}`;

// //     return (
// //       <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
// //         <button
// //           onClick={() => setView("list")}
// //           className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
// //         >
// //           <ArrowLeft size={20} />
// //           Back to list
// //         </button>

// //         <div className="max-w-6xl mx-auto">
// //           <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
// //             <video
// //               src={videoSrc}
// //               controls
// //               autoPlay
// //               playsInline
// //               className="w-full aspect-video"
// //               onError={() =>
// //                 setMessage("Cannot load video – check file or server")
// //               }
// //             />
// //           </div>

// //           <div className="mt-6">
// //             <h2 className="text-2xl md:text-3xl font-bold">
// //               {selectedVideo.title}
// //             </h2>
// //             <p className="text-gray-400 mt-2">
// //               {selectedVideo.description || "No description provided"}
// //             </p>

// //             <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
// //               <div>
// //                 <div className="text-gray-500">Category</div>
// //                 <div className="font-medium">
// //                   {selectedVideo.category?.name || "—"}
// //                 </div>
// //               </div>
// //               <div>
// //                 <div className="text-gray-500">Type</div>
// //                 <div className="font-medium">{selectedVideo.type || "—"}</div>
// //               </div>
// //               <div>
// //                 <div className="text-gray-500">Duration</div>
// //                 <div className="font-medium">
// //                   {selectedVideo.duration
// //                     ? `${selectedVideo.duration} sec`
// //                     : "—"}
// //                 </div>
// //               </div>
// //               <div>
// //                 <div className="text-gray-500">Views</div>
// //                 <div className="font-medium">{selectedVideo.views || 0}</div>
// //               </div>
// //               <div>
// //                 <div className="text-gray-500">Uploaded</div>
// //                 <div className="font-medium">
// //                   {new Date(selectedVideo.createdAt).toLocaleDateString()}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="mt-8 flex flex-wrap gap-4">
// //               <button
// //                 onClick={() => {
// //                   setFormData({
// //                     title: selectedVideo.title,
// //                     description: selectedVideo.description || "",
// //                     type: selectedVideo.type || "",
// //                     duration: selectedVideo.duration || "",
// //                   });
// //                   setView("update");
// //                 }}
// //                 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg transition"
// //               >
// //                 <Edit size={18} />
// //                 Edit Video
// //               </button>

// //               <button
// //                 onClick={() => handleDelete(selectedVideo._id)}
// //                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
// //               >
// //                 <Trash2 size={18} />
// //                 Delete Video
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ================= FORM (UPLOAD / UPDATE) =================
// //   if (view === "upload" || view === "update") {
// //     const isUpdate = view === "update";

// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
// //         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
// //           <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
// //             {isUpdate ? "Update Video" : "Upload New Video"}
// //           </h2>

// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Title *
// //               </label>
// //               <input
// //                 required
// //                 placeholder="Enter video title"
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 value={formData.title}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, title: e.target.value })
// //                 }
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Description
// //               </label>
// //               <textarea
// //                 rows={3}
// //                 placeholder="Enter description (optional)"
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 value={formData.description}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, description: e.target.value })
// //                 }
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Type *
// //               </label>
// //               <select
// //                 required
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 value={formData.type}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, type: e.target.value })
// //                 }
// //               >
// //                 <option value="">Select type</option>
// //                 <option value="short">Short</option>
// //                 <option value="long">Long</option>
// //               </select>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Duration (seconds)
// //               </label>
// //               <input
// //                 type="number"
// //                 placeholder="e.g. 120"
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                 value={formData.duration}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, duration: e.target.value })
// //                 }
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 {isUpdate ? "Replace Video (optional)" : "Video File *"}
// //               </label>
// //               <input
// //                 type="file"
// //                 accept="video/*"
// //                 onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-5 file:rounded file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
// //               />
// //             </div>

// //             {message && (
// //               <p
// //                 className={`text-center font-medium ${
// //                   message.includes("success")
// //                     ? "text-green-600"
// //                     : "text-red-600"
// //                 }`}
// //               >
// //                 {message}
// //               </p>
// //             )}

// //             <div className="flex gap-4 pt-4">
// //               <button
// //                 type="submit"
// //                 disabled={submitting}
// //                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
// //                   submitting
// //                     ? "bg-gray-400 cursor-not-allowed"
// //                     : "bg-indigo-600 hover:bg-indigo-700 text-white"
// //                 }`}
// //               >
// //                 {submitting
// //                   ? isUpdate
// //                     ? "Updating..."
// //                     : "Uploading..."
// //                   : isUpdate
// //                     ? "Update Video"
// //                     : "Upload Video"}
// //               </button>

// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   resetForm();
// //                   setView("list");
// //                 }}
// //                 className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ================= LIST VIEW =================
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 md:p-10">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
// //           <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
// //           <button
// //             onClick={() => setView("upload")}
// //             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
// //           >
// //             <Plus size={20} />
// //             Upload Video
// //           </button>
// //         </div>

// //         {error && (
// //           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
// //             {error}
// //           </div>
// //         )}

// //         {loading ? (
// //           <div className="flex flex-col items-center justify-center py-20">
// //             <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
// //             <p className="text-gray-600">Loading videos...</p>
// //           </div>
// //         ) : videos.length === 0 ? (
// //           <div className="text-center py-20 text-gray-500">
// //             <p className="text-xl">No videos found</p>
// //             <p className="mt-2">Start by uploading a new video</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //             {videos.map((video) => (
// //               <div
// //                 key={video._id}
// //                 onClick={() => {
// //                   setSelectedVideo(video);
// //                   setView("player");
// //                 }}
// //                 className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
// //               >
// //                 <div className="relative">
// //                   <video
// //                     src={
// //                       video.videoUrl?.startsWith("http")
// //                         ? video.videoUrl
// //                         : `${BASE_URL.replace("/api", "")}/${video.videoUrl}`
// //                     }
// //                     muted
// //                     loop
// //                     playsInline
// //                     className="w-full aspect-video object-cover"
// //                   />
// //                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
// //                     <Play size={48} className="text-white" />
// //                   </div>
// //                 </div>

// //                 <div className="p-4">
// //                   <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
// //                     {video.title}
// //                   </h3>

// //                   <div className="text-sm text-gray-600 space-y-1">
// //                     <p>
// //                       <span className="font-medium">Category:</span>{" "}
// //                       {video.category?.name || "—"}
// //                     </p>
// //                     <p>
// //                       <span className="font-medium">Type:</span>{" "}
// //                       {video.type || "—"}
// //                     </p>
// //                     <p className="text-xs text-gray-500 mt-2">
// //                       {new Date(video.createdAt).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Loader2,
//   Plus,
//   ArrowLeft,
//   Edit,
//   Trash2,
//   Play,
//   Mail,
//   User,
//   Tv,
// } from "lucide-react";

// const BASE_URL = "http://localhost:8000/api";

// export default function VideoManagement() {
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
//       console.error("Failed to fetch videos:", err);
//       setError("Failed to load videos. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (view === "upload" && !videoFile) {
//       setMessage("Please select a video file");
//       return;
//     }

//     if (!formData.title.trim()) {
//       setMessage("Title is required");
//       return;
//     }

//     const data = new FormData();
//     data.append("title", formData.title.trim());
//     if (formData.description)
//       data.append("description", formData.description.trim());
//     if (formData.type) data.append("type", formData.type);
//     if (formData.duration) data.append("duration", formData.duration);
//     if (videoFile) data.append("video", videoFile);

//     try {
//       setSubmitting(true);
//       setMessage("");

//       if (view === "upload") {
//         await axios.post(`${BASE_URL}/adminvideo/upload`, data);
//         setMessage("Video uploaded successfully!");
//       } else if (view === "update" && selectedVideo) {
//         await axios.put(
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
//         err.response?.data?.message || "Operation failed. Please try again."
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

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;

//     try {
//       await axios.delete(`${BASE_URL}/adminvideo/${id}`);
//       fetchVideos();
//       if (view === "player") setView("list");
//     } catch (err) {
//       setMessage("Failed to delete video");
//     }
//   };

//   // ================= VIDEO PLAYER VIEW =================
//   if (view === "player" && selectedVideo) {
//     const videoSrc = selectedVideo.videoUrl?.startsWith("http")
//       ? selectedVideo.videoUrl
//       : `${BASE_URL.replace("/api", "")}/${selectedVideo.videoUrl}`;

//     const uploader = selectedVideo.uploadedBy;
//     const channel = selectedVideo.channel;

//     return (
//       <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
//         <button
//           onClick={() => setView("list")}
//           className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
//         >
//           <ArrowLeft size={20} />
//           Back to list
//         </button>

//         <div className="max-w-6xl mx-auto">
//           <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
//             <video
//               src={videoSrc}
//               controls
//               autoPlay
//               playsInline
//               className="w-full aspect-video"
//               onError={() =>
//                 setMessage("Cannot load video – check file or server")
//               }
//             />
//           </div>

//           <div className="mt-6">
//             <h2 className="text-2xl md:text-3xl font-bold">
//               {selectedVideo.title}
//             </h2>
//             <p className="text-gray-400 mt-2">
//               {selectedVideo.description || "No description provided"}
//             </p>

//             {/* ========== UPLOADER + CHANNEL INFO ========== */}
//             <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-800">
//               <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
//                 Uploaded By
//               </h3>

//               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">
//                     {uploader?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-white flex items-center gap-2">
//                       <User size={16} className="text-indigo-400" />
//                       {uploader?.name || "Unknown User"}
//                     </p>
//                     <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
//                       <Mail size={14} />
//                       {uploader?.email || "No email"}
//                     </p>
//                   </div>
//                 </div>

//                 {channel && (
//                   <div className="sm:ml-auto flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
//                     <Tv size={16} className="text-amber-400" />
//                     <div>
//                       <p className="text-xs text-gray-400">Channel</p>
//                       <p className="font-medium text-white">
//                         {channel.name || channel.handle || "—"}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Other meta */}
//             <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
//               <div>
//                 <div className="text-gray-500">Category</div>
//                 <div className="font-medium">
//                   {selectedVideo.category?.name || "—"}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-500">Type</div>
//                 <div className="font-medium">{selectedVideo.type || "—"}</div>
//               </div>
//               <div>
//                 <div className="text-gray-500">Duration</div>
//                 <div className="font-medium">
//                   {selectedVideo.duration
//                     ? `${selectedVideo.duration} sec`
//                     : "—"}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-500">Views</div>
//                 <div className="font-medium">{selectedVideo.views || 0}</div>
//               </div>
//               <div>
//                 <div className="text-gray-500">Uploaded</div>
//                 <div className="font-medium">
//                   {new Date(selectedVideo.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex flex-wrap gap-4">
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
//                 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg transition"
//               >
//                 <Edit size={18} />
//                 Edit Video
//               </button>

//               <button
//                 onClick={() => handleDelete(selectedVideo._id)}
//                 className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
//               >
//                 <Trash2 size={18} />
//                 Delete Video
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ================= FORM (UPLOAD / UPDATE) =================
//   if (view === "upload" || view === "update") {
//     const isUpdate = view === "update";

//     return (
//       <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
//         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//             {isUpdate ? "Update Video" : "Upload New Video"}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title *
//               </label>
//               <input
//                 required
//                 placeholder="Enter video title"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 rows={3}
//                 placeholder="Enter description (optional)"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Type *
//               </label>
//               <select
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.type}
//                 onChange={(e) =>
//                   setFormData({ ...formData, type: e.target.value })
//                 }
//               >
//                 <option value="">Select type</option>
//                 <option value="short">Short</option>
//                 <option value="long">Long</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Duration (seconds)
//               </label>
//               <input
//                 type="number"
//                 placeholder="e.g. 120"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={formData.duration}
//                 onChange={(e) =>
//                   setFormData({ ...formData, duration: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {isUpdate ? "Replace Video (optional)" : "Video File *"}
//               </label>
//               <input
//                 type="file"
//                 accept="video/*"
//                 onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-5 file:rounded file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               />
//             </div>

//             {message && (
//               <p
//                 className={`text-center font-medium ${
//                   message.includes("success")
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 {message}
//               </p>
//             )}

//             <div className="flex gap-4 pt-4">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`flex-1 py-3 rounded-lg font-semibold transition ${
//                   submitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700 text-white"
//                 }`}
//               >
//                 {submitting
//                   ? isUpdate
//                     ? "Updating..."
//                     : "Uploading..."
//                   : isUpdate
//                     ? "Update Video"
//                     : "Upload Video"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => {
//                   resetForm();
//                   setView("list");
//                 }}
//                 className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   // ================= LIST VIEW =================
//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
//           <button
//             onClick={() => setView("upload")}
//             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
//           >
//             <Plus size={20} />
//             Upload Video
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
//             {error}
//           </div>
//         )}

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
//             <p className="text-gray-600">Loading videos...</p>
//           </div>
//         ) : videos.length === 0 ? (
//           <div className="text-center py-20 text-gray-500">
//             <p className="text-xl">No videos found</p>
//             <p className="mt-2">Start by uploading a new video</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {videos.map((video) => {
//               const uploader = video.uploadedBy;
//               const channel = video.channel;

//               return (
//                 <div
//                   key={video._id}
//                   onClick={() => {
//                     setSelectedVideo(video);
//                     setView("player");
//                   }}
//                   className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
//                 >
//                   <div className="relative">
//                     <video
//                       src={
//                         video.videoUrl?.startsWith("http")
//                           ? video.videoUrl
//                           : `${BASE_URL.replace("/api", "")}/${video.videoUrl}`
//                       }
//                       muted
//                       loop
//                       playsInline
//                       className="w-full aspect-video object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                       <Play size={48} className="text-white" />
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
//                       {video.title}
//                     </h3>

//                     {/* Uploader + Email */}
//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
//                         {uploader?.name?.charAt(0)?.toUpperCase() || "U"}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-medium text-gray-800 truncate">
//                           {uploader?.name || "Unknown"}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {uploader?.email || "—"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Channel */}
//                     {channel && (
//                       <p className="text-xs text-amber-600 font-medium mb-1 flex items-center gap-1">
//                         <Tv size={12} />
//                         {channel.name || channel.handle}
//                       </p>
//                     )}

//                     <div className="text-sm text-gray-600 space-y-0.5 mt-2">
//                       <p>
//                         <span className="font-medium">Category:</span>{" "}
//                         {video.category?.name || "—"}
//                       </p>
//                       <p>
//                         <span className="font-medium">Type:</span>{" "}
//                         {video.type || "—"}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(video.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Loader2,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Play,
  Mail,
  User,
  Tv,
  Search,
} from "lucide-react";

const BASE_URL = "http://localhost:8000/api";

export default function VideoManagement() {
  const [view, setView] = useState("list"); // list | upload | player | update
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (view === "upload" && !videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
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

      if (view === "upload") {
        await axios.post(`${BASE_URL}/adminvideo/upload`, data);
        toast.success("Video uploaded successfully!");
      } else if (view === "update" && selectedVideo) {
        await axios.put(
          `${BASE_URL}/adminvideo/update/${selectedVideo._id}`,
          data
        );
        toast.success("Video updated successfully!");
      }

      await fetchVideos();
      resetForm();
      setView("list");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Operation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", type: "", duration: "" });
    setVideoFile(null);
    setSelectedVideo(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${BASE_URL}/adminvideo/${id}`);
      toast.success("Video deleted successfully");
      fetchVideos();
      if (view === "player") setView("list");
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  // ================= FILTERED DATA =================
  const filteredVideos = videos.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.title?.toLowerCase().includes(q) ||
      v.uploadedBy?.name?.toLowerCase().includes(q) ||
      v.uploadedBy?.email?.toLowerCase().includes(q) ||
      v.channel?.name?.toLowerCase().includes(q) ||
      v.type?.toLowerCase().includes(q)
    );
  });

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      name: "Thumbnail",
      width: "140px",
      cell: (row) => {
        const thumbSrc = row.thumbnail
          ? row.thumbnail.startsWith("http")
            ? row.thumbnail
            : `${BASE_URL.replace("/api", "")}/${row.thumbnail}`
          : null;

        const videoSrc = row.videoUrl?.startsWith("http")
          ? row.videoUrl
          : `${BASE_URL.replace("/api", "")}/${row.videoUrl}`;

        return (
          <div
            className="relative w-28 h-16 rounded-lg overflow-hidden cursor-pointer group bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(row);
              setView("player");
            }}
          >
            {thumbSrc ? (
              <img
                src={thumbSrc}
                alt={row.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={videoSrc}
                muted
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Play size={22} className="text-white" />
            </div>
          </div>
        );
      },
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="py-2">
          <p className="font-medium text-gray-900 line-clamp-1">{row.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {row.category?.name || "—"} • {row.type || "—"}
          </p>
        </div>
      ),
    },
    {
      name: "Uploaded By",
      grow: 1.5,
      cell: (row) => {
        const uploader = row.uploadedBy;
        return (
          <div className="flex items-center gap-2 py-1">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {uploader?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {uploader?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <Mail size={11} />
                {uploader?.email || "—"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      name: "Channel",
      cell: (row) =>
        row.channel ? (
          <span className="inline-flex items-center gap-1 text-sm text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            <Tv size={13} />
            {row.channel.name || row.channel.handle}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
    },
    {
      name: "Views",
      selector: (row) => row.views || 0,
      sortable: true,
      width: "90px",
      cell: (row) => (
        <span className="font-medium text-gray-700">{row.views || 0}</span>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.createdAt,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      name: "Actions",
      width: "130px",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(row);
              setView("player");
            }}
            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
            title="Play"
          >
            <Play size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(row);
              setFormData({
                title: row.title,
                description: row.description || "",
                type: row.type || "",
                duration: row.duration || "",
              });
              setView("update");
            }}
            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        fontWeight: "600",
        fontSize: "13px",
        color: "#475569",
        minHeight: "48px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:hover": {
          backgroundColor: "#f8fafc",
          cursor: "pointer",
        },
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e2e8f0",
      },
    },
  };

  // ================= VIDEO PLAYER VIEW =================
  if (view === "player" && selectedVideo) {
    const videoSrc = selectedVideo.videoUrl?.startsWith("http")
      ? selectedVideo.videoUrl
      : `${BASE_URL.replace("/api", "")}/${selectedVideo.videoUrl}`;

    const uploader = selectedVideo.uploadedBy;
    const channel = selectedVideo.channel;

    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
        <ToastContainer position="top-right" autoClose={3000} />
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
              onError={() => toast.error("Cannot load video – check file or server")}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {selectedVideo.title}
            </h2>
            <p className="text-gray-400 mt-2">
              {selectedVideo.description || "No description provided"}
            </p>

            {/* Uploader + Channel */}
            <div className="mt-6 p-5 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Uploaded By
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">
                    {uploader?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                      <User size={16} className="text-indigo-400" />
                      {uploader?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
                      <Mail size={14} />
                      {uploader?.email || "No email"}
                    </p>
                  </div>
                </div>

                {channel && (
                  <div className="sm:ml-auto flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                    <Tv size={16} className="text-amber-400" />
                    <div>
                      <p className="text-xs text-gray-400">Channel</p>
                      <p className="font-medium text-white">
                        {channel.name || channel.handle || "—"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
        <ToastContainer position="top-right" autoClose={3000} />
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

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
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

  // ================= LIST VIEW (DATA TABLE) =================
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
            <p className="text-gray-500 mt-1">
              {videos.length} videos total
            </p>
          </div>
          <button
            onClick={() => setView("upload")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition"
          >
            <Plus size={20} />
            Upload Video
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title, user, email, channel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredVideos}
            progressPending={loading}
            progressComponent={
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2
                  size={40}
                  className="animate-spin text-indigo-600 mb-4"
                />
                <p className="text-gray-600 font-medium">Loading videos...</p>
              </div>
            }
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20, 50]}
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
            noDataComponent={
              <div className="text-center py-16 text-gray-500">
                <p className="text-xl font-medium">No videos found</p>
                <p className="mt-2 text-sm">
                  {search
                    ? "Try a different search term"
                    : "Start by uploading a new video"}
                </p>
              </div>
            }
            onRowClicked={(row) => {
              setSelectedVideo(row);
              setView("player");
            }}
          />
        </div>
      </div>
    </div>
  );
}