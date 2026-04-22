import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { 
  FaPlus, 
  FaTrash, 
  FaFolder, 
  FaComments, 
  FaFileAlt, 
  FaCalendarCheck, 
  FaUsers, 
  FaTimes,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight
} from "react-icons/fa";

const BASE_URL = "http://localhost:5000/api";

const WorkspaceTasks = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: ""
  });

  const token = localStorage.getItem("token");

  // 🔥 FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH MEMBERS
  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/workspaces/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMembers(res.data.workspace.members);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 CREATE TASK
  const createTask = async () => {
    try {
      await axios.post(
        `${BASE_URL}/tasks/create`,
        { ...form, workspaceId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowModal(false);
      setForm({ title: "", description: "", assignedTo: "", dueDate: "" });

      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (taskId, status) => {
    try {
      await axios.put(
        `${BASE_URL}/tasks/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete task?")) return;

    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMembers();
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
              <button 
                onClick={() => navigate(`/workspace/${workspaceId}/meetings`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaCalendarCheck />
                Meetings
              </button>
              <button className="flex items-center gap-2 text-white font-semibold">
                <FaUsers />
                Tasks
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* TASKS HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Task Board</h1>
              <p className="text-gray-600">Manage and track team tasks in real-time</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");

                    const response = await fetch(
                      `http://localhost:5000/api/tasks/certificate/${workspaceId}`,
                      {
                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${token}` 
                        }
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed");
                    }

                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "certificate.pdf";

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    window.URL.revokeObjectURL(url);

                  } catch (error) {
                    alert("Failed to generate certificate");
                  }
                }}
                className="bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
              >
                Generate Certificate
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus />
                Create Task
              </button>
            </div>
          </div>
        </div>

        {/* JIRA-STYLE KANBAN BOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* TODO COLUMN */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200">
            <div className="bg-gray-100 rounded-t-2xl p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-black flex items-center gap-2">
                  <FaExclamationCircle className="text-gray-600" />
                  To Do
                </h3>
                <span className="bg-gray-300 text-black text-xs px-2 py-1 rounded-full font-semibold">
                  {tasks.filter(t => t.status === "ToDo").length}
                </span>
              </div>
            </div>
            <div className="p-4 min-h-[400px] space-y-3">
              {tasks.filter(t => t.status === "ToDo").map(t => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/workspace/${workspaceId}/tasks/${t._id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-gray-500">TASK-{t._id?.slice(-6)}</span>
                    <FaArrowRight className="text-gray-400 text-xs group-hover:text-black transition-colors" />
                  </div>
                  <h4 className="font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <FaUser className="text-gray-400 text-xs" />
                    <p className="text-xs text-gray-600">
                      {t.assignedTo?.fullName || "Unassigned"}
                    </p>
                  </div>
                  {t.dueDate && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400 text-xs" />
                      <p className="text-xs text-gray-600">
                        {new Date(t.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200">
            <div className="bg-gray-100 rounded-t-2xl p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-black flex items-center gap-2">
                  <FaClock className="text-gray-600" />
                  In Progress
                </h3>
                <span className="bg-gray-300 text-black text-xs px-2 py-1 rounded-full font-semibold">
                  {tasks.filter(t => t.status === "In Progress").length}
                </span>
              </div>
            </div>
            <div className="p-4 min-h-[400px] space-y-3">
              {tasks.filter(t => t.status === "In Progress").map(t => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/workspace/${workspaceId}/tasks/${t._id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-gray-500">TASK-{t._id?.slice(-6)}</span>
                    <FaArrowRight className="text-gray-400 text-xs group-hover:text-black transition-colors" />
                  </div>
                  <h4 className="font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <FaUser className="text-gray-400 text-xs" />
                    <p className="text-xs text-gray-600">
                      {t.assignedTo?.fullName || "Unassigned"}
                    </p>
                  </div>
                  {t.dueDate && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400 text-xs" />
                      <p className="text-xs text-gray-600">
                        {new Date(t.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200">
            <div className="bg-gray-100 rounded-t-2xl p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-black flex items-center gap-2">
                  <FaCheckCircle className="text-gray-600" />
                  Done
                </h3>
                <span className="bg-gray-300 text-black text-xs px-2 py-1 rounded-full font-semibold">
                  {tasks.filter(t => t.status === "Done").length}
                </span>
              </div>
            </div>
            <div className="p-4 min-h-[400px] space-y-3">
              {tasks.filter(t => t.status === "Done").map(t => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/workspace/${workspaceId}/tasks/${t._id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-gray-500">TASK-{t._id?.slice(-6)}</span>
                    <FaArrowRight className="text-gray-400 text-xs group-hover:text-black transition-colors" />
                  </div>
                  <h4 className="font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <FaUser className="text-gray-400 text-xs" />
                    <p className="text-xs text-gray-600">
                      {t.assignedTo?.fullName || "Unassigned"}
                    </p>
                  </div>
                  {t.dueDate && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400 text-xs" />
                      <p className="text-xs text-gray-600">
                        {new Date(t.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black flex items-center gap-2">
                <FaPlus />
                Create New Task
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
                <label className="block text-sm font-semibold text-black mb-2">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Description</label>
                <textarea
                  placeholder="Enter task description"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Assign To</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                >
                  <option value="">Select team member</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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
                onClick={createTask}
                className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceTasks;