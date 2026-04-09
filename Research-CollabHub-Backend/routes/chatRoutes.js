import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, deleteMessage } from "../controllers/chatController.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// Send message with attachments (images/files)
router.post("/:workspaceId/send", protect, upload.array("attachments", 5), sendMessage);

// Get all messages in workspace
router.get("/:workspaceId", protect, getMessages);

// Delete message
router.delete("/delete/:messageId", protect, deleteMessage);

export default router;