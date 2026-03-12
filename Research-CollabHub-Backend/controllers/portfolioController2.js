const likePortfolio = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Portfolio liked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to like portfolio",
    });
  }
};

const addPortfolioComment = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};