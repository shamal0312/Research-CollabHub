import Document from "../models/Document.js";
import Workspace from "../models/workspace.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// 🔹 Create a new document inside a workspace
export const createDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;
    const { title, content } = req.body;

    let workspace = await Workspace.findOne({ workspaceId });
    if (!workspace) workspace = await Workspace.findById(workspaceId);

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.members.some(member => member.toString() === userId)) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const document = await Document.create({
      workspaceId,
      title,
      content: content || "",
      createdBy: userId,
      collaborators: workspace.members
    });

    res.status(201).json({ message: "Document created", document });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get all documents in a workspace
export const getDocumentsByWorkspace = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    let workspace = await Workspace.findOne({ workspaceId });
    if (!workspace) workspace = await Workspace.findById(workspaceId);

    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.members.some(member => member.toString() === userId))
      return res.status(403).json({ message: "You are not a member of this workspace" });

    const documents = await Document.find({ workspaceId }).select(
      "title createdBy collaborators createdAt updatedAt"
    );

    res.status(200).json({ documents });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get a single document by ID
export const getDocumentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const document = await Document.findById(documentId)
      .populate("collaborators", "fullName email")
      .populate("versionHistory.editedBy", "fullName email profilePicture");

    if (!document)
      return res.status(404).json({ message: "Document not found" });

    let workspace = await Workspace.findOne({ workspaceId: document.workspaceId });
    if (!workspace) workspace = await Workspace.findById(document.workspaceId);

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (!workspace.members.some(member => member.toString() === userId))
      return res.status(403).json({ message: "You are not allowed to access this document" });

    res.status(200).json({ document });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Update document content (with version control)
export const updateDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const content = req.body?.content;

    console.log("Incoming content:", content);

    if (content === undefined || content === null) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (typeof content !== "string") {
      return res.status(400).json({ message: "Content must be a string" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔥 FINAL FIX (IMPORTANT)
    let workspace = await Workspace.findById(document.workspaceId);

    if (!workspace) {
      workspace = await Workspace.findOne({ workspaceId: document.workspaceId });
    }

    if (!workspace) {
      workspace = await Workspace.findOne({ _id: document.workspaceId });
    }

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to edit this document"
      });
    }

    if (document.content && document.content !== content) {
      document.versionHistory.push({
        content: document.content,
        editedBy: new mongoose.Types.ObjectId(userId),
        editedAt: new Date()
      });
    }

    document.content = content;

    await document.save();

    res.status(200).json({
      success: true,
      message: "Document saved successfully",
      document
    });

  } catch (error) {
    console.error("Update Document Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// 🔹 Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    let workspace = await Workspace.findOne({ workspaceId: document.workspaceId });
    if (!workspace) workspace = await Workspace.findById(document.workspaceId);

    if (document.createdBy.toString() !== userId)
      return res.status(403).json({ message: "Only the creator can delete the document" });

    await Document.findByIdAndDelete(documentId);

    res.status(200).json({ message: "Document deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Download document
export const downloadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const document = await Document.findById(documentId);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    let workspace = await Workspace.findOne({ workspaceId: document.workspaceId });
    if (!workspace) workspace = await Workspace.findById(document.workspaceId);

    if (!workspace.members.some(member => member.toString() === userId))
      return res.status(403).json({ message: "You cannot download this document" });

    const filename = `${document.title}.txt`;
    const filePath = path.join(process.cwd(), "temp", filename);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, document.content, "utf-8");

    res.download(filePath, filename, err => {
      if (err) console.log(err);
      fs.unlinkSync(filePath);
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};