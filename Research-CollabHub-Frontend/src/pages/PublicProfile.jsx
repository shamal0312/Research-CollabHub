import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Header from "../components/Header";
import { FaGraduationCap, FaProjectDiagram, FaUsers } from "react-icons/fa";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [portfolioSlug, setPortfolioSlug] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/profile/public/${id}`);
      setUser(res.data.user);
      setPortfolioSlug(res.data.portfolioSlug);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const res = await axios.get("/projects");
      const filtered = res.data.projects.filter(
        (p) => p.ownerId?._id === id
      );
      setUserProjects(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUserProjects();
  }, [id]);

  const startChat = async () => {
    try {
      await axios.post("/conversations", {
        receiverId: user._id
      });

      navigate(`/messages/${user._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const goToPortfolio = () => {
    if (!portfolioSlug) {
      alert("This user has not created a portfolio yet");
      return;
    }

    navigate(`/portfolio/${portfolioSlug}`);
  };

  const requestToJoin = async (projectId) => {
    try {
      await axios.post(`/projects/${projectId}/request`);
      alert("Request sent successfully ");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-white">
      <Header />

      {/* COVER */}
      <div className="relative h-64 bg-gray-100">
        {user.coverPhoto && (
          <img src={user.coverPhoto} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* PROFILE HEADER */}
        <div className="flex gap-6 items-center -mt-5">
          <div className="relative -mt-14">
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              className="w-36 h-36 rounded-full border-4 border-white object-cover"
            />
          </div>

          <div className="flex-1 mt-6">
            <h1 className="text-3xl font-bold text-black">{user.fullName}</h1>
            <p className="text-gray-600">
              {user.universityName || "No university"}
            </p>

            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <FaGraduationCap />
                {user.faculty || "No faculty"}
              </span>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={startChat}
                className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                Message
              </button>

              <button
                onClick={goToPortfolio}
                className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-black">About</h2>
          <p className="text-gray-700 mt-3 leading-relaxed">
            {user.about || "No description available"}
          </p>
        </div>

        {/* SKILLS */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-black">Skills</h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added</p>
            )}
          </div>
        </div>

        {/* PROJECTS */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-black mb-6">Projects</h2>

          {userProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaProjectDiagram className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">No Projects Available</h3>
              <p className="text-gray-600">This user hasn't created any projects yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {userProjects.map((p) => (
                <div key={p.projectId} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-black mb-2">{p.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center ml-4">
                      <FaProjectDiagram className="text-gray-600" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-gray-500 text-sm" />
                        <span className="text-sm text-gray-600 font-medium">{p.members?.length || 0} / {p.maxMembers} members</span>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {p.status || "Active"}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {p.skillsRequired?.map((s, i) => (
                        <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-lg text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {p.status === "open" && (
                    <div className="mt-4">
                      <button
                        onClick={() => requestToJoin(p.projectId)}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Request to Join
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;