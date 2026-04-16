import React from "react";

const Work = () => {
  const tasks = [
    { id: 1, title: "Finalize proposal", status: "Pending" },
    { id: 2, title: "Upload documents", status: "Completed" },
    { id: 3, title: "Team meeting", status: "In Progress" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workspace Dashboard</h1>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 shadow">
            <h2 className="font-semibold">{task.title}</h2>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>

export const addWorkspaceCodeSnippet = async (req, res) => {
  const { title, language } = req.body;

  res.status(200).json({
    message: "Code snippet added successfully",
    snippet: {
      title,
      language
    }
  });
};

export const getWorkspaceSnippets = async (req, res) => {
  res.status(200).json({
    snippets: []
  });
};


  );
  <div className="mt-6">
  <h2 className="text-xl font-semibold mb-2">Workspace Updates</h2>
  {notifications.map((note, index) => (
    <p key={index} className="text-sm border-b py-2">
      {note}
    </p>
  ))}
</div>
};


export default Work;