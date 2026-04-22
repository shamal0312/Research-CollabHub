import mongoose from "mongoose";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";
import PDFDocument from "pdfkit";

// 🔹 Create a new task inside a workspace
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId, title, description, assignedTo, dueDate } = req.body;

    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({ message: "You are not a member of this workspace" });

    const task = await Task.create({
      workspaceId: workspace._id,
      title,
      description: description || "",
      assignedTo,
      status: "ToDo",
      dueDate: dueDate || null,
      createdBy: userId,
      versionHistory: []
    });

    res.status(201).json({ message: "Task created", task });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get all tasks in a workspace
export const getTasksByWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      workspaceId: new mongoose.Types.ObjectId(workspaceId)
    });
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({ message: "You are not a member of this workspace" });

    const tasks = await Task.find({ workspaceId: workspace._id })
      .populate("assignedTo", "fullName")
      .populate("createdBy", "fullName")
      .populate("versionHistory.updatedBy", "fullName")
      .sort({ dueDate: 1 });

    res.status(200).json({ tasks });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Update a task
export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { title, description, status, assignedTo, dueDate } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ FIXED (VERY IMPORTANT)
    const workspace = await Workspace.findById(task.workspaceId);

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({ message: "You are not allowed to edit this task" });

    task.versionHistory.push({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      updatedBy: userId // ✅ FIXED KEY NAME
    });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({ message: "Task updated", task });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Delete a task
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ FIXED (VERY IMPORTANT)
    const workspace = await Workspace.findById(task.workspaceId);

    // ✅ FIXED
    if (!workspace.members.some(m => m.toString() === userId))
      return res.status(403).json({ message: "You are not allowed to delete this task" });

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    // Find workspace using Project workspaceId
    const workspace = await Workspace.findOne({
      workspaceId: workspaceId
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // Count completed tasks using real Workspace _id
    const completedTasks = await Task.countDocuments({
      workspaceId: workspace._id,
      assignedTo: userId,
      status: "Done"
    });

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    doc.pipe(res);

    doc.fontSize(30)
      .text("Certificate of Contribution", {
        align: "center"
      });

    doc.moveDown(2);

    doc.fontSize(18)
      .text("Awarded for valuable contribution to", {
        align: "center"
      });

    doc.moveDown();

    doc.fontSize(24)
      .text(workspace.title, {
        align: "center"
      });

    doc.moveDown(2);

    doc.fontSize(18)
      .text(`Completed Tasks: ${completedTasks}`, {
        align: "center"
      });

    doc.moveDown();

    doc.fontSize(16)
      .text(
        `Date: ${new Date().toLocaleDateString()}`,
        {
          align: "center"
        }
      );

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};