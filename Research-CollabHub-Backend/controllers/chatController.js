import mongoose from "mongoose";
import ChatMessage from "../models/ChatMessage.js";
import Workspace from "../models/workspace.js";
import cloudinary from "../config/cloudinary.js";

// 🔹 Send message with optional attachments
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;
    const { message } = req.body;

    // ✅ FIXED (ObjectId lookup)
    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    // ✅ FIXED (ObjectId compare)
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({ message: "Not a member of this workspace" });

    // ✅ FIXED (ALL FILE TYPES SUPPORT)
    const attachments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "auto", // 🔥 THIS FIXES PDF, DOC, ETC
              folder: "chat_files"
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(file.buffer); // ✅ memoryStorage fix
        });

        attachments.push({
          filename: file.originalname,
          filePath: result.secure_url,
          type: file.mimetype.startsWith("image/") ? "image" : "file",
        });
      }
    }

    const chatMessage = await ChatMessage.create({
      workspaceId: workspace._id,
      sender: userId,
      message: message || "",
      attachments,
    });

    res.status(201).json({ message: "Message sent", chatMessage });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get all messages in a workspace
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({ message: "Not a member of this workspace" });

    const messages = await ChatMessage.find({ workspaceId: workspace._id })
      .populate("sender", "fullName profilePicture")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Delete a chat message (only sender can delete)
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    const message = await ChatMessage.findById(messageId);
    if (!message)
      return res.status(404).json({ message: "Message not found" });

    if (message.sender.toString() !== userId.toString())
      return res.status(403).json({ message: "Only sender can delete the message" });

    await message.deleteOne();

    res.status(200).json({ message: "Message deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};