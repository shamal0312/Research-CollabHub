import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
{
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  contactEmail: {
    type: String
  },

  contactPhone: {
    type: String
  },

  university: {
    type: String
  },

  degree: {
    type: String
  },

  specialization: {
    type: String
  },

  bio: {
    type: String,
    trim: true
  },

  // Skills
  skills: [
    {
      type: String
    }
  ],

  // Social Links
  github: {
    type: String
  },

  linkedin: {
    type: String
  },

  website: {
    type: String
  },

  // Public portfolio link
  portfolioSlug: {
    type: String,
    unique: true
  },

  isPublic: {
    type: Boolean,
    default: true
  },

  // CV Upload
  cvFile: {
    type: String
  },

  // Certifications
  certifications: [
    {
      title: String,
      issuer: String,
      year: String,
      fileUrl: String
    }
  ],

  // Experience
  experience: [
    {
      role: String,
      company: String,
      description: String,
      tools: [String],
      startDate: Date,
      endDate: Date
    }
  ],

  // Projects (User adds manually)
  projects: [
    {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String
      },

      githubLink: {
        type: String
      },

      demoLink: {
        type: String
      },

      technologies: [
        {
          type: String
        }
      ],

      image: {
        type: String
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Result verification (admin approved)
  results: [
    {
      title: String,

      imageUrl: String,

      student365Url: String,

      // ✅ ADDED MODULES (ONLY CHANGE)
      modules: [
        {
          name: String,
          description: String,
          grade: String
        }
      ],

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]

},
{ timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;