import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaUsers, FaProjectDiagram, FaClipboardCheck, FaComments, FaSignOutAlt, FaChartLine, FaShieldAlt, FaCog } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ✅ LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");

      logout();
      localStorage.removeItem("token");

      navigate("/login", { replace: true });
      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-black text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">System Management & Analytics</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-black text-xl" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <h2 className="text-gray-500 text-sm font-medium mb-1">Total Users</h2>
            <p className="text-3xl font-bold text-black">128</p>
            <div className="mt-2 text-xs text-gray-500">+12% from last month</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaProjectDiagram className="text-black text-xl" />
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <h2 className="text-gray-500 text-sm font-medium mb-1">Projects</h2>
            <p className="text-3xl font-bold text-black">54</p>
            <div className="mt-2 text-xs text-gray-500">+8% from last month</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaClipboardCheck className="text-black text-xl" />
              </div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <h2 className="text-gray-500 text-sm font-medium mb-1">Pending Results</h2>
            <p className="text-3xl font-bold text-black">17</p>
            <div className="mt-2 text-xs text-gray-500">Requires attention</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaComments className="text-black text-xl" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <h2 className="text-gray-500 text-sm font-medium mb-1">Active Chats</h2>
            <p className="text-3xl font-bold text-black">32</p>
            <div className="mt-2 text-xs text-gray-500">Real-time conversations</div>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaCog className="text-black" />
            </div>
            <h2 className="font-bold text-xl text-black">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button
              onClick={() => navigate("/admin/results")}
              className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
            >
              <FaClipboardCheck />
              <span>Result Verification</span>
            </button>

            <button
              onClick={() => alert("User management coming soon")}
              className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
            >
              <FaUsers />
              <span>Manage Users</span>
            </button>

            <button
              onClick={() => alert("Project moderation coming soon")}
              className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
            >
              <FaProjectDiagram />
              <span>Moderate Projects</span>
            </button>

          </div>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-black" />
            </div>
            <h2 className="font-bold text-xl text-black">System Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New user registrations</span>
                  <span className="text-black font-medium">24 today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Project submissions</span>
                  <span className="text-black font-medium">8 today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Result uploads</span>
                  <span className="text-black font-medium">12 today</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-3">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Server status</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600 font-medium">Healthy</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">API response time</span>
                  <span className="text-black font-medium">120ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;