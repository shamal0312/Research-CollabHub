import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaCheck, FaTimes, FaClock } from "react-icons/fa";

const AdminResults = () => {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchResults = async () => {
    try {
      const res = await axios.get("/portfolio/admin/results", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("RESULTS:", res.data);
      setData(res.data);

    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const approve = async (portfolioId, resultId) => {
    await axios.put(
      `/portfolio/result/${portfolioId}/approve/${resultId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchResults();
  };

  const reject = async (portfolioId, resultId) => {
    await axios.put(
      `/portfolio/result/${portfolioId}/reject/${resultId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchResults();
  };

  // Filter data based on selected filter
  const filteredData = data.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  // Get counts for each status
  const statusCounts = {
    all: data.length,
    pending: data.filter(item => item.status === 'pending').length,
    approved: data.filter(item => item.status === 'approved').length,
    rejected: data.filter(item => item.status === 'rejected').length
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-white text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Result Verification</h1>
                <p className="text-gray-400 text-sm">Review all academic results</p>
              </div>
            </div>
            <div className="bg-white text-black px-4 py-2 rounded-lg">
              {statusCounts[filter]} Results
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* FILTER BUTTONS */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-black" />
            <span className="font-semibold text-black">Filter Results:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <FaClock className="text-sm" />
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <FaCheck className="text-sm" />
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                filter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <FaTimes className="text-sm" />
              Rejected ({statusCounts.rejected})
            </button>
          </div>
        </div>
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              {filter === 'all' ? 'No Results Found' : `No ${filter} results`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'No results available' : `No ${filter} results to display`}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((r) => (
            <div key={r._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              {/* Header */}
              <div className={`p-4 border-b ${
                r.status === 'approved' ? 'bg-green-50 border-green-100' :
                r.status === 'rejected' ? 'bg-red-50 border-red-100' :
                'bg-yellow-50 border-yellow-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-black">{r.fullName}</h3>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    r.status === 'approved' ? 'bg-green-100 text-green-700' :
                    r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Result Title</p>
                  <p className="font-semibold text-black">{r.title}</p>
                </div>

                {/* Document Preview */}
                {r.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={r.imageUrl}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedImage(r.imageUrl)}
                    />
                  </div>
                )}

                {/* Modules */}
                {(r.modules || []).length > 0 && (
                  <div className="mb-4">
                    <div className="space-y-2">
                      {(r.modules || []).slice(0, 2).map((m, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-black text-sm mb-1">{m.name}</p>
                              <p className="text-gray-500 text-xs mb-1 line-clamp-1">{m.description}</p>
                            </div>
                            <div className="ml-3">
                              <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold">{m.grade}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(r.modules || []).length > 2 && (
                        <p className="text-xs text-gray-500 text-center">+{(r.modules || []).length - 2} more modules</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Only show for pending */}
                {r.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(r.portfolioId, r._id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(r.portfolioId, r._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Enhanced Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                ×
              </button>
              <img
                src={selectedImage}
                className="rounded-lg shadow-2xl max-w-full max-h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResults;