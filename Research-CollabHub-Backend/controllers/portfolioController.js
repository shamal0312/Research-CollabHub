import Portfolio from "../models/Portfolio.js";
import user from "../models/user.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/*
CREATE PORTFOLIO
*/
export const createPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      contactEmail,
      contactPhone,
      university,
      degree,
      specialization,
      bio,
      skills,
      github,
      linkedin
    } = req.body;

    const existingPortfolio = await Portfolio.findOne({ userId });
    if (existingPortfolio)
      return res.status(400).json({ message: "Portfolio already exists" });

    const slug =
      fullName.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      userId.slice(-4);

    const portfolio = await Portfolio.create({
      userId,
      fullName,
      contactEmail,
      contactPhone,
      university,
      degree,
      specialization,
      bio,
      skills: skills ? skills.split(",") : [], // ✅ IMPORTANT
      github,
      linkedin,
      portfolioSlug: slug
    });

    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
GET MY PORTFOLIO
*/
export const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
UPDATE PORTFOLIO
*/
export const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
DELETE PORTFOLIO
*/
export const deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
ADD SKILL
*/
export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { skills: skill } },
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
REMOVE SKILL
*/
export const removeSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { skills: skill } },
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
ADD PROJECT
*/
export const addProject = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const upload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio_projects" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      imageUrl = upload.secure_url;
    }

    // ✅ FIX: convert technologies to ARRAY
    const technologies = req.body.technologies
      ? req.body.technologies.split(",").map(t => t.trim())
      : [];

    const project = {
      title: req.body.title,
      description: req.body.description,
      githubLink: req.body.githubLink,
      demoLink: req.body.demoLink,
      technologies, // ✅ FIXED
      image: imageUrl
    };

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { projects: project } },
      { new: true }
    );

    res.json(portfolio);

  } catch (error) {
    console.error("ADD PROJECT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/*
UPDATE PROJECT
*/
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id, "projects._id": projectId },
      { $set: { "projects.$": req.body } },
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
DELETE PROJECT
*/
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
UPLOAD CV
*/

export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "portfolio_cvs", resource_type: "raw" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { cvFile: result.secure_url },
      { new: true }
    );

    res.json({ message: "CV uploaded", portfolio });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
UPLOAD RESULT PROOF
*/
export const uploadResultProof = async (req, res) => {
  try {
    const { title, student365Url } = req.body;

    // ✅ FIX 1: SAFE MODULE PARSE
    let parsedModules = [];

    try {
      if (req.body.modules) {
        parsedModules = JSON.parse(req.body.modules);
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid modules format" });
    }

    // ✅ FIX 2: FILE CHECK
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const upload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "portfolio_results" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const result = {
      title,
      student365Url,
      imageUrl: upload.secure_url,
      modules: parsedModules, // ✅ FIXED
      status: "pending"
    };

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { results: result } },
      { new: true }
    );

    res.json({ message: "Result uploaded", portfolio });

  } catch (error) {
    console.error("UPLOAD RESULT ERROR:", error); // ✅ DEBUG
    res.status(500).json({ message: error.message });
  }
};

/*
ADMIN APPROVE RESULT
*/
export const approveResult = async (req, res) => {
  try {
    const { portfolioId, resultId } = req.params;
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: portfolioId, "results._id": resultId },
      { $set: { "results.$.status": "approved" } },
      { new: true }
    );
    res.json({ message: "Result approved", portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
ADMIN REJECT RESULT
*/
export const rejectResult = async (req, res) => {
  try {
    const { portfolioId, resultId } = req.params;
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: portfolioId, "results._id": resultId },
      { $set: { "results.$.status": "rejected" } },
      { new: true }
    );
    res.json({ message: "Result rejected", portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
PUBLIC PORTFOLIO VIEW
*/
export const getPortfolioBySlug = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ portfolioSlug: req.params.slug });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const approvedResults = portfolio.results.filter(
      (r) => r.status === "approved"
    );

    // ✅ UPDATED RESPONSE (ADDED ownerId ONLY)
    const response = {
      ...portfolio.toObject(),
      results: approvedResults,
      ownerId: portfolio.userId // 🔥 THIS IS THE IMPORTANT ADD
    };

    res.json(response);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();

    // 🔥 FLATTEN ALL RESULTS
    const allResults = portfolios.flatMap((p) =>
      (p.results || []).map((r) => ({
        ...r.toObject(),
        portfolioId: p._id,
        fullName: p.fullName
      }))
    );

    res.status(200).json(allResults);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};