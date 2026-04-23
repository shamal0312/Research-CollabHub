import express from "express";
import {
  createTask,
  getTasksByWorkspace,
  updateTask,
  deleteTask,
  generateCertificate
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new task inside a workspace
router.post("/create", protect, createTask);

// ✅ Generate certificate
router.get("/certificate/:workspaceId", protect, generateCertificate);

// ✅ Get all tasks for a workspace
router.get("/:workspaceId", protect, getTasksByWorkspace);

// ✅ Update a task
router.put("/:taskId", protect, updateTask);

// ✅ Delete a task
router.delete("/:taskId", protect, deleteTask);

export default router;