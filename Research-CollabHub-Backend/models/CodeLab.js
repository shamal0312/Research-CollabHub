import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
{
  name: String,
  content: String,
  language: String
},
{ _id: false }
);

const codeLabSchema = new mongoose.Schema(
{
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
    unique: true
  },

  files: {
    type: [fileSchema],
    default: [
      {
        name: "index.js",
        content: "console.log('Hello World');",
        language: "javascript"
      }
    ]
  }
},
{ timestamps: true }
);

export default mongoose.model("CodeLab", codeLabSchema);
