export const getWorkspaceDetails = async (req, res) => {
  res.status(200).json({
    totalWorkspaces: 8,
    activeMembers: 27
  });
};

export const createWorkspaceTask = async (req, res) => {
  res.status(200).json({
    message: "Workspace task created successfully"
  });
};

export const updateWorkspaceDocument = async (req, res) => {
  const { documentId } = req.params;

  res.status(200).json({
    message: "Workspace document updated successfully",
    documentId
  });
};

export const getWorkspaceDocuments = async (req, res) => {
  res.status(200).json({
    documents: []
  });
};