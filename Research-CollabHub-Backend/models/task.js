// backend/models/Task.js
import mongoose from "mongoose";

// 🔹 Schema to track task updates/versions
const taskVersionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["ToDo", "In Progress", "Done"],
      default: "ToDo"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ ADD THIS (IMPORTANT)
    dueDate: {
      type: Date,
      default: null
    },

    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { _id: false }
);

// 🔹 Main Task Schema
const taskSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: ""
    },

    // ✅ ADD THIS (MAIN FIX)
    dueDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["ToDo", "In Progress", "Done"],
      default: "ToDo"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    versionHistory: [taskVersionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// 🔹 Export Task model
const Task = mongoose.model("Task", taskSchema);
export default Task;