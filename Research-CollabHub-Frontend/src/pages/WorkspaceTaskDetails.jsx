import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { 
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaEdit
} from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api";

const WorkspaceTaskDetails = () => {
  const { taskId, workspaceId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const token = localStorage.getItem("token");

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const found = res.data.tasks.find(t => t._id === taskId);
      setTask(found);

    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (status) => {
    await axios.put(
      `${BASE_URL}/tasks/${taskId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchTask();
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete task?")) return;

    await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    navigate(`/workspace/${workspaceId}/tasks`);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!task) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* TASK DETAILS HEADER */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <button 
              onClick={() => navigate(`/workspace/${workspaceId}/tasks`)} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300"
            >
              <FaArrowLeft />
              <span>Back to Tasks</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Task ID:</span>
              <span className="bg-gray-800 px-3 py-1 rounded-lg text-sm font-mono">
                TASK-{taskId?.slice(-6)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TASK MAIN CONTENT */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          
          {/* Task Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black mb-3 flex items-center gap-3">
                {task.status === "ToDo" && <FaExclamationTriangle className="text-gray-600" />}
                {task.status === "In Progress" && <FaHourglassHalf className="text-gray-600" />}
                {task.status === "Done" && <FaCheckCircle className="text-gray-600" />}
                {task.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {task.description}
              </p>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
              <FaEdit className="text-black text-xl" />
            </div>
          </div>

          {/* Task Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Assigned To */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-gray-600" />
                <span className="text-sm font-semibold text-black">Assigned To</span>
              </div>
              <p className="text-black font-medium">
                {task.assignedTo?.fullName || "Unassigned"}
              </p>
            </div>

            {/* Created By */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-gray-600" />
                <span className="text-sm font-semibold text-black">Created By</span>
              </div>
              <p className="text-black font-medium">
                {task.createdBy?.fullName || "Unknown"}
              </p>
            </div>

            {/* Created Date */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-gray-600" />
                <span className="text-sm font-semibold text-black">Created Date</span>
              </div>
              <p className="text-black font-medium">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Due Date */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-gray-600" />
                <span className="text-sm font-semibold text-black">Due Date</span>
              </div>
              <p className="text-black font-medium">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
              </p>
            </div>

          </div>

          {/* Status Management */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-black">Task Status:</label>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                >
                  <option value="ToDo">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              
              <button
                onClick={deleteTask}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaTrash />
                Delete Task
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WorkspaceTaskDetails;