import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import conversationRouter from "./routes/conversationRouter.js";
import messageRouter from "./routes/messageRouter.js";
import profileRouter from "./routes/profileRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import workspaceRouter from "./routes/workspaceRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import codeLabRoutes from "./routes/codeLabRoutes.js";






dotenv.config();

const app = express();




// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Allow frontend ports
  credentials: true
}));
app.use(express.json());
// Remove local uploads static serving - using Cloudinary instead
// app.use("/uploads", express.static("uploads"));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", userRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/profile", profileRouter);
app.use("/api/projects", projectRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/workspaces", taskRoutes);
app.use("/api/tasks", taskRoutes); 
app.use("/api/workspaces/:workspaceId/meetings", meetingRoutes); // meetings inside workspace
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/codelab", codeLabRoutes);







app.get("/", (req, res) => {
  res.send("Research CollabHub Backend is Running & DB Connected! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//user loging
//email : john.doe@example.com
//password : 654321

//admin login
//email : shamal@gmail.com
//password : Password123