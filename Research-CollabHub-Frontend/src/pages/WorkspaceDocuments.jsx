import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { FaFileAlt, FaPlus, FaSave, FaTrash, FaDownload, FaArrowLeft, FaFolder, FaComments, FaUsers, FaCalendarCheck, FaHistory } from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api";

const WorkspaceDocuments = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState("");

  const token = localStorage.getItem("token"); // ✅ ADDED

  // 🔥 FETCH DOCUMENTS
  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/documents/workspace/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ ADDED
          }
        }
      );
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
    }
  };

  // 🔥 OPEN DOCUMENT
  const openDocument = async (id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ ADDED
          }
        }
      );
      setSelectedDoc(res.data.document);
      setDocContent(res.data.document.content);
    } catch (err) {
      console.error("Open error:", err.response?.data || err);
    }
  };

  // 🔥 SAVE DOCUMENT
  const saveDocument = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/documents/${selectedDoc._id}`,
        { content: docContent },
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ ADDED
          }
        }
      );

      setSelectedDoc(res.data.document);
      setDocContent(res.data.document.content);

      alert("Saved successfully ✅");
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      alert("Save failed ❌");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [workspaceId]);

  const downloadDocument = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/documents/download/${selectedDoc._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${selectedDoc.title}.txt`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed ");
    }
  };

  const deleteDocument = async () => {
    try {
      if (!selectedDoc?._id) {
        alert("No document selected ");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this document?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/documents/${selectedDoc._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Document deleted ");

      setSelectedDoc(null);
      setDocContent("");

      fetchDocuments(); // refresh list

    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      alert("Delete failed ");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* PROFESSIONAL NAVIGATION */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate(`/workspace/${workspaceId}`)}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaFolder />
                Home
              </button>
              <button
                onClick={() => navigate(`/workspace/${workspaceId}/messages`)}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaComments />
                Messages
              </button>
              <button className="flex items-center gap-2 text-white font-semibold">
                <FaFileAlt />
                Documents
              </button>
              <button
                onClick={() => navigate(`/workspace/${workspaceId}/meetings`)}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaCalendarCheck />
                Meetings
              </button>
              <button
                onClick={() => navigate(`/workspace/${workspaceId}/tasks`)}
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaUsers />
                Tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* DOCUMENTS HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Workspace Documents</h1>
              <p className="text-gray-600">Manage and collaborate on your team documents</p>
            </div>
            <button
              onClick={async () => {
                try {
                  const title = prompt("Enter document title");
                  if (!title) return;

                  const res = await axios.post(
                    `${BASE_URL}/documents/${workspaceId}`,
                    {
                      title,
                      content: ""
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}` // 
                      }
                    }
                  );

                  console.log("Created:", res.data);

                  alert("Document created ");

                  fetchDocuments();

                } catch (err) {
                  console.error("Create error:", err.response?.data || err);
                  alert("Create failed ");
                }
              }}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Create Document
            </button>
          </div>
        </div>

        {/* DOCUMENT LIST */}
        {!selectedDoc && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer hover:border-gray-300 group"
                onClick={() => openDocument(doc._id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <FaFileAlt className="text-black text-xl" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {doc.content?.substring(0, 100) || "No content yet..."}
                  </p>
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <span>Click to open document</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DOCUMENT EDIT VIEW */}
        {selectedDoc && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {/* Back Button */}
            <button
              onClick={() => setSelectedDoc(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 font-medium"
            >
              <FaArrowLeft />
              Back to Documents
            </button>

            {/* Document Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">
                {selectedDoc.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created: {new Date(selectedDoc.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Last modified: {new Date(selectedDoc.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Text Editor */}
            <div className="mb-6">
              <textarea
                value={docContent || ""}
                onChange={(e) => setDocContent(e.target.value)}
                className="w-full h-96 border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all resize-none text-black"
                placeholder="Start typing your document content..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={saveDocument}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaSave />
                Save Document
              </button>

              <button
                onClick={deleteDocument}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaTrash />
                Delete Document
              </button>

              <button
                onClick={downloadDocument}
                className="bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <FaDownload />
                Download
              </button>
            </div>

            {/* VERSION HISTORY */}
            {selectedDoc.versionHistory && selectedDoc.versionHistory.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <FaHistory />
                  Version History
                </h3>
                <div className="space-y-3">
                  {selectedDoc.versionHistory?.map((v, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-black">
                            Edited by: {v.editedBy?.fullName || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-600">
                            At: {new Date(v.editedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Version #{i + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default WorkspaceDocuments;