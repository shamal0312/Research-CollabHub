import React, { useState } from "react";

const AISkillMatch = () => {
  const [score] = useState(82);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Skill Matching</h1>
      <p>Your project compatibility score: {score}%</p>
      <p>Status: Highly Recommended</p>
    </div>
  );
};

export default AISkillMatch;