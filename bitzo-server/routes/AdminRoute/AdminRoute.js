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
  adminRefresh,
  adminLogout,
  getEmployees,
} = require("../../controller/AdminController/AdminController");
const requireAdmin = require("../../middlewares/requireAdmin");
const {
  adminLoginLimiter,
  adminRegisterLimiter,
  refreshLimiter,
} = require("../../middlewares/rateLimit");
const {
  getDashboard,
} = require("../../controller/AdminController/adminDashboardController");

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
router.get("/users/:id", requireAdmin, getUserById);
router.get("/alluser", requireAdmin, getAllUsers);
router.put("/users/:id", requireAdmin, updateUser);
router.delete("/users/:id", requireAdmin, deleteUser);
module.exports = router;
