import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

const UploadLibrary = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file");
      return;
    }

    if (!title || !description || !year || !semester || !field) {
      setUploadError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setUploadError("");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("year", year);
    formData.append("semester", semester);
    formData.append("field", field);

    try {
      await fetch("http://localhost:5000/api/library/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      setUploadSuccess(true);
      setTimeout(() => {
        navigate("/library");
      }, 2000);
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setUploadError("");
      } else {
        setUploadError("Please select a PDF file");
        setFile(null);
      }
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/library")}
              className="flex items-center space-x-2 text-black hover:text-gray-700 transition-colors mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Library</span>
            </button>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-3">Upload Document</h1>
              <p className="text-gray-600 text-lg">Share your academic resources with the community</p>
            </div>
          </div>

          {/* Upload Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-black rounded-xl shadow-lg p-8">
              {/* File Upload Area */}
              <div className="mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <div className="bg-gray-100 rounded-full p-4 hover:bg-gray-200 transition-colors">
                      <Upload className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <p className="text-black font-medium">Click to upload or drag and drop</p>
                      <p className="text-gray-600 text-sm">PDF files only (MAX. 10MB)</p>
                    </div>
                    {file && (
                      <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 text-sm font-medium">{file.name}</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      placeholder="Enter document title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-2">Field *</label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science, Mathematics"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Description *</label>
                  <textarea
                    placeholder="Provide a detailed description of your document"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black font-medium mb-2">Year *</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
                    >
                      <option value="">Select Year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-2">Semester *</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800">{uploadError}</p>
                  </div>
                )}

                {/* Success Message */}
                {uploadSuccess && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800">Document uploaded successfully! Redirecting to library...</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Document</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-black mb-2">Upload Guidelines</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>Only PDF files are accepted</li>
                    <li>Maximum file size: 10MB</li>
                    <li>All fields marked with * are required</li>
                    <li>Documents will be reviewed before being published</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadLibrary;