import express from "express";
import {
  createMeeting,
  getMeetingsByWorkspace,
  deleteMeeting,
} from "../controllers/meetingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// Create a new meeting
router.post("/", protect, createMeeting);

// Get all meetings for a workspace
router.get("/", protect, getMeetingsByWorkspace);

// Delete a meeting
router.delete("/:meetingId", protect, deleteMeeting);

export default router;