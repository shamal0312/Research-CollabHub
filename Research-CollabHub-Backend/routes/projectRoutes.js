import express from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  requestToJoinProject,
  getProjectRequests,
  acceptRequest,
  rejectRequest,
  searchProjects,
  getMyProjects,
  getAppliedProjects, // new controller
  toggleLike, toggleFavorite, addComment, deleteComment, autoSelectBestMembers,
  getMatchScore
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ------------------- Project CRUD -------------------
// Create a new project (owner is set from JWT)
router.post("/", protect, upload.single("projectImage"), createProject);

// Update project (owner only)
router.put("/:projectId", protect, updateProject);

// Delete project (owner only)
router.delete("/:projectId", protect, deleteProject);

// Get all projects created by the logged-in student (owner)
router.get("/my-projects", protect, getMyProjects);

// ------------------- Project Requests -------------------
// Student sends a request to join a project
router.post("/:projectId/request", protect, requestToJoinProject);

// Owner views all requests for their project
router.get("/:projectId/requests", protect, getProjectRequests);

// Owner accepts a request
router.put("/:projectId/requests/:requestId/accept", protect, acceptRequest);

// Owner rejects a request
router.put("/:projectId/requests/:requestId/reject", protect, rejectRequest);

// ------------------- Project Search/Filter -------------------
// Filter/search projects (by title, owner, status, skills)
router.get("/", protect, searchProjects);

// ------------------- Student Applied Projects -------------------
// Get all projects that the logged-in student has applied to
router.get("/applied-projects", protect, getAppliedProjects);

//like,unlike
router.post("/:projectId/like", protect, toggleLike);
//favorite,unfavorite
router.post("/:projectId/favorite", protect, toggleFavorite);
//comments
router.post("/:projectId/comment", protect, addComment);
//delete comment
router.delete("/:projectId/comment/:commentId", protect, deleteComment);

router.post("/:projectId/auto-select", protect, autoSelectBestMembers);

router.get("/:projectId/match-score", protect, getMatchScore);

export default router;