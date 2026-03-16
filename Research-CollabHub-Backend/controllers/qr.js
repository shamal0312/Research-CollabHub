// Research-CollabHub-Backend/controllers/portfolioStatsController.js

export const getPortfolioStats = async (req, res) => {
  try {
    res.status(200).json({
      totalPortfolios: 18,
      activeUsers: 42,
      featuredPortfolios: 6
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load portfolio statistics"
    });
  }
};

export const getRecentPortfolios = async (req, res) => {
  try {
    res.status(200).json({
      portfolios: [
        { id: 1, title: "AI Research Portfolio" },
        { id: 2, title: "UI/UX Showcase" },
        { id: 3, title: "Web Development Work" }
      ]
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent portfolios"
    });
  }
};

export const featurePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    res.status(200).json({
      message: "Portfolio featured successfully",
      portfolioId: id
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to feature portfolio"
    });
  }
};