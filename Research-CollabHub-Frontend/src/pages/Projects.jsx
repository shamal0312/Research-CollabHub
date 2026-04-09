import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaUsers, FaProjectDiagram, FaBriefcase, FaClock, FaCheckCircle, FaTimesCircle, FaHeart, FaStar, FaTrash, FaUserCircle, FaGraduationCap, FaCodeBranch, FaRocket, FaChartLine, FaHandshake, FaBell, FaSearch, FaFilter, FaSort, FaEllipsisV, FaUserFriends, FaCalendarAlt, FaTag, FaTrophy, FaFire, FaEye } from "react-icons/fa";

// 🔥 ADD THIS HELPER FUNCTION TOP (after imports)
const getOwnerId = (ownerId) => {
  return typeof ownerId === "object" ? ownerId._id : ownerId;
};

const getOwnerName = (ownerId) => {
  return typeof ownerId === "object" ? ownerId.fullName : "User";
};

const getOwnerPic = (ownerId) => {
  return typeof ownerId === "object"
    ? ownerId.profilePicture
    : null;
};

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myProjects, setMyProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [requests, setRequests] = useState({ projectId: null, data: [] });

  const [form, setForm] = useState({
    title: "",
    description: "",
    maxMembers: "",
    skillsRequired: "",
    status: "open"
  });

  const fetchProjects = async () => {
    try {
      const myRes = await axios.get("/projects/my-projects");
      const appliedRes = await axios.get("/projects/applied-projects");

      setMyProjects(myRes.data.projects);
      setAppliedProjects(appliedRes.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    await axios.post("/projects", {
      title: form.title,
      description: form.description,
      maxMembers: form.maxMembers,
      skillsRequired: form.skillsRequired.split(","),
      status: form.status
    });

    setShowForm(false);
    fetchProjects();
  };

  const startEdit = (p) => {
    setEditingProject(p.projectId);
    setForm({
      title: p.title,
      description: p.description,
      maxMembers: p.maxMembers,
      skillsRequired: p.skillsRequired.join(","),
      status: p.status
    });
  };

  const updateProject = async () => {
    await axios.put(`/projects/${editingProject}`, {
      title: form.title,
      description: form.description,
      maxMembers: form.maxMembers,
      skillsRequired: form.skillsRequired.split(","),
      status: form.status
    });

    setEditingProject(null);
    fetchProjects();
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/projects/${projectId}`);
      fetchProjects();
      alert("Project deleted ✅");
    } catch (err) {
      console.error(err);
    }
  };

  const getRequests = async (projectId) => {
    const res = await axios.get(`/projects/${projectId}/requests`);
    setRequests({ projectId, data: res.data.requests });
  };

  const accept = async (projectId, requestId) => {
    await axios.put(`/projects/${projectId}/requests/${requestId}/accept`);
    getRequests(projectId);
    fetchProjects();
  };

  const reject = async (projectId, requestId) => {
    await axios.put(`/projects/${projectId}/requests/${requestId}/reject`);
    getRequests(projectId);
    fetchProjects();
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Project Management Hub
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create, manage, and collaborate on innovative projects with talented peers
          </p>
        </div>

        {/* Create Project Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaPlus className="text-xl" />
            Create New Project
          </button>
        </div>

        {/* Create/Edit Project Form */}
        {(showForm || editingProject) && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-black">
                  {editingProject ? "Edit Project" : "Create New Project"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Project Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all resize-none bg-gray-50"
                    rows="4"
                    placeholder="Describe your project goals and requirements"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Max Members</label>
                    <input
                      value={form.maxMembers}
                      onChange={(e) => setForm({ ...form, maxMembers: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                      placeholder="Maximum team members"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Project Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                    >
                      <option value="open">Open for Applications</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Skills Required</label>
                  <input
                    value={form.skillsRequired}
                    onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                    placeholder="React, Node.js, Python (comma separated)"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={editingProject ? updateProject : handleCreate}
                  className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                  }}
                  className="flex-1 bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Projects Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">My Projects</h2>
            <p className="text-gray-600">Projects you've created and manage</p>
          </div>

          {myProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaProjectDiagram className="text-black text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No Projects Yet</h3>
              <p className="text-gray-600 mb-8">Start by creating your first project to collaborate with others</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-black text-white px-8 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300 font-semibold"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myProjects.map((p) => (
                <div key={p.projectId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                  
                  {/* Project Header */}
                  <div className="bg-black p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                        {p.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm flex items-center gap-1">
                          <FaHeart />
                          {p.likes?.length || 0}
                        </span>
                        <span className="text-gray-300 text-sm flex items-center gap-1">
                          <FaStar />
                          {p.favorites?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Owner Info */}
                    <div
                      className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors"
                      onClick={() => navigate(`/profile/${p.ownerId._id || p.ownerId}`)}
                    >
                      <img
                        src={p.ownerId.profilePicture || "https://via.placeholder.com/40"}
                        className="w-12 h-12 rounded-full border-2 border-gray-300"
                      />
                      <div>
                        <div className="font-semibold text-black">{p.ownerId.fullName}</div>
                        <div className="text-sm text-gray-500">Project Owner</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 line-clamp-3">{p.description}</p>

                    {/* Project Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Members</span>
                        <span className="text-sm font-semibold text-black">
                          {p.members?.length || 0} / {p.maxMembers}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {p.skillsRequired && p.skillsRequired.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {p.skillsRequired.slice(0, 3).map((skill, i) => (
                            <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-xs font-semibold">
                              {skill}
                            </span>
                          ))}
                          {p.skillsRequired.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                              +{p.skillsRequired.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => startEdit(p)}
                        className="flex-1 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
                      >
                        <FaEdit className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => getRequests(p.projectId)}
                        className="flex-1 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm"
                      >
                        <FaBell className="inline mr-1" />
                        Requests
                      </button>
                      <button
                        onClick={() => deleteProject(p.projectId)}
                        className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Requests Section */}
                    {requests.projectId === p.projectId && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                          <FaUserFriends className="text-black" />
                          Join Requests ({requests.data.length})
                        </h4>
                        {requests.data.length === 0 ? (
                          <p className="text-gray-500 text-sm">No requests yet</p>
                        ) : (
                          <div className="space-y-3">
                            {requests.data.map((r) => (
                              <div key={r._id} className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center justify-between">
                                  <div
                                    className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                                    onClick={() => navigate(`/profile/${r.studentId._id}`)}
                                  >
                                    <img
                                      src={r.studentId?.profilePicture || "https://via.placeholder.com/32"}
                                      className="w-10 h-10 rounded-full border border-gray-300"
                                    />
                                    <div>
                                      <div className="font-semibold text-black">{r.studentId?.fullName || r.fullName}</div>
                                      <div className="text-sm text-gray-500">{r.email}</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => accept(p.projectId, r._id)}
                                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => reject(p.projectId, r._id)}
                                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applied Projects Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Applied Projects</h2>
            <p className="text-gray-600">Projects you've applied to join</p>
          </div>

          {appliedProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaSearch className="text-black text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No Applications Yet</h3>
              <p className="text-gray-600">Browse available projects and submit your applications</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appliedProjects.map((p) => {
                const myRequest = p.requests.find(
                  (r) => r.studentId._id === user._id
                );

                return (
                  <div key={p.projectId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                    
                    {/* Project Header */}
                    <div className="bg-black p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                          {p.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm flex items-center gap-1">
                            <FaHeart />
                            {p.likes?.length || 0}
                          </span>
                          <span className="text-gray-300 text-sm flex items-center gap-1">
                            <FaStar />
                            {p.favorites?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      {/* Owner Info */}
                      <div
                        className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors"
                        onClick={() => navigate(`/profile/${p.ownerId._id || p.ownerId}`)}
                      >
                        <img
                          src={p.ownerId.profilePicture || "https://via.placeholder.com/40"}
                          className="w-12 h-12 rounded-full border-2 border-gray-300"
                        />
                        <div>
                          <div className="font-semibold text-black">{p.ownerId.fullName}</div>
                          <div className="text-sm text-gray-500">Project Owner</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-6 line-clamp-3">{p.description}</p>

                      {/* Application Status */}
                      <div className="mb-4">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                          myRequest?.status === 'accepted' 
                            ? 'bg-gray-100 text-black' 
                            : myRequest?.status === 'rejected'
                            ? 'bg-gray-100 text-black'
                            : 'bg-gray-100 text-black'
                        }`}>
                          {myRequest?.status === 'accepted' && <FaCheckCircle />}
                          {myRequest?.status === 'rejected' && <FaTimesCircle />}
                          {myRequest?.status === 'pending' && <FaClock />}
                          {myRequest?.status ? myRequest.status.charAt(0).toUpperCase() + myRequest.status.slice(1) : 'Unknown'}
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Members</span>
                          <span className="text-sm font-semibold text-black">
                            {p.members?.length || 0} / {p.maxMembers}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      {p.skillsRequired && p.skillsRequired.length > 0 && (
                        <div className="mt-6">
                          <div className="flex flex-wrap gap-2">
                            {p.skillsRequired.slice(0, 3).map((skill, i) => (
                              <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-xs font-semibold">
                                {skill}
                              </span>
                            ))}
                            {p.skillsRequired.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                                +{p.skillsRequired.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;