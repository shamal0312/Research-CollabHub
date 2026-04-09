import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import Workspace from "../models/workspace.js";

// 🔹 Create a new meeting inside a workspace
export const createMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;
    const { title, time, participants, meetingLink } = req.body;

    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });

    const meeting = await Meeting.create({
      workspaceId: workspace._id,
      title,
      time,
      participants,
      meetingLink,
      createdBy: new mongoose.Types.ObjectId(userId) // ✅ CORRECT
    });

    res.status(201).json({ message: "Meeting scheduled", meeting });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get all meetings for a workspace
export const getMeetingsByWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });

    const meetings = await Meeting.find({ workspaceId: workspace._id })
      .populate("participants", "fullName email profilePicture")
      .populate("createdBy", "fullName") // 🔥 IMPORTANT FIX
      .sort({ time: 1 });

    res.status(200).json({ meetings });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Delete a meeting (only creator can delete)
export const deleteMeeting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId, meetingId } = req.params;

    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });

    const meeting = await Meeting.findOne({
      _id: meetingId,
      workspaceId: workspace._id
    });

    if (!meeting)
      return res.status(404).json({ message: "Meeting not found" });

    // ✅ FIXED (safe compare)
    if (meeting.createdBy.toString() !== userId.toString())
      return res.status(403).json({
        message: "Only creator can delete this meeting"
      });

    await meeting.deleteOne(); // ✅ modern method

    res.status(200).json({ message: "Meeting deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};