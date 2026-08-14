const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  adminRefresh,
  adminLogout,
} = require("../../controller/AdminController/AdminController");
const requireAdmin = require("../../middlewares/requireAdmin");
const {
  adminLoginLimiter,
  adminRegisterLimiter,
  refreshLimiter,
} = require("../../middlewares/rateLimit");
const {
  getDashboard
} = require("../../controller/AdminController/adminDashboardController");

// Admin Auth Routes
router.post("/register", adminRegisterLimiter, registerUser);
router.post("/login", adminLoginLimiter, loginUser);
router.post("/refresh", refreshLimiter, adminRefresh);
router.post("/logout", adminLogout);

// Protected Admin Routes
router.get("/dashboard", requireAdmin, getDashboard);
router.get("/users/:id", requireAdmin, getUserById);
router.get("/alluser", requireAdmin, getAllUsers);
router.put("/users/:id", requireAdmin, updateUser);
router.delete("/users/:id", requireAdmin, deleteUser);
module.exports = router;
