import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: [val => val.length === 2, "Conversation must have 2 members"],
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // unread count per user
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;