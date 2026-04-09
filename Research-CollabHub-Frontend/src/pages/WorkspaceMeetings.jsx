import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { FaVideo, FaPlus, FaTrash, FaExternalLinkAlt, FaCalendarAlt, FaUser, FaTimes, FaFolder, FaComments, FaFileAlt, FaUsers } from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api";

const WorkspaceMeetings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    time: "",
    meetingLink: ""
  });

  const token = localStorage.getItem("token");

  // 🔥 FETCH
  const fetchMeetings = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/workspaces/${workspaceId}/meetings`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMeetings(res.data.meetings);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 CREATE
  const handleCreate = async () => {
    try {
      await axios.post(
        `${BASE_URL}/workspaces/${workspaceId}/meetings`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowModal(false);
      setForm({ title: "", time: "", meetingLink: "" });

      fetchMeetings();
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  // 🔥 DELETE
  const handleDelete = async (meetingId, creatorId) => {
    const userId = JSON.parse(atob(token.split(".")[1])).id;

    if (creatorId !== userId) {
      alert("Only creator can delete ❌");
      return;
    }

    if (!window.confirm("Delete this meeting?")) return;

    try {
      await axios.delete(
        `${BASE_URL}/workspaces/${workspaceId}/meetings/${meetingId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

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
              <button 
                onClick={() => navigate(`/workspace/${workspaceId}/documents`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaFileAlt />
                Documents
              </button>
              <button className="flex items-center gap-2 text-white font-semibold">
                <FaVideo />
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
        
        {/* MEETINGS HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Workspace Meetings</h1>
              <p className="text-gray-600">Schedule and manage team meetings</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* MEETINGS LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((m) => (
            <div key={m._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group">
              <div className="p-6">
                {/* Meeting Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <FaVideo className="text-black text-xl" />
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(m.time).toLocaleDateString()}
                  </span>
                </div>

                {/* Meeting Title */}
                <h3 className="text-lg font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
                  {m.title}
                </h3>

                {/* Meeting Time */}
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <FaCalendarAlt className="text-sm" />
                  <span className="text-sm">
                    {new Date(m.time).toLocaleString()}
                  </span>
                </div>

                {/* Created By */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-black text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">
                      {m.createdBy?.fullName || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">Meeting Creator</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a
                    href={m.meetingLink}
                    target="_blank"
                    className="flex-1 bg-black text-white px-3 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    Join Meeting
                  </a>

                  <button
                    onClick={() => handleDelete(m._id, m.createdBy?._id)}
                    className="bg-black text-white px-3 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {meetings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaVideo className="text-black text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">No Meetings Scheduled</h3>
            <p className="text-gray-600 mb-8">Start by scheduling your first team meeting</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-8 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              Schedule First Meeting
            </button>
          </div>
        )}

      </div>

      {/* SCHEDULE MEETING MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black flex items-center gap-2">
                <FaVideo />
                Schedule Meeting
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Meeting Title</label>
                <input
                  type="text"
                  placeholder="Enter meeting title"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Meeting Link</label>
                <input
                  type="text"
                  placeholder="https://zoom.us/meeting/..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Create Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceMeetings;