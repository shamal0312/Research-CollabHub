import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "../api/axios";
import {
  FaArrowLeft,
  FaFolder,
  FaComments,
  FaFileAlt,
  FaUsers,
  FaCalendarCheck,
  FaUserFriends,
  FaCode
} from "react-icons/fa";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);

  // 🔥 FETCH WORKSPACE
  const fetchWorkspace = async () => {
    try {
      const res = await axios.get(`/workspaces/${workspaceId}`);
      setWorkspace(res.data.workspace);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [workspaceId]);

  if (!workspace) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* PROFESSIONAL WORKSPACE HEADER */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{workspace.title}</h1>
              <p className="text-gray-300">{workspace.description}</p>
            </div>
            <button
              onClick={() => navigate("/workspace")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300"
            >
              <FaArrowLeft />
              <span>Back to Workspaces</span>
            </button>
          </div>
        </div>
      </div>

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
              <button 
                onClick={() => navigate(`/workspace/${workspaceId}/documents`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
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
              <button 
                onClick={() => navigate(`/code-lab/${workspaceId}`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaCode />
                Code Lab
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* WELCOME SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaFolder className="text-black text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">
              Welcome to {workspace.title}
            </h2>
            <p className="text-gray-600 text-lg">
              This is your workspace home page. From here, you can navigate to
              documents, tasks, meetings, and messages using the navigation bar above.
            </p>
          </div>
        </div>

        {/* WORKSPACE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <FaUserFriends className="text-black text-xl" />
              </div>
              <p className="text-sm text-gray-500 mb-2">Team Members</p>
              <p className="text-3xl font-bold text-black">
                {workspace.members?.length || 0}
              </p>
              <p className="text-xs text-gray-500">Active collaborators</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <FaCalendarCheck className="text-black text-xl" />
              </div>
              <p className="text-sm text-gray-500 mb-2">Created Date</p>
              <p className="text-lg font-semibold text-black">
                {new Date(workspace.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">Since inception</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <FaFolder className="text-black text-xl" />
              </div>
              <p className="text-sm text-gray-500 mb-2">Workspace ID</p>
              <p className="text-lg font-semibold text-black break-all">
                {workspace._id}
              </p>
              <p className="text-xs text-gray-500">Unique identifier</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <p className="text-lg font-semibold text-black">Active</p>
              <p className="text-xs text-gray-500">Workspace is live</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkspaceDetails;