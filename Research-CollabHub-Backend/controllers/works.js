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