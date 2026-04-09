import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaArrowRight, FaBriefcase, FaCalendar, FaUser, FaClock, FaPlus, FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";

const Workspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();

  // FETCH WORKSPACES
  const fetchWorkspaces = async () => {
    try {
      const res = await axios.get("/workspaces");
      setWorkspaces(res.data.workspaces);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* PROFESSIONAL WORKSPACE HEADER */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Your Workspaces</h1>
              <p className="text-gray-300 text-lg">
                Collaborate with your team in active projects
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-white font-semibold">{workspaces.length} Active Workspaces</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspaces..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2">
                <FaFilter />
                Filter
              </button>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2">
                <FaSortAmountDown />
                Sort
              </button>
            </div>
          </div>
        </div>

        {workspaces.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaBriefcase className="text-4xl text-black" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Workspaces Yet</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Workspaces will be automatically created when your projects reach maximum members. Start collaborating on projects to see your workspaces here!
            </p>
            <button
              onClick={() => navigate("/projects")}
              className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
            >
              <FaPlus />
              Browse Projects
            </button>
          </div>
        ) : (
          /* WORKSPACES GRID */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {workspaces.map((w) => (
              <div
                key={w.workspaceId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group"
              >
                {/* WORKSPACE HEADER */}
                <div className="bg-gray-100 h-2"></div>
                
                <div className="p-8">
                  {/* TITLE */}
                  <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-black transition-colors">
                    {w.title}
                  </h3>

                  {/* WORKSPACE METADATA */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaUsers className="text-black" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{w.members?.length} Members</p>
                        <p className="text-sm text-gray-500">Active collaborators</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaUser className="text-black" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{w.ownerId?.fullName}</p>
                        <p className="text-sm text-gray-500">Workspace Owner</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaCalendar className="text-black" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Active Now</p>
                        <p className="text-sm text-gray-500">Last activity today</p>
                      </div>
                    </div>
                  </div>

                  {/* WORKSPACE STATS */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-black">12</p>
                      <p className="text-xs text-gray-500">Tasks</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-black">5</p>
                      <p className="text-xs text-gray-500">Files</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-black">89%</p>
                      <p className="text-xs text-gray-500">Progress</p>
                    </div>
                  </div>

                  {/* MEMBERS AVATARS */}
                  <div className="flex items-center mb-6">
                    <div className="flex -space-x-2">
                      {w.members?.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white bg-black flex items-center justify-center text-white text-sm font-semibold"
                        >
                          {member.fullName?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {w.members?.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                          +{w.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="ml-3 text-sm text-gray-500">
                      {w.members?.length} collaborators
                    </span>
                  </div>

                  {/* ACTION BUTTON */}
                  <button
                    onClick={() => navigate(`/workspace/${w.workspaceId}`)}
                    className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group-hover:scale-105 transform"
                  >
                    Enter Workspace
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER STATS */}
        {workspaces.length > 0 && (
          <div className="mt-12 bg-black rounded-2xl shadow-xl p-8 text-white">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold mb-2">{workspaces.length}</p>
                <p className="text-gray-300">Total Workspaces</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">
                  {workspaces.reduce((acc, w) => acc + (w.members?.length || 0), 0)}
                </p>
                <p className="text-gray-300">Team Members</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">24</p>
                <p className="text-gray-300">Active Projects</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">92%</p>
                <p className="text-gray-300">Team Efficiency</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;