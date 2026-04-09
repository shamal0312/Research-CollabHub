import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    default: ""
  },
  attachments: [
    {
      filename: String,   // original file name
      filePath: String,   // path on server (e.g., /uploads/file-123.jpg)
      type: String        // "image" or "file"
    }
  ]
}, { timestamps: true });

export default mongoose.model("ChatMessage", chatMessageSchema);