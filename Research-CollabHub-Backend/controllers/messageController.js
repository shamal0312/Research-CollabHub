// backend/controllers/messageController.js
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

// 🔹 Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, messageText } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !messageText) {
      return res
        .status(400)
        .json({ message: "conversationId and messageText are required" });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      messageText,
      isRead: false,
      isDeleted: false,
    });

    // Update lastMessage and unread counts
    const conversation = await Conversation.findById(conversationId);

    if (conversation) {
      conversation.lastMessage = messageText;
      conversation.lastMessageSender = senderId;

      conversation.members.forEach((memberId) => {
        if (!conversation.unreadCount.has(memberId.toString())) {
          conversation.unreadCount.set(memberId.toString(), 0);
        }
        if (memberId.toString() !== senderId) {
          conversation.unreadCount.set(
            memberId.toString(),
            (conversation.unreadCount.get(memberId.toString()) || 0) + 1
          );
        }
      });

      await conversation.save();
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all messages of a conversation (exclude deleted) and mark unread as read
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({ conversationId, isDeleted: false })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName studentId profilePicture");

    // Mark unread messages sent by others as read
    await Message.updateMany(
      { conversationId, senderId: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );

    // Reset unread count for this user in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 },
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Soft delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};