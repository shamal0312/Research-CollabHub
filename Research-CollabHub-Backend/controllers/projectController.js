import Project from "../models/Project.js";
import Workspace from "../models/workspace.js";
import User from "../models/user.js";

// 🔹 Create a new project
export const createProject = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { title, description, maxMembers, skillsRequired } = req.body;

    const project = await Project.create({
      title,
      description,
      ownerId,
      maxMembers,
      skillsRequired,
      members: [ownerId],
      status: "open",

      // ✅ ADDED IMAGE
      projectImage: req.file ? req.file.path : ""
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update project (only owner can update)
export const updateProject = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.projectId; // matches router param
    const { title, description, maxMembers, skillsRequired, status } = req.body;

    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.ownerId.toString() !== ownerId)
      return res.status(403).json({ message: "Only project owner can update" });

    project.title = title || project.title;
    project.description = description || project.description;

    // Update maxMembers safely
    if (maxMembers) {
      if (maxMembers < project.members.length) {
        return res.status(400).json({
          message: `Cannot set maxMembers below current members count (${project.members.length})`
        });
      }
      project.maxMembers = maxMembers;
    }

    project.skillsRequired = skillsRequired || project.skillsRequired;
    project.status = status || project.status;

    await project.save();
    res.status(200).json({ message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete project (only owner)
export const deleteProject = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.ownerId.toString() !== ownerId)
      return res.status(403).json({ message: "Only project owner can delete" });

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Student requests to join a project
export const requestToJoinProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const studentId = req.user.id;
    const { fullName, email, phoneNumber, address, whyGoodForThisProject, skills, experience } = req.body;

    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if student is already a member
    if (project.members.includes(studentId)) {
      return res.status(400).json({ message: "You are already a member of this project" });
    }

    // Check if project is full
    if (project.members.length >= project.maxMembers) {
      return res.status(400).json({ message: "Cannot join. Project is already full." });
    }

    // Prevent duplicate requests
    const alreadyRequested = project.requests.some(r => r.studentId.toString() === studentId);
    if (alreadyRequested) {
      return res.status(400).json({ message: "You have already sent a request to this project" });
    }

    // Add request
    project.requests.push({
      studentId,
      fullName,
      email,
      phoneNumber,
      address,
      whyGoodForThisProject,
      skills,
      experience
    });

    await project.save();
    res.status(200).json({ message: "Request sent successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Leader views all requests (with optional filter)
export const getProjectRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.projectId;
    const statusFilter = req.query.status;

    const project = await Project.findOne({ projectId })
      .populate("requests.studentId", "fullName email profilePicture"); // ✅ FIXED

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.ownerId.toString() !== ownerId)
      return res.status(403).json({ message: "Only project owner can view requests" });

    let requests = project.requests;
    if (statusFilter) {
      requests = requests.filter(r => r.status === statusFilter);
    }

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Leader accepts a student request


export const acceptRequest = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.projectId;
    const requestId = req.params.requestId;

    const project = await Project.findOne({ projectId });
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.ownerId.toString() !== ownerId)
      return res.status(403).json({ message: "Only project owner can accept requests" });

    if (project.members.length >= project.maxMembers)
      return res.status(400).json({ message: "Project is already full" });

    const reqIndex = project.requests.findIndex(
      r => r._id.toString() === requestId
    );
    if (reqIndex === -1)
      return res.status(404).json({ message: "Request not found" });

    const selectedRequest = project.requests[reqIndex];

    // Prevent duplicate acceptance
    if (selectedRequest.status === "accepted")
      return res.status(400).json({ message: "Request already accepted" });

    // add student to members
    project.members.push(selectedRequest.studentId);

    // update request status and message
    selectedRequest.status = "accepted";
    selectedRequest.responseMessage = "Your request has been accepted";

    // 🔹 If project becomes full after this acceptance
    if (project.members.length >= project.maxMembers) {
      project.requests.forEach(r => {
        if (r.status === "pending") {
          r.status = "rejected";
          r.responseMessage =
            "Your request was rejected because the project is full";
        }
      });
    }

    await project.save();

    // 🔹 CREATE WORKSPACE AUTOMATICALLY WHEN PROJECT IS FULL
    if (project.members.length >= project.maxMembers) {
      const existingWorkspace = await Workspace.findOne({ workspaceId: project.projectId });

      if (!existingWorkspace) {
        await Workspace.create({
          workspaceId: project.projectId,
          title: project.title,
          ownerId: project.ownerId,
          members: [project.ownerId, ...project.members]
        });
      }
    }

    res.status(200).json({
      message: "Request accepted and member added",
      project
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Leader rejects a student request
export const rejectRequest = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const projectId = req.params.projectId;
    const requestId = req.params.requestId;

    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.ownerId.toString() !== ownerId)
      return res.status(403).json({ message: "Only project owner can reject requests" });

    const reqIndex = project.requests.findIndex(
      r => r._id.toString() === requestId
    );
    if (reqIndex === -1) return res.status(404).json({ message: "Request not found" });

    const studentId = project.requests[reqIndex].studentId;

    // Remove student from members if they were added
    const memberIndex = project.members.findIndex(
      m => m.toString() === studentId.toString()
    );
    if (memberIndex !== -1) {
      project.members.splice(memberIndex, 1); // remove student from members
    }

    // Update request status and message
    project.requests[reqIndex].status = "rejected";
    project.requests[reqIndex].responseMessage = "Your request has been rejected";

    await project.save();

    // 🔹 If project is no longer full, remove workspace
    if (project.members.length < project.maxMembers) {
      await Workspace.deleteOne({ workspaceId: project.projectId });
    }

    res.status(200).json({
      message: "Request rejected successfully",
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Search / filter projects (ONLY OPEN PROJECTS)
export const searchProjects = async (req, res) => {
  try {

    // 🔥 ALWAYS ONLY OPEN PROJECTS
    const query = {
      status: "open"
    };

    const projects = await Project.find(query)
      .populate("ownerId", "fullName email profilePicture")

    res.status(200).json({ projects });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all projects created by the logged-in student (owner)
export const getMyProjects = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const projects = await Project.find({ ownerId })
      // ✅ 🔥 THIS IS THE FIX (YOU MISSED THIS)
      .populate("ownerId", "fullName profilePicture")

      // existing (kept exactly as you had)
      .populate("members", "fullName email profilePicture")
      .populate("requests.studentId", "fullName email profilePicture");

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get all projects that the logged-in student has applied to
export const getAppliedProjects = async (req, res) => {
  try {
    const studentId = req.user.id;

    const projects = await Project.find({ "requests.studentId": studentId })
      .populate("ownerId", "fullName email profilePicture") // ✅ FIXED (added profilePicture)
      .populate("requests.studentId", "fullName email")
      .populate("members", "_id"); // ✅ KEEP AS IT IS

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//LIKE / UNLIKE

export const toggleLike = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    const userId = req.user.id;

    if (!project) return res.status(404).json({ message: "Project not found" });

    const alreadyLiked = project.likes.includes(userId);

    if (alreadyLiked) {
      project.likes.pull(userId); // unlike
    } else {
      project.likes.push(userId); // like
    }

    await project.save();

    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      totalLikes: project.likes.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//FAVORITE / UNFAVORITE

export const toggleFavorite = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    const userId = req.user.id;

    if (!project) return res.status(404).json({ message: "Project not found" });

    const alreadyFav = project.favorites.includes(userId);

    if (alreadyFav) {
      project.favorites.pull(userId);
    } else {
      project.favorites.push(userId);
    }

    await project.save();

    res.json({
      message: alreadyFav ? "Removed from favorites" : "Added to favorites",
      totalFavorites: project.favorites.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//add comment

export const addComment = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const newComment = {
      userId: req.user.id,
      text: req.body.text
    };

    project.comments.push(newComment);

    await project.save();

    res.json({
      message: "Comment added",
      comments: project.comments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete comment

export const deleteComment = async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({ projectId });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const comment = project.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 🔥 RULE CHECK
    const isCommentOwner = comment.userId.toString() === userId;
    const isProjectOwner = project.ownerId.toString() === userId;

    if (!isCommentOwner && !isProjectOwner) {
      return res.status(403).json({
        message: "Not allowed to delete this comment"
      });
    }

    comment.deleteOne();

    await project.save();

    res.json({
      message: "Comment deleted",
      comments: project.comments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

