export const getProjectDashboard = async (req, res) => {
  res.status(200).json({
    totalProjects: 12,
    pendingRequests: 5,
    activeMembers: 34
  });
};

export const archiveProject = async (req, res) => {
  res.status(200).json({
    message: "Project archived successfully"
  });
};