import express from "express";
import {
  createPortfolio,
  getMyPortfolio,
  updatePortfolio,
  deletePortfolio,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  deleteProject,
  uploadCV,
  uploadResultProof,
  approveResult,
  rejectResult,
  getPortfolioBySlug,
  getAllResults
} from "../controllers/portfolioController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ CHANGED (memory storage)

const router = express.Router();

// Portfolio CRUD
router.post("/create", verifyToken, createPortfolio);
router.get("/me", verifyToken, getMyPortfolio);
router.put("/update", verifyToken, updatePortfolio);
router.delete("/delete", verifyToken, deletePortfolio);



// Skills
router.post("/skill", verifyToken, addSkill);
router.delete("/skill", verifyToken, removeSkill);

// Projects
router.post("/project", verifyToken, upload.single("image"), addProject); // ✅ CHANGED (added upload)
router.put("/project/:projectId", verifyToken, updateProject);
router.delete("/project/:projectId", verifyToken, deleteProject);

// ❌ REMOVED old local upload route (not needed anymore)

// CV Upload
router.post("/upload-cv", verifyToken, upload.single("cv"), uploadCV);

// Result Proof
router.post("/upload-result", verifyToken, upload.single("file"), uploadResultProof);

// Admin Approve/Reject Result
router.put("/result/:portfolioId/approve/:resultId", verifyToken, verifyAdmin, approveResult);
router.put("/result/:portfolioId/reject/:resultId", verifyToken, verifyAdmin, rejectResult);

// Public Portfolio View
router.get("/public/:slug", getPortfolioBySlug);

router.get("/admin/results", verifyToken, verifyAdmin, getAllResults);

export default router;