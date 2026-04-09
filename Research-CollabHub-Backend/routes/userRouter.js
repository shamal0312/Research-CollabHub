import express from "express";
import {
  registerUser,
  loginUser,
  updatePassword,
  logoutUser,
  getProfile,
  uploadProfileImage
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 PROTECTED ROUTES
router.get("/profile", protect, getProfile);

router.post(
  "/upload",
  protect,
  upload.single("image"),
  uploadProfileImage
);

router.post("/update-password", protect, updatePassword);

router.post("/logout", logoutUser);

export default router;