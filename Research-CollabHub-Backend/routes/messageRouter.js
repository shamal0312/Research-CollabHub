import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a new message
router.post("/", verifyToken, sendMessage);

// Get all messages of a conversation
router.get("/:conversationId", verifyToken, getMessages);

// Soft delete a message
router.delete("/:messageId", verifyToken, deleteMessage);

export default router;