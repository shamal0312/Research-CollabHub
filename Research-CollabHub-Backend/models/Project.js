import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true // leader of the project
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    maxMembers: {
      type: Number,
      required: true
    },

    skillsRequired: [
      {
        type: String
      }
    ],

    // 🔥 ADDED PROJECT IMAGE FIELD
    projectImage: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["open", "in progress", "completed"],
      default: "open"
    },

    requests: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        fullName: String,
        email: String,
        phoneNumber: String,
        address: String,
        whyGoodForThisProject: String,
        skills: [String],
        experience: String,

        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending"
        },

        responseMessage: {
          type: String,
          default: ""
        },

        requestedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // ================= 🔥 NEW SOCIAL FEATURES =================

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        text: {
          type: String,
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]

    // =========================================================

  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;