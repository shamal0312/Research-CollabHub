import React from "react";

const PR = () => {
  const projects = [
    { id: 1, title: "AI Research Platform" },
    { id: 2, title: "Library Management System" },
    { id: 3, title: "Student Collaboration Hub" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project Resources</h1>

      <div className="grid gap-4">
        {projects.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow">
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PR;