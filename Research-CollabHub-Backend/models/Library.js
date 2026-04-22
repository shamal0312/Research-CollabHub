import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

    fileUrl: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    year: {
      type: Number,
      required: true
    },

    semester: {
      type: Number,
      required: true
    },

    field: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    downloads: {
      type: Number,
      default: 0
    },

    // ⭐ FAVORITES (users who liked)
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Library", librarySchema);