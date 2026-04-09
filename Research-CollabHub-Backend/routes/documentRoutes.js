// backend/routes/documentRoutes.js

import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createDocument,
  getDocumentsByWorkspace,
  getDocumentById,
  updateDocument,
  deleteDocument,
  downloadDocument
} from "../controllers/documentController.js";

const router = express.Router();

// 🔹 Create a new document in a workspace
router.post("/:workspaceId", protect, createDocument);

// 🔹 Get all documents in a workspace
router.get("/workspace/:workspaceId", protect, getDocumentsByWorkspace);

// 🔹 Get a single document by ID
router.get("/:documentId", protect, getDocumentById);

// 🔹 Update a document (version control handled in controller)
router.put("/:documentId", protect, updateDocument);

// 🔹 Delete a document
router.delete("/:documentId", protect, deleteDocument);

// 🔹 Download document
router.get("/download/:documentId", protect, downloadDocument);

export default router;