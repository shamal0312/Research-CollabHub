import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    semester: {
      type: Number,
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },

    universityName: {
      type: String
    },

    faculty: {
      type: String
    },

    phoneNumber: {
      type: String
    },

    address: {
      type: String
    },

    about: {
      type: String
    },

    skills: [
      {
        type: String
      }
    ],

    interests: [
      {
        type: String
      }
    ],

    profilePicture: {
      type: String,
      default: ""
    },

    coverPhoto: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  
);

const User = mongoose.model("User", userSchema);
export default User;