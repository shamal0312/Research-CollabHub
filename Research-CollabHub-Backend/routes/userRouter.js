import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { updatePassword } from "../controllers/userController.js";
import { logoutUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/update-password", updatePassword);

router.post("/logout", logoutUser);

export default router;