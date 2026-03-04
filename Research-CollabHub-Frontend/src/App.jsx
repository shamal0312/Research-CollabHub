import React, { useState } from "react";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-blue-600">
        Research CollabHub Frontend 🚀
      </h1>

      <div className="mt-5">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-2">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;