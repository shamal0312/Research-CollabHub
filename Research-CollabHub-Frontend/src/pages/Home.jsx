import { useEffect, useState } from "react";
import axios from "../api/axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaRocket, FaUsers, FaProjectDiagram, FaHeart, FaStar, FaUserPlus, FaSearch, FaLightbulb, FaChartLine, FaPlus } from "react-icons/fa";

const Home = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [requested, setRequested] = useState([]); // track clicked
  const [searchTerm, setSearchTerm] = useState("");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const navigate = useNavigate();

  // FETCH PROJECTS (ONLY OTHERS)
  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects");

      // REMOVE OWN PROJECTS
      const filtered = res.data.projects.filter(
        (p) => p.ownerId._id !== user._id
      );

      setProjects(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  // SEND REQUEST (✅ FIXED WITH REAL DATA)
  const handleRequest = async (projectId) => {
    try {
      await axios.post(`/projects/${projectId}/request`, {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        address: "",
        whyGoodForThisProject: "Interested to join",
        skills: user.skills || [],
        experience: ""
      });

      // disable button
      setRequested((prev) => [...prev, projectId]);

      // remove from feed
      setProjects((prev) =>
        prev.filter((p) => p.projectId !== projectId)
      );

      // toast message
      alert("Request Sent ✅");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  // LIKE
  const handleLike = async (projectId) => {
    try {
      await axios.post(`/projects/${projectId}/like`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  // FAVORITE
  const handleFavorite = async (projectId) => {
    try {
      await axios.post(`/projects/${projectId}/favorite`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMatchScore = async (projectId) => {
    try {
      const res = await axios.get(
        `/projects/${projectId}/match-score` 
      );

      setMatchData(res.data);
      setShowMatchModal(true);

    } catch (err) {
      alert("Failed to calculate score");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* WELCOME HERO SECTION */}
      <div className="relative text-white">
        {/* BACKGROUND IMAGE */}
        <img
          src="https://coclilbxwbiidljasdmk.supabase.co/storage/v1/object/public/Research/Untitled%20folder/d9cb3743050866e13a5f7407ec384a32.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaHome className="text-black text-3xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.fullName || 'User'}!</h1>
            <p className="text-xl text-gray-300 mb-8">Discover amazing projects and collaborate with talented people</p>
            
            {/* USER STATS */}
            <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
              <div className="bg-white text-black p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Projects</p>
                <p className="text-xl font-bold">{projects.length}</p>
              </div>
              <div className="bg-white text-black p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Requests</p>
                <p className="text-xl font-bold">{requested.length}</p>
              </div>
              <div className="bg-white text-black p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Messages</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
            
            {/* QUICK ACTIONS */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/create-project')}
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <FaRocket />
                Create Project
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <FaSearch />
                Browse Projects
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <FaUsers />
                Messages
              </button>
              <button
                onClick={() => navigate("/resume-checker")}
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium"
              >
                Check Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECTS FEED */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* SEARCH BAR */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 rounded-lg shadow-sm pl-12 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* SECTION DIVIDER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-black" />
            </div>
            <span className="text-gray-500 text-sm font-medium">DISCOVER PROJECTS</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaProjectDiagram className="text-gray-400 text-3xl" />
            </div>
            <p className="text-xl font-semibold text-black mb-2">No Projects Yet 🚀</p>
            <p className="text-gray-600">Be the first to create one</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter(p => 
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((p) => (
            <div key={p.projectId} className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {/* HEADER */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${p.ownerId._id}`)}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {p.ownerId.profilePicture ? (
                        <img src={p.ownerId.profilePicture} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <FaUsers className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{p.ownerId.fullName}</p>
                      <p className="text-xs text-gray-500">Project Owner</p>
                    </div>
                  </div>
                  {p.likes && p.likes.length > 5 && (
                    <span className="bg-black text-white text-xs px-2 py-1 rounded">
                      Trending 🔥
                    </span>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4">
                {/* PROJECT IMAGE */}
                {p.projectImage && (
                  <div className="mb-4">
                    <img
                      src={p.projectImage}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* TITLE AND DESCRIPTION */}
                <h3 className="font-bold text-lg text-black mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description}</p>

                {/* PROJECT INFO */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-500 text-sm" />
                    <span className="text-sm text-gray-600">{p.maxMembers} members max</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLightbulb className="text-gray-500 text-sm" />
                    <span className="text-sm text-gray-600">{p.skillsRequired?.length || 0} skills</span>
                  </div>
                </div>

                {/* SKILLS */}
                {p.skillsRequired && p.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {p.skillsRequired.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-black px-2 py-1 rounded-lg text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {p.skillsRequired.length > 3 && (
                        <span className="bg-gray-100 text-black px-2 py-1 rounded-lg text-xs font-medium">
                          +{p.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(p.projectId)}
                      className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <FaHeart className="text-sm" />
                      <span className="text-sm">{p.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handleFavorite(p.projectId)}
                      className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors"
                    >
                      <FaStar className="text-sm" />
                      <span className="text-sm">{p.favorites?.length || 0}</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMatchScore(p.projectId)}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-200"
                    >
                      Match Score
                    </button>
                    <button
                      onClick={() => handleRequest(p.projectId)}
                      disabled={requested.includes(p.projectId)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        requested.includes(p.projectId)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {requested.includes(p.projectId) ? (
                        <>
                          <FaUserPlus />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <FaUserPlus />
                          Join Project
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => navigate('/create-project')}
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full shadow-lg text-xl hover:bg-gray-800 transition-all duration-200 hover:scale-110 flex items-center justify-center"
      >
        <FaPlus />
      </button>

      {showMatchModal && matchData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl p-6 shadow-2xl">

            <h2 className="text-2xl font-bold mb-4 text-black">
              Smart Team Match
            </h2>

            <p className="text-4xl font-bold mb-4">
              {matchData.percentage}%
            </p>

            <p className="mb-2">
              Skills matched:
              {matchData.matchedSkills.length > 0
                ? matchData.matchedSkills.join(", ")
                : " None"}
            </p>

            <p className="mb-2">
              Missing skills:
              {matchData.missingSkills.length > 0
                ? matchData.missingSkills.join(", ")
                : " None"}
            </p>

            <p className="mb-2">
              Interest matched: {matchData.interest}
            </p>

            <p className="mb-6">
              Availability: {matchData.availability}
            </p>

            <button
              onClick={() => setShowMatchModal(false)}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;