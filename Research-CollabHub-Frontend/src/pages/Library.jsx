import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Search, BookOpen, Download, Heart, Upload, FolderOpen, Filter } from "lucide-react";

const Library = () => {
  const navigate = useNavigate();

  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [examMode, setExamMode] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH LIBRARY =================
  const fetchDocs = async () => {
    setLoading(true);
    let url = `http://localhost:5000/api/library?`;

    if (query) url += `query=${query}&`;
    if (year) url += `year=${year}&`;
    if (semester) url += `semester=${semester}&`;
    if (field) url += `field=${field}&`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error("Error fetching docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // ================= FAVORITE =================
  const toggleFavorite = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/library/favorite/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DOWNLOAD =================
  const downloadDoc = async (id, title) => {
    try {
      const res = await fetch(`http://localhost:5000/api/library/download/${id}`);
      const data = await res.json();

      const fileRes = await fetch(data.fileUrl);
      const blob = await fileRes.blob();

      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
    }
  };

  // ================= PREVIEW =================
  const previewDoc = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/library/preview/${id}`);
      const data = await res.json();

      window.open(data.fileUrl, "_blank");

    } catch (err) {
      console.error(err);
    }
  };

  // ================= EXAM MODE FILTER =================
  const filteredDocs = examMode
    ? [...docs]
        .filter((doc) => {
          const text =
            `${doc.title} ${doc.description} ${doc.field}`.toLowerCase();

          return (
            text.includes("exam") ||
            text.includes("past paper") ||
            text.includes("important") ||
            text.includes("revision") ||
            text.includes("note") ||
            text.includes("mcq") ||
            doc.downloads > 0 ||
            (doc.favorites && doc.favorites.length > 0)
          );
        })
        .sort((a, b) => b.downloads - a.downloads)
    : docs;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-black mb-3">
              Digital Library
            </h1>
            <p className="text-gray-700 text-lg">
              Discover and access academic resources from your peers
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
            <div 
              onClick={() => navigate("/library/upload")}
              className="bg-white border-2 border-black rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Upload className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">Upload Document</h3>
                  <p className="text-sm text-gray-600">Share your resources</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate("/library/my")}
              className="bg-white border-2 border-black rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <FolderOpen className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">My Uploads</h3>
                  <p className="text-sm text-gray-600">Manage your documents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white border-2 border-black rounded-xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-black" />
              <h2 className="text-lg font-semibold text-black">Search & Filter</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <div className="relative">
                  <Search 
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors ${
                      searchFocused ? "text-black" : ""
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search documents, topics, authors..."
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all ${
                      searchFocused ? "border-black" : "border-gray-300"
                    }`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>

              <select 
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>

              <select 
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>

              <button 
                onClick={fetchDocs}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                Search
              </button>

              <button
                onClick={() => setExamMode(!examMode)}
                className="bg-white text-black border-2 border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                {examMode ? "Exit Exam Mode" : "Exam Mode"}
              </button>
            </div>
          </div>

          {/* EXAM MODE BANNER */}
          {examMode && (
            <div className="bg-black text-white rounded-xl p-6 mb-6 text-center shadow-lg max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">
                Exam Survival Mode Activated
              </h2>
              <p className="text-gray-300">
                Showing top exam resources, past papers and revision notes
              </p>
            </div>
          )}

          {/* Documents Grid */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="mt-4 text-gray-700">Loading documents...</p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-black rounded-xl shadow-lg">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">No documents found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or upload a new document</p>
              </div>
            ) : docs.length === 0 ? (
              <div className="text-center py-12 bg-white border-2 border-black rounded-xl shadow-lg">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">No documents found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or upload a new document</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc._id} 
                    className="bg-white border-2 border-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Document Header */}
                    <div className="bg-black p-4">
                      <div className="flex items-center justify-between">
                        <div className="bg-white rounded-lg p-2">
                          <BookOpen className="w-6 h-6 text-black" />
                        </div>
                        <div className="bg-white rounded-full px-3 py-1">
                          <span className="text-black text-xs font-medium">
                            Year {doc.year}  Sem {doc.semester}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Document Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-black mb-2 line-clamp-2">
                        {doc.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {doc.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded">
                          {doc.field || "General"}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {doc.favorites?.length || 0}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => previewDoc(doc._id)}
                          className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Preview
                        </button>

                        <button
                          onClick={() => downloadDoc(doc._id, doc.title)}
                          className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>

                        <button
                          onClick={() => toggleFavorite(doc._id)}
                          className={`px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center ${
                            doc.favorites?.includes(token) 
                              ? "bg-black text-white hover:bg-gray-800" 
                              : "bg-white border-2 border-black text-black hover:bg-gray-100"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${doc.favorites?.includes(token) ? "fill-current text-white" : "text-black"}`} />
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

export default Library;