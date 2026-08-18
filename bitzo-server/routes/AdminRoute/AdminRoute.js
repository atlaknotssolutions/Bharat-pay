const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  registerEmployee,
  loginEmployee,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getUserOverview,
  getAdminUserChannels,
  getAdminUserVideos,
  getAdminUserShorts,
  adminRefresh,
  adminLogout,
  getUserActivity,
  getUserWatchHistory,
  getUserSubscriptions,
  getUserLikedVideos,
  getUserDislikedVideos,
  getUserWatchLater,
  getUserNotifications,
  getUserDevices,
  getUserFraudEvents,
  getUserEngagement,
  suspendUser,
  restoreUser,
  banUser,
  disableChannel,
  enableChannel,
  banChannel,
  restoreChannel,
  deleteChannel,
  disableVideo,
  enableVideo,
  deleteVideo,
  disableShort,
  enableShort,
  deleteShort,
  getEmployees,
} = require("../../controller/AdminController/AdminController");
const requireAdmin = require("../../middlewares/requireAdmin");
const {
  adminLoginLimiter,
  adminRegisterLimiter,
  refreshLimiter,
  adminUserListLimiter,
  adminUserLimiter,
  adminDestructiveLimiter,
} = require("../../middlewares/rateLimit");
const {
  getDashboard,
} = require("../../controller/AdminController/adminDashboardController");
const {
  getAdminUploads
} = require("../../controller/AdminController/adminUploadsController");

// Admin Auth Routes
router.post("/register", adminRegisterLimiter, registerUser);
router.post("/login", adminLoginLimiter, loginUser); // Keep for backward compatibility
router.post("/admin-login", adminLoginLimiter, loginUser); // New: Explicit admin login
router.post("/employee-login", adminLoginLimiter, loginEmployee); // New: Employee/Staff login
router.post("/employee/register", adminRegisterLimiter, registerEmployee);
router.post("/employee/login", adminLoginLimiter, loginEmployee);
router.post("/refresh", refreshLimiter, adminRefresh);
router.post("/logout", adminLogout);
router.get("/roles", getEmployees); // public ya auth ke according
// Protected Admin Routes
router.get("/dashboard", requireAdmin, getDashboard);
router.get("/users", requireAdmin, getAllUsers);
router.get("/uploads", requireAdmin, adminUserListLimiter, getAdminUploads);
router.get("/alluser", requireAdmin, adminUserListLimiter, getAllUsers);
router.get("/users/:id", requireAdmin, adminUserLimiter, getUserById);
router.get("/users/:id/overview", requireAdmin, adminUserLimiter, getUserOverview);
router.get("/users/:id/channels", requireAdmin, adminUserLimiter, getAdminUserChannels);
router.get("/users/:id/videos", requireAdmin, adminUserLimiter, getAdminUserVideos);
router.get("/users/:id/shorts", requireAdmin, adminUserLimiter, getAdminUserShorts);
router.get("/users/:id/activity", requireAdmin, adminUserLimiter, getUserActivity);
router.get("/users/:id/watch-history", requireAdmin, adminUserLimiter, getUserWatchHistory);
router.get("/users/:id/subscriptions", requireAdmin, adminUserLimiter, getUserSubscriptions);
router.get("/users/:id/liked-videos", requireAdmin, adminUserLimiter, getUserLikedVideos);
router.get("/users/:id/disliked-videos", requireAdmin, adminUserLimiter, getUserDislikedVideos);
router.get("/users/:id/watch-later", requireAdmin, adminUserLimiter, getUserWatchLater);
router.get("/users/:id/notifications", requireAdmin, adminUserLimiter, getUserNotifications);
router.get("/users/:id/devices", requireAdmin, adminUserLimiter, getUserDevices);
router.get("/users/:id/fraud-events", requireAdmin, adminUserLimiter, getUserFraudEvents);
router.get("/users/:id/engagement", requireAdmin, adminUserLimiter, getUserEngagement);
router.put("/users/:id", requireAdmin, adminUserLimiter, updateUser);
router.delete("/users/:id", requireAdmin, adminDestructiveLimiter, deleteUser);

// Moderation routes (destructive actions ΓÇö use adminDestructiveLimiter)
router.post("/users/:id/suspend", requireAdmin, adminDestructiveLimiter, suspendUser);
router.post("/users/:id/restore", requireAdmin, adminDestructiveLimiter, restoreUser);
router.post("/users/:id/ban", requireAdmin, adminDestructiveLimiter, banUser);

// Channel moderation routes
router.post("/users/:id/channels/:channelId/disable", requireAdmin, adminUserLimiter, disableChannel);
router.post("/users/:id/channels/:channelId/enable", requireAdmin, adminUserLimiter, enableChannel);
router.post("/users/:id/channels/:channelId/ban", requireAdmin, adminDestructiveLimiter, banChannel);
router.post("/users/:id/channels/:channelId/restore", requireAdmin, adminUserLimiter, restoreChannel);
router.delete("/users/:id/channels/:channelId", requireAdmin, adminDestructiveLimiter, deleteChannel);

// Video moderation routes
router.post("/users/:id/videos/:videoId/disable", requireAdmin, adminUserLimiter, disableVideo);
router.post("/users/:id/videos/:videoId/enable", requireAdmin, adminUserLimiter, enableVideo);
router.delete("/users/:id/videos/:videoId", requireAdmin, adminDestructiveLimiter, deleteVideo);

// Short moderation routes
router.post("/users/:id/shorts/:videoId/disable", requireAdmin, adminUserLimiter, disableShort);
router.post("/users/:id/shorts/:videoId/enable", requireAdmin, adminUserLimiter, enableShort);
router.delete("/users/:id/shorts/:videoId", requireAdmin, adminDestructiveLimiter, deleteShort);

module.exports = router;
