import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

import {
  uploadLibrary,
  getLibrary,
  previewDocument,
  downloadDocument,
  myUploads,
  deleteLibrary,
  toggleFavorite,
  getMyFavorites,
  getPending,
  approveDoc,
  rejectDoc
} from "../controllers/libraryController.js";

const router = express.Router();

// 📤 upload
router.post("/upload", protect, upload.single("file"), uploadLibrary);

// 📚 library
router.get("/", getLibrary);

// 📂 preview
router.get("/preview/:id", previewDocument);

// 📥 download
router.get("/download/:id", downloadDocument);

// 📄 my uploads
router.get("/my", protect, myUploads);

// 🗑 delete
router.delete("/:id", protect, deleteLibrary);

// ⭐ favorites (toggle)
router.put("/favorite/:id", protect, toggleFavorite);
router.get("/favorites", protect, getMyFavorites);

// 🔥 admin
router.get("/admin/pending", protect, verifyAdmin, getPending);
router.put("/admin/approve/:id", protect, verifyAdmin, approveDoc);
router.put("/admin/reject/:id", protect, verifyAdmin, rejectDoc);

export default router;