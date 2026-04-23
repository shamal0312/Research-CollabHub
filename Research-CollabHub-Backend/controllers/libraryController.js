import Library from "../models/Library.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// ================= UPLOAD =================
export const uploadLibrary = async (req, res) => {
  try {
    const { title, description, year, semester, field } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw",
          use_filename: true,
          unique_filename: false,
          folder: "library_docs"
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const doc = await Library.create({
      title,
      description,
      fileUrl: result.secure_url,
      uploadedBy: req.user.id,
      year,
      semester,
      field,
      status: "pending"
    });

    res.json({ message: "Uploaded (Pending approval)", doc });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= LIBRARY =================
export const getLibrary = async (req, res) => {
  try {
    const { query, year, semester, field } = req.query;

    let filter = { status: "approved" };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { field: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ];
    }

    if (year) filter.year = year;
    if (semester) filter.semester = semester;
    if (field) filter.field = field;

    const docs = await Library.find(filter).populate("uploadedBy");

    res.json(docs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= PREVIEW =================
export const previewDocument = async (req, res) => {
  const doc = await Library.findById(req.params.id);

  if (!doc || doc.status !== "approved") {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({ fileUrl: doc.fileUrl });
};


// ================= DOWNLOAD =================
export const downloadDocument = async (req, res) => {
  try {
    const doc = await Library.findById(req.params.id);

    if (!doc || doc.status !== "approved") {
      return res.status(404).json({ message: "Not found" });
    }

    // increase count
    doc.downloads += 1;
    await doc.save();

    // ✅ Just send original URL
    res.json({ fileUrl: doc.fileUrl });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= MY UPLOADS =================
export const myUploads = async (req, res) => {
  const docs = await Library.find({ uploadedBy: req.user.id });
  res.json(docs);
};


// ================= DELETE =================
export const deleteLibrary = async (req, res) => {
  const doc = await Library.findById(req.params.id);

  if (!doc) return res.status(404).json({ message: "Not found" });

  if (doc.uploadedBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await doc.deleteOne();

  res.json({ message: "Deleted" });
};


// ================= FAVORITE =================
export const toggleFavorite = async (req, res) => {
  const doc = await Library.findById(req.params.id);

  if (!doc) return res.status(404).json({ message: "Not found" });

  const userId = req.user.id;

  const index = doc.favorites.indexOf(userId);

  if (index === -1) {
    doc.favorites.push(userId);
  } else {
    doc.favorites.splice(index, 1);
  }

  await doc.save();

  res.json(doc);
};


// ================= FAVORITES =================
export const getMyFavorites = async (req, res) => {
  const docs = await Library.find({
    favorites: req.user.id,
    status: "approved"
  });

  res.json(docs);
};


// ================= ADMIN =================
export const getPending = async (req, res) => {
  const docs = await Library.find({ status: "pending" });
  res.json(docs);
};

export const approveDoc = async (req, res) => {
  const doc = await Library.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  res.json(doc);
};

export const rejectDoc = async (req, res) => {
  const doc = await Library.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  res.json(doc);
};