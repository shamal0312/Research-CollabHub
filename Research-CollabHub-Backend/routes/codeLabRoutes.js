import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getCodeLab,
  saveCodeLab
} from "../controllers/codeLabController.js";

const router = express.Router();

router.get("/:workspaceId", protect, getCodeLab);
router.put("/:workspaceId", protect, saveCodeLab);

export default router;
