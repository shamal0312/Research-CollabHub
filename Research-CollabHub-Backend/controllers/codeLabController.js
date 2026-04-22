import Workspace from "../models/workspace.js";
import CodeLab from "../models/CodeLab.js";

export const getCodeLab = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({ workspaceId });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    let lab = await CodeLab.findOne({
      workspaceId: workspace._id
    });

    if (!lab) {
      lab = await CodeLab.create({
        workspaceId: workspace._id
      });
    }

    res.json(lab);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const saveCodeLab = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { files } = req.body;

    const workspace = await Workspace.findOne({ workspaceId });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const lab = await CodeLab.findOneAndUpdate(
      { workspaceId: workspace._id },
      { files },
      { new: true, upsert: true }
    );

    res.json({
      message: "Saved successfully",
      lab
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
