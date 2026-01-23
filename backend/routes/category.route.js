import express from "express";
import { getCategories, getCategory, createCategory } from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", protect, createCategory);

export default router;
