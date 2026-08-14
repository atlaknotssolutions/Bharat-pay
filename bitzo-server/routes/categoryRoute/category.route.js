const express = require("express");
const {
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../controller/categorycontroller/catgeory.controller");
const requireAdmin = require("../../middlewares/requireAdmin");

const router = express.Router();

router.get("/", getAllCategorys);
router.get("/:id", getCategoryById);
router.post("/", requireAdmin, createCategory);
router.put("/:id", requireAdmin, updateCategory);
router.delete("/:id", requireAdmin, deleteCategory);

module.exports = router;
