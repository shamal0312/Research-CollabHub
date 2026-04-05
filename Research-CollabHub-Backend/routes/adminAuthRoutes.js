import express from "express";
import {
  verifyAdminLogin,
  generateAccessLog,
    logoutAdmin
} from "../controllers/adminAuthController.js";

const router = express.Router();

router.get("/verify", verifyAdminLogin);
router.get("/logs", generateAccessLog);
router.post("/logout", logoutAdmin);

export default router;