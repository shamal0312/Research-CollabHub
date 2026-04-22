import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaArrowLeft, FaUserCheck, FaUserTimes, FaRobot, FaStar, FaCheckCircle, FaTimesCircle, FaUser, FaEnvelope, FaTrophy } from "react-icons/fa";

const ProjectRequests = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  // 🔥 NEW STATE (ADDED)
  const [ranking, setRanking] = useState([]);
  const [showRanking, setShowRanking] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/projects/${projectId}/requests`);
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    }
  };

  const accept = async (requestId) => {
    try {
      await axios.put(`/projects/${projectId}/requests/${requestId}/accept`);
      alert("Request accepted successfully ✅");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to accept request ❌");
    }
  };

  const reject = async (requestId) => {
    try {
      await axios.put(`/projects/${projectId}/requests/${requestId}/reject`);
      alert("Request rejected successfully ❌");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to reject request ❌");
    }
  };

  // 🔥 RUN AUTO SELECT (ADDED)
  const runAutoSelect = async () => {
    try {
      const res = await axios.post(`/projects/${projectId}/auto-select`);
      setRanking(res.data.candidates);
      setShowRanking(true);
    } catch (err) {
      console.error(err);
      alert("Failed to run smart selection");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  // 🔥 SPLIT DATA
  const pending = requests.filter(r => r.status === "pending");
  const accepted = requests.filter(r => r.status === "accepted");
  const rejected = requests.filter(r => r.status === "rejected");

  const renderCard = (r) => (
    <div key={r._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            onClick={() => navigate(`/profile/public/${r.studentId?._id}`)}
            className="font-bold text-black text-lg cursor-pointer hover:text-gray-700 transition-colors mb-1"
          >
            {r.studentId?.fullName || "User"}
          </h3>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <FaEnvelope className="text-xs" />
            {r.email || "No email"}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
          r.status === "accepted" 
            ? "bg-black text-white" 
            : r.status === "rejected"
            ? "bg-gray-200 text-gray-700"
            : "border border-gray-300 text-gray-600 bg-white"
        }`}>
          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => accept(r._id)}
          disabled={r.status !== "pending"}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 h-10 ${
            r.status !== "pending"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {r.status === "pending" ? "Accept" : "Accepted"}
        </button>

        <button
          onClick={() => reject(r._id)}
          disabled={r.status !== "pending"}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 h-10 ${
            r.status !== "pending"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-black border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {r.status === "pending" ? "Reject" : "Rejected"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-medium">Back</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold mb-1">
                Project Requests
              </h1>
              <p className="text-gray-400 text-sm">
                Manage collaboration requests
              </p>
            </div>

            <div className="w-24"></div>
          </div>

          {/* SMART SELECTION BUTTON */}
          <div className="flex justify-center mt-6">
            <button
              onClick={runAutoSelect}
              className="bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md text-sm"
            >
              <FaRobot className="text-base" />
              Smart Selection
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* RANKING SECTION */}
        {showRanking && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaTrophy className="text-white" />
                </div>
                Smart Ranking Results
              </h2>
              <button
                onClick={() => setShowRanking(false)}
                className="bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {ranking.map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                          {c.studentId?.fullName}
                          {c.isTop && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <FaStar className="text-xs" />
                              TOP CANDIDATE
                            </span>
                          )}
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-600">Score</p>
                            <p className="text-xl font-bold text-black">{c.score}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-600">Match</p>
                            <p className="text-xl font-bold text-black">{c.percentage}%</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-600">Skills</p>
                            <p className="text-sm font-medium text-black">
                              {c.matchedSkills?.join(", ") || "None"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATUS SECTIONS */}
        <div className="space-y-10">
          {/* PENDING REQUESTS */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <h2 className="text-xl font-semibold text-black">
                Pending Requests ({pending.length})
              </h2>
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <FaUser className="text-gray-500 text-lg" />
                </div>
                <p className="text-gray-600 font-medium">No pending requests</p>
                <p className="text-gray-500 text-sm mt-1">All requests have been processed</p>
              </div>
            ) : (
              <div className="space-y-3">{pending.map(renderCard)}</div>
            )}
          </div>

          {/* ACCEPTED REQUESTS */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <h2 className="text-xl font-semibold text-black">
                Accepted ({accepted.length})
              </h2>
            </div>
            {accepted.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <FaCheckCircle className="text-gray-500 text-lg" />
                </div>
                <p className="text-gray-600 font-medium">No accepted requests</p>
                <p className="text-gray-500 text-sm mt-1">Accept requests to collaborate</p>
              </div>
            ) : (
              <div className="space-y-3">{accepted.map(renderCard)}</div>
            )}
          </div>

          {/* REJECTED REQUESTS */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-600">
                Rejected ({rejected.length})
              </h2>
            </div>
            {rejected.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <FaTimesCircle className="text-gray-500 text-lg" />
                </div>
                <p className="text-gray-600 font-medium">No rejected requests</p>
                <p className="text-gray-500 text-sm mt-1">All requests are still under consideration</p>
              </div>
            ) : (
              <div className="space-y-3">{rejected.map(renderCard)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRequests;