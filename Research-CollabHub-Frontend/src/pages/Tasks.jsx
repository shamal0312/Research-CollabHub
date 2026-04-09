import { useEffect, useState } from "react";
import axios from "../../api/axios";

const Tasks = ({ workspaceId }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get(`/tasks/${workspaceId}`);
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    await axios.post("/tasks/create", {
      workspaceId,
      title,
      assignedTo: null
    });
    setTitle("");
    fetchTasks();
  };

  return (
    <div className="p-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2"
        placeholder="Task title"
      />
      <button onClick={createTask} className="bg-green-600 text-white px-3">
        Add
      </button>

      <ul className="mt-4">
        {tasks.map((t) => (
          <li key={t._id}>{t.title} - {t.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;