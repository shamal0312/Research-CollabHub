import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyWorkspaces, getWorkspaceById } from "../controllers/workspaceController.js";

const router = express.Router();

// 🔹 Get all workspaces the logged-in user belongs to
router.get("/", protect, getMyWorkspaces);

// 🔹 Get a single workspace by workspaceId
router.get("/:workspaceId", protect, getWorkspaceById);

export default router;