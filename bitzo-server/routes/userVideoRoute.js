const express = require("express");
const router = express.Router();
const {
  getAllVideos,
  getVideoById,
  addView,
  likeVideo,
  dislikeVideo,
  getVideoInteraction,
  deleteComment,
  addComment,
  getComments,
  deleteChannel,
  getvideosByChannel,
  getChannelById,
  getChannels,
  getSubscribedChannels,
  getUserWatchHistory,
  getUserLikedVideos,
  getUserWatchLaterVideos,
  getUserUploadedVideos,
  createChannel,
  subscribeChannel,
  uploadVideo,
  recommendedVideos,
  trendingVideos,
  LatestVideos,
  HistoricalVideos,
  getSubscribedVideos,
  LikedVideos,
} = require("../controller/userVideoController");
const { imageUpload } = require("../middlewares/multer");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");
const uploadToBackblaze = require("../middlewares/blazerMiddlware");
router.post(
  "/createchannel",
  isAuthenticated,
  imageUpload.fields([
    { name: "channelImage", maxCount: 1 },
    { name: "channelBanner", maxCount: 1 },
  ]),
  createChannel,
);

// router.post(
//   "/upload/:channelId",
//   isAuthenticated,
//   ...uploadToBackblaze,
//   uploadVideo
// );

router.post(
  "/upload/:channelId",
  isAuthenticated,
  upload.videoAndThumbnailUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo,
);
router.get("/channel", isAuthenticated, getChannels);
router.get("/subscribed-channels", isAuthenticated, getSubscribedChannels);
router.get("/history", isAuthenticated, getUserWatchHistory);
router.get("/liked-videos", isAuthenticated, getUserLikedVideos);
router.get("/watch-later", isAuthenticated, getUserWatchLaterVideos);
router.get("/my-videos", isAuthenticated, getUserUploadedVideos);
router.get("/channel/:id", isAuthenticated, getChannelById);
router.get("/channel/:id/videos", isAuthenticated, getvideosByChannel);
router.delete("/channel/:id", deleteChannel);

router.get("/recommended", isAuthenticated, recommendedVideos);
router.get("/trending", isAuthenticated, trendingVideos);
router.get("/latest", isAuthenticated, LatestVideos);
router.get("/subscriptions", isAuthenticated, getSubscribedVideos);
router.get("/history", isAuthenticated, HistoricalVideos);
router.get("/", isAuthenticated, getAllVideos);
router.get("/liked", isAuthenticated, LikedVideos);
router.post("/subscribe/:channelId", isAuthenticated, subscribeChannel);

router.get("/:id", isAuthenticated, getVideoById);
router.post("/:videoId/view", addView);
router.post("/:videoId/like", likeVideo);
router.post("/:videoId/dislike", dislikeVideo);
router.get("/:videoId/interaction", getVideoInteraction);
router.delete("/:videoId/comment/:commentId", deleteComment);
router.post("/:videoId/comment", addComment);
router.get("/:videoId/comments", getComments);

module.exports = router;
