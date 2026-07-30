const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  // updateUser,
  deleteUser,
  getUserById
} = require("../../controller/AdminController/AdminController");

// Admin Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/alluser",getAllUsers)
router.get("/users/:id", getUserById);
router.get("/alluser", getAllUsers);
// router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
module.exports = router;
