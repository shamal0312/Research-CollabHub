import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { 
  FaPlus,
  FaTrash,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
  FaBriefcase,
  FaTools,
  FaCalendarAlt,
  FaBuilding,
  FaGraduationCap,
  FaUser,
  FaAward,
  FaProjectDiagram,
  FaPhone,
  FaEnvelope,
  FaHome
} from "react-icons/fa";

const PortfolioSkills = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const { user } = useAuth();
  const [skill, setSkill] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [exp, setExp] = useState({
    role: "",
    company: "",
    description: "",
    tools: "",
    startDate: "",
    endDate: ""
  });

  const token = localStorage.getItem("token");

  const fetchPortfolio = async () => {
    const res = await axios.get(`/portfolio/public/${slug}`);
    setPortfolio(res.data);
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  // ================= SKILLS =================

  const addSkill = async () => {
    if (!skill) return;

    const updated = [...(portfolio.skills || []), skill];

    await axios.put("/portfolio/update", { skills: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setSkill("");
    fetchPortfolio();
  };

  const deleteSkill = async (index) => {
    const updated = portfolio.skills.filter((_, i) => i !== index);

    await axios.put("/portfolio/update", { skills: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchPortfolio();
  };

  // ================= EXPERIENCE =================

  const addExperience = async () => {
    const updated = [
      ...(portfolio.experience || []),
      {
        ...exp,
        tools: exp.tools.split(",").map(t => t.trim())
      }
    ];

    await axios.put("/portfolio/update", { experience: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setExp({
      role: "",
      company: "",
      description: "",
      tools: "",
      startDate: "",
      endDate: ""
    });

    fetchPortfolio();
  };

  const deleteExperience = async (index) => {
    const updated = portfolio.experience.filter((_, i) => i !== index);

    await axios.put("/portfolio/update", { experience: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchPortfolio();
  };

  const editExperience = (index) => {
    const e = portfolio.experience[index];

    setExp({
      ...e,
      tools: e.tools.join(", ")
    });

    setEditingIndex(index);
  };

  const updateExperience = async () => {
    const updated = [...portfolio.experience];

    updated[editingIndex] = {
      ...exp,
      tools: exp.tools.split(",").map(t => t.trim())
    };

    await axios.put("/portfolio/update", { experience: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setEditingIndex(null);
    setExp({
      role: "",
      company: "",
      description: "",
      tools: "",
      startDate: "",
      endDate: ""
    });

    fetchPortfolio();
  };

  // ================= REORDER =================

  const moveUp = async (index) => {
    if (index === 0) return;

    const updated = [...portfolio.experience];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];

    await axios.put("/portfolio/update", { experience: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchPortfolio();
  };

  const moveDown = async (index) => {
    if (index === portfolio.experience.length - 1) return;

    const updated = [...portfolio.experience];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];

    await axios.put("/portfolio/update", { experience: updated }, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
              <button 
                onClick={() => navigate(`/portfolio/${slug}/results`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaAward />
                Results
              </button>
              <button className="flex items-center gap-2 text-white font-semibold">
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

        {/* SKILLS SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                <FaTools className="text-gray-600" />
                Skills & Expertise
              </h2>
              <p className="text-gray-600">Add and manage your professional skills</p>
            </div>
          </div>

          {/* Add Skill Input */}
          {isOwner && (
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Enter a skill (e.g., JavaScript, React, Node.js)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill();
                  }
                }}
              />
            </div>
            <button
              onClick={addSkill}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Add Skill
            </button>
          </div>
          )}

          {/* Skills Display */}
          <div className="flex flex-wrap gap-3">
            {portfolio.skills?.map((s, i) => (
              <div key={i} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 group">
                <span className="text-black font-medium">{s}</span>
                {isOwner && (
                <button 
                  onClick={() => deleteSkill(i)} 
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
              </div>
            ))}
          </div>

          {portfolio.skills?.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaTools className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500">No skills added yet. Start by adding your first skill!</p>
            </div>
          )}
        </div>

        {isOwner && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
            <FaBriefcase className="text-gray-600" />
            {editingIndex !== null ? "Edit Experience" : "Add Experience"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Role</label>
              <input
                placeholder="e.g., Senior Developer"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={exp.role}
                onChange={(e) => setExp({ ...exp, role: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Company</label>
              <input
                placeholder="e.g., Tech Corp"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={exp.company}
                onChange={(e) => setExp({ ...exp, company: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-black mb-2">Description</label>
            <textarea
              placeholder="Describe your responsibilities and achievements..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50 h-32 resize-none"
              value={exp.description}
              onChange={(e) => setExp({ ...exp, description: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-black mb-2">Tools & Technologies</label>
            <input
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
              value={exp.tools}
              onChange={(e) => setExp({ ...exp, tools: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={exp.startDate}
                onChange={(e) => setExp({ ...exp, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={exp.endDate}
                onChange={(e) => setExp({ ...exp, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            {editingIndex !== null ? (
              <>
                <button
                  onClick={updateExperience}
                  className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaEdit />
                  Update Experience
                </button>
                <button
                  onClick={() => {
                    setEditingIndex(null);
                    setExp({
                      role: "",
                      company: "",
                      description: "",
                      tools: "",
                      startDate: "",
                      endDate: ""
                    });
                  }}
                  className="bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={addExperience}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus />
                Add Experience
              </button>
            )}
          </div>
        </div>
        )} 

        {/* EXPERIENCE TIMELINE */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
            <FaCalendarAlt className="text-gray-600" />
            Professional Timeline
          </h2>

          {portfolio.experience?.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaBriefcase className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No Experience Yet</h3>
              <p className="text-gray-600 mb-8">Start building your professional timeline by adding your first experience</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              {portfolio.experience?.map((e, i) => (
                <div key={i} className="relative mb-8 last:mb-0">
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 bg-black rounded-full border-4 border-white shadow-lg"></div>

                  {/* Experience Card */}
                  <div className="ml-20 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-black mb-1">{e.role}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBuilding className="text-sm" />
                          <span className="font-medium">{e.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaCalendarAlt className="text-sm" />
                        <span>
                          {e.startDate?.slice(0, 10)} - {e.endDate?.slice(0, 10) || "Present"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{e.description}</p>

                    {/* Tools */}
                    {e.tools?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {e.tools.map((t, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {isOwner && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => editExperience(i)}
                        className="text-black hover:text-gray-700 font-medium text-sm flex items-center gap-1 transition-colors"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExperience(i)}
                        className="text-gray-500 hover:text-red-600 font-medium text-sm flex items-center gap-1 transition-colors"
                      >
                        <FaTrash />
                        Delete
                      </button>
                      <button
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                        className="text-gray-500 hover:text-black font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowUp />
                        Up
                      </button>
                      <button
                        onClick={() => moveDown(i)}
                        disabled={i === portfolio.experience.length - 1}
                        className="text-gray-500 hover:text-black font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowDown />
                        Down
                      </button>
                    </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PortfolioSkills;