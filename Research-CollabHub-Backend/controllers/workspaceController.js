import Workspace from "../models/workspace.js";
import Project from "../models/Project.js";

// 🔹 Get all workspaces for the logged-in user
export const getMyWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all workspaces where the user is a member
    const workspaces = await Workspace.find({ members: userId })
      .populate("ownerId", "fullName email") // optionally show owner info
      .select("workspaceId title ownerId createdAt updatedAt"); // show only necessary fields

    res.status(200).json({ workspaces });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get a single workspace by ID (to go inside workspace)
export const getWorkspaceById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({ workspaceId })
      .populate("ownerId", "fullName email")
      .populate("members", "fullName email"); // show members if needed

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    // Check if user is part of the workspace
    if (!workspace.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({ message: "You do not have access to this workspace" });
    }

    // Optionally, populate linked project description
    const project = await Project.findById(workspaceId).select("description");
    const workspaceData = {
      ...workspace.toObject(),
      description: project ? project.description : ""
    };

    res.status(200).json({ workspace: workspaceData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};