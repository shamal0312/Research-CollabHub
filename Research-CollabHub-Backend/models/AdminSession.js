import mongoose from "mongoose";

const adminSessionSchema = new mongoose.Schema({
  adminId: String,
  loginTime: Date,
  device: String,
  status: {
    type: String,
    default: "active"
  }
,
ipAddress: String,
});

const AdminSession = mongoose.model("AdminSession", adminSessionSchema);

export default AdminSession;