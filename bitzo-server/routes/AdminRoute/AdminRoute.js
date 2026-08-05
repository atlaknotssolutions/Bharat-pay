const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
} = require("../../controller/AdminController/AdminController");
const requireAdmin = require("../../middlewares/requireAdmin");
const {
  getDashboard
} = require("../../controller/AdminController/adminDashboardController");

// Admin Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Admin Routes
router.get("/dashboard", requireAdmin, getDashboard);
router.get("/users/:id", requireAdmin, getUserById);
router.get("/alluser", requireAdmin, getAllUsers);
router.put("/users/:id", requireAdmin, updateUser);
router.delete("/users/:id", requireAdmin, deleteUser);
module.exports = router;
