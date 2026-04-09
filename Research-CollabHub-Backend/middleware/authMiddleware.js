import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    // ✅ Convert ObjectId to string to fix owner check issues
    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Existing exports
export { protect };
export { protect as verifyToken };  // 👈 This fixes everything

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    // ✅ FIX HERE (use role instead of isAdmin)
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};