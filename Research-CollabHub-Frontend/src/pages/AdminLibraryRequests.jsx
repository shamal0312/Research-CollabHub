import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLibraryRequests = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const token = localStorage.getItem("token");

  // 🔥 FETCH PENDING DOCS
  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/library/admin/pending", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setDocs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ APPROVE
  const approveDoc = async (id) => {
    await fetch(`http://localhost:5000/api/library/admin/approve/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchPending();
  };

  // ❌ REJECT
  const rejectDoc = async (id) => {
    await fetch(`http://localhost:5000/api/library/admin/reject/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="text-xl mb-4"
      >
        ←
      </button>

      <h1 className="text-2xl font-bold mb-4">Library Requests</h1>

      {docs.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        docs.map((doc) => (
          <div key={doc._id} className="border p-4 mb-3 rounded shadow">

            <h2 className="font-bold">{doc.title}</h2>
            <p>{doc.description}</p>

            <p className="text-sm text-gray-500">
              Year {doc.year} | Semester {doc.semester}
            </p>

            <p className="text-xs text-gray-400">
              Field: {doc.field}
            </p>

            <div className="flex gap-3 mt-3">

              <button
                onClick={() => approveDoc(doc._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectDoc(doc._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default AdminLibraryRequests;