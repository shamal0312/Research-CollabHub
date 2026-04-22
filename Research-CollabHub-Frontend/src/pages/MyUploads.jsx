import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, FileText, Trash2, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

const MyUploads = () => {
  const navigate = useNavigate();

  const [docs, setDocs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // VALIDATION FUNCTION
  const validateDoc = (doc) => {
    let err = {};

    // title validation
    if (!doc.title || doc.title.length < 3) {
      err.title = "Title must be at least 3 characters";
    }

    // description validation
    if (!doc.description || doc.description.length < 3) {
      err.description = "Description must be at least 3 characters";
    }

    // year validation
    if (![1, 2, 3, 4].includes(Number(doc.year))) {
      err.year = "Year must be 1, 2, 3, or 4";
    }

    // semester validation
    if (![1, 2].includes(Number(doc.semester))) {
      err.semester = "Semester must be 1 or 2";
    }

    // field validation (custom)
    if (!doc.field || doc.field.length < 3) {
      err.field = "Field must be at least 3 characters";
    }

    return err;
  };

  const fetchMyDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/library/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setDocs(data);

      // RUN VALIDATION LIVE
      let allErrors = {};
      data.forEach((doc) => {
        const docErrors = validateDoc(doc);
        if (Object.keys(docErrors).length > 0) {
          allErrors[doc._id] = docErrors;
        }
      });

      setErrors(allErrors);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoc = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/library/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchMyDocs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyDocs();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
              <h1 className="text-4xl font-bold text-black mb-3">My Uploads</h1>
              <p className="text-gray-600 text-lg">Manage your uploaded documents</p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="mt-4 text-gray-700">Loading your uploads...</p>
              </div>
            ) : docs.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-black rounded-xl shadow-lg">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">No uploads yet</h3>
                <p className="text-gray-600 mb-6">Start by uploading your first document</p>
                <button
                  onClick={() => navigate("/library/upload")}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Upload Document
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {docs.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-white border-2 border-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Document Header */}
                    <div className="bg-black p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white rounded-lg p-2">
                            <FileText className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">{doc.title}</h3>
                            <p className="text-gray-300 text-sm">
                              Year {doc.year}  Semester {doc.semester}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          <span className="text-xs font-medium capitalize">{doc.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Content */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{doc.description}</p>

                      {/* Field Tag */}
                      <div className="mb-4">
                        <span className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-700">
                          {doc.field || "General"}
                        </span>
                      </div>

                      {/* Validation Errors */}
                      {errors[doc._id] && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h4 className="font-semibold text-red-800">Validation Errors</h4>
                          </div>
                          <div className="space-y-1">
                            {errors[doc._id].title && (
                              <p className="text-red-700 text-sm">Title: {errors[doc._id].title}</p>
                            )}
                            {errors[doc._id].description && (
                              <p className="text-red-700 text-sm">Description: {errors[doc._id].description}</p>
                            )}
                            {errors[doc._id].year && (
                              <p className="text-red-700 text-sm">Year: {errors[doc._id].year}</p>
                            )}
                            {errors[doc._id].semester && (
                              <p className="text-red-700 text-sm">Semester: {errors[doc._id].semester}</p>
                            )}
                            {errors[doc._id].field && (
                              <p className="text-red-700 text-sm">Field: {errors[doc._id].field}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteDoc(doc._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyUploads;