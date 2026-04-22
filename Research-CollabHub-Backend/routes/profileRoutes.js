import express from "express";
import {
  getProfile,
  updateProfile,
  updateProfilePicture,
  deleteProfilePicture,
  updateCoverPhoto,
  deleteCoverPhoto,
  addSkill,
  removeSkill,
  addInterest,
  removeInterest,
  getPublicProfile,
  searchUsers,
  getAllUsers,
  downloadPublicCV
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

// Public routes (accessible to all users)
router.get("/public/:userId", getPublicProfile);
router.get("/public/:userId/cv", downloadPublicCV);
router.get("/search", searchUsers);
router.get("/discover", getAllUsers);

// Protected routes (require authentication)
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

// Profile picture
router.put("/picture", protect, upload.single("profilePicture"), updateProfilePicture);
router.delete("/picture", protect, deleteProfilePicture);

// Cover photo
router.put("/cover", protect, upload.single("coverPhoto"), updateCoverPhoto);
router.delete("/cover", protect, deleteCoverPhoto);

// Skills
router.post("/skill", protect, addSkill);
router.delete("/skill", protect, removeSkill);

// Interests
router.post("/interest", protect, addInterest);
router.delete("/interest", protect, removeInterest);

// 🔍 SEARCH USERS
router.get("/search", protect, searchUsers);

// 🌍 DISCOVERY (optional)
router.get("/", protect, getAllUsers);

export default router;