import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { 
  FaUser,
  FaPhone,
  FaProjectDiagram,
  FaGraduationCap,
  FaTools,
  FaAward,
  FaPlus,
  FaBook,
  FaFileUpload,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUniversity
} from "react-icons/fa";

const PortfolioResults = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [student365Url, setStudent365Url] = useState("");
  const [file, setFile] = useState(null);

  const [moduleCount, setModuleCount] = useState(0);
  const [modules, setModules] = useState([]);

  const token = localStorage.getItem("token");

  const fetchPortfolio = async () => {
    const res = await axios.get(`/portfolio/public/${slug}`);
    setPortfolio(res.data);
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  // 🔥 HANDLE MODULE COUNT
  const handleModuleCount = (count) => {
    setModuleCount(count);

    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({ name: "", description: "", grade: "" });
    }
    setModules(arr);
  };

  // 🔥 HANDLE MODULE CHANGE
  const updateModule = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  // 🔥 SUBMIT RESULT
  const submitResult = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("student365Url", student365Url);
    formData.append("file", file);
    formData.append("modules", JSON.stringify(modules));

    await axios.post("/portfolio/upload-result", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Result submitted for review ✅");

    setTitle("");
    setStudent365Url("");
    setFile(null);
    setModules([]);

    fetchPortfolio();
  };

  if (!portfolio) return <p>Loading...</p>;
  const isOwner = user?._id === portfolio?.ownerId;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* PROFESSIONAL NAVIGATION */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate(`/portfolio/${slug}`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaUser />
                About
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/contact`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaPhone />
                Contact
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/projects`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaProjectDiagram />
                Projects
              </button>
              <button className="flex items-center gap-2 text-white font-semibold">
                <FaAward />
                Results
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/skills`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaTools />
                Skills
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/certificates`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaGraduationCap />
                Certificates
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ADD RESULT FORM */}
        {isOwner && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaUniversity className="text-gray-600" />
              Add Academic Results
            </h2>
            <p className="text-gray-600">Submit your academic achievements for portfolio display</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Year / Semester</label>
              <input
                type="text"
                placeholder="e.g., 2023 - Fall Semester"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Number of Modules</label>
              <input
                type="number"
                placeholder="e.g., 5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                onChange={(e) => handleModuleCount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-2">Result Document</label>
            <div className="relative">
              <input
                type="file"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FaFileUpload />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div> 

          {/* MODULE INPUTS */}
          {modules.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <FaBook className="text-white text-xs" />
                </div>
                <h4 className="font-semibold text-black">Module {i + 1}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Advanced Mathematics"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all bg-white"
                    onChange={(e) => updateModule(i, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Calculus and Linear Algebra"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all bg-white"
                    onChange={(e) => updateModule(i, "description", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input
                    type="text"
                    placeholder="e.g., A+, 85%, First Class"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all bg-white"
                    onChange={(e) => updateModule(i, "grade", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        
          {isOwner && (
          <button
            onClick={submitResult}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Submit Result
          </button>
          )}
        </div>
        )}

        {/* DISPLAY RESULTS */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaAward className="text-gray-600" />
              Academic Results
            </h2>
            <p className="text-gray-600">Your verified academic achievements</p>
          </div>

          {portfolio.results?.length > 0 ? (
            <div className="space-y-6">
              {portfolio.results.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  
                  {/* Result Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-2">{r.title}</h3>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {r.status === "pending" && (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            <FaClock className="text-xs" />
                            Pending approval
                          </div>
                        )}
                        {r.status === "approved" && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            <FaCheckCircle className="text-xs" />
                            Approved
                          </div>
                        )}
                        {r.status === "rejected" && (
                          <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            <FaTimesCircle className="text-xs" />
                            Rejected
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <FaUniversity className="text-white" />
                    </div>
                  </div>

                  {/* SHOW ONLY APPROVED RESULTS */}
                  {r.status === "approved" && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
                        <FaBook className="text-gray-600" />
                        Module Results
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {r.modules?.map((m, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-bold text-black text-sm">{m.name}</h5>
                              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {m.grade}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">{m.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaAward className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No Results Yet</h3>
              <p className="text-gray-600 mb-8">Start building your academic portfolio by adding your first result</p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-black mb-2">Why add results?</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li> Showcase your academic performance</li>
                  <li> Build credibility with institutions</li>
                  <li> Highlight your best achievements</li>
                  <li> Create a comprehensive academic profile</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PortfolioResults;