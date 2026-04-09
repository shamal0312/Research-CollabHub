import Conversation from "../models/Conversation.js";
import User from "../models/user.js";

// 🔹 Create Conversation (or return existing one)
export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id; // from auth middleware

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (conversation) {
      return res.status(200).json(conversation);
    }

    // Create new conversation
    conversation = await Conversation.create({
      members: [senderId, receiverId],
      unreadCount: {
        [senderId.toString()]: 0,
        [receiverId.toString()]: 0,
      },
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Conversations For Logged In User
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members", "fullName studentId profilePicture")
      .populate("lastMessageSender", "fullName")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Reset Unread Count When User Opens Chat
export const resetUnreadCount = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.unreadCount.has(userId)) {
      conversation.unreadCount.set(userId, 0);
      await conversation.save();
    }

    res.status(200).json({ message: "Unread count reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};