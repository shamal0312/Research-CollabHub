import express from "express";
import {
  createConversation,
  getUserConversations,
  resetUnreadCount,
} from "../controllers/ConversationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Create or get conversation
router.post("/", verifyToken, createConversation);

// 🔹 Get all conversations of logged-in user
router.get("/", verifyToken, getUserConversations);

// 🔹 Reset unread count for a conversation
router.put("/reset/:conversationId", verifyToken, resetUnreadCount);

export default router;