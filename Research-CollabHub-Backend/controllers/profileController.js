import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// 🔹 Get user profile (all details)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update profile (everything except studentId & gender)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      email,
      age,
      year,
      semester,
      universityName,
      faculty,
      phoneNumber,
      address,
      about
    } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        age,
        year,
        semester,
        universityName,
        faculty,
        phoneNumber,
        address,
        about
      },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update profile picture using Cloudinary
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "research_profiles" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: "" },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Profile picture deleted", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update cover photo using Cloudinary
export const updateCoverPhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "research_covers" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { coverPhoto: result.secure_url },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Cover photo updated", user });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete cover photo
export const deleteCoverPhoto = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { coverPhoto: "" },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Cover photo deleted", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Add a skill
export const addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { skills: skill } },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Skill added", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Remove a skill
export const removeSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { skills: skill } },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Skill removed", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Add an interest
export const addInterest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interest } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { interests: interest } },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Interest added", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Remove an interest
export const removeInterest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interest } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interests: interest } },
      { returnDocument: "after" }
    ).select("-password");

    res.status(200).json({ message: "Interest removed", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Portfolio from "../models/Portfolio.js"; // ✅ ADD THIS

// 🔹 Get public user profile (accessible to all users)
export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID and exclude sensitive information
    const user = await User.findById(userId)
      .select("-password -email -phoneNumber -address")
      .populate("skills interests");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 GET USER PORTFOLIO
    const portfolio = await Portfolio.findOne({ userId: user._id });

    // Format public profile data
    const publicProfile = {
      _id: user._id,
      fullName: user.fullName,
      studentId: user.studentId,
      universityName: user.universityName,
      faculty: user.faculty,
      year: user.year,
      semester: user.semester,
      age: user.age,
      gender: user.gender,
      about: user.about,
      skills: user.skills || [],
      interests: user.interests || [],
      profilePicture: user.profilePicture,
      coverPhoto: user.coverPhoto,
      twitter: user.twitter,
      linkedin: user.linkedin,
      github: user.github,
      website: user.website,
      role: user.role,
      createdAt: user.createdAt
    };

    // ✅ FINAL RESPONSE (ONLY ADDITION)
    res.status(200).json({
      user: publicProfile,
      portfolioSlug: portfolio?.portfolioSlug || null // 🔥 THIS IS THE FIX
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Search users (for finding profiles)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search users by name, university, or skills
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { universityName: { $regex: query, $options: 'i' } },
        { skills: { $elemMatch: { name: { $regex: query, $options: 'i' } } } }
      ]
    })
    .select("-password -email -phoneNumber -address")
    .limit(20);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all users (for discovery)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, university, faculty } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (university) filter.universityName = new RegExp(university, 'i');
    if (faculty) filter.faculty = new RegExp(faculty, 'i');

    const users = await User.find(filter)
      .select("-password -email -phoneNumber -address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};