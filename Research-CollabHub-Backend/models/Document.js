import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    editedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false } // optional: do not create separate _id for each version
);

const documentSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: "" // initial blank content
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    versionHistory: [versionSchema], // stores previous versions
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;