import { useEffect, useState } from "react";
import axios from "../api/axios";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { 
  FaCamera, 
  FaGraduationCap, 
  FaTimes, 
  FaPlus,
  FaUser,
  FaEnvelope,
  FaEdit,
  FaBriefcase,
  FaProjectDiagram,
  FaUsers,
  FaTrash,
  FaCheck,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaHeart,
  FaShare
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showInterestInput, setShowInterestInput] = useState(false);

  // NEW STATE (PROJECTS)
  const [myProjects, setMyProjects] = useState([]);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    const res = await axios.get("/profile");
    setUser(res.data.user);
    setForm(res.data.user);
  };

  // NEW FETCH PROJECTS
  const fetchMyProjects = async () => {
    try {
      const res = await axios.get("/projects/my-projects");
      setMyProjects(res.data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyProjects(); 
  }, []);

  const updateProfile = async () => {
    const res = await axios.put("/profile", form);
    setUser(res.data.user);
    setEdit(false);
  };

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append(type, file);

    const url =
      type === "profilePicture"
        ? "/profile/picture"
        : "/profile/cover";

    const res = await axios.put(url, formData);
    setUser(res.data.user);
  };

  const addSkill = async () => {
    if (!skillInput.trim()) return;
    const res = await axios.post("/profile/skill", { skill: skillInput });
    setUser(res.data.user);
    setSkillInput("");
    setShowSkillInput(false);
  };

  const removeSkill = async (skill) => {
    const res = await axios.delete("/profile/skill", {
      data: { skill }
    });
    setUser(res.data.user);
  };

  const addInterest = async () => {
    if (!interestInput.trim()) return;
    const res = await axios.post("/profile/interest", {
      interest: interestInput
    });
    setUser(res.data.user);
    setInterestInput("");
    setShowInterestInput(false);
  };

  const removeInterest = async (interest) => {
    const res = await axios.delete("/profile/interest", {
      data: { interest }
    });
    setUser(res.data.user);
  };

  const handlePortfolioClick = async () => {
    try {
      const res = await axios.get("/portfolio/me");
      navigate(`/portfolio/${res.data.portfolioSlug}`);
    } catch (err) {
      navigate("/create-portfolio");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
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

        <label className="absolute bottom-4 right-4 bg-black bg-opacity-80 p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-all">
          <FaCamera className="text-white" />
          <input
            type="file"
            onChange={(e) => uploadImage(e.target.files[0], "coverPhoto")}
            className="hidden"
          />
        </label>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* PROFILE HEADER */}
        <div className="flex gap-6 items-center -mt-5">
          <div className="relative -mt-14">
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              className="w-36 h-36 rounded-full border-4 border-white object-cover"
            />

            <label className="absolute bottom-2 right-2 bg-black bg-opacity-80 p-2 rounded-full text-white cursor-pointer hover:bg-opacity-90 transition-all">
              <FaCamera />
              <input
                type="file"
                onChange={(e) => uploadImage(e.target.files[0], "profilePicture")}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 mt-6">
            <h1 className="text-3xl font-bold text-black">{user.fullName}</h1>
            <p className="text-gray-600">{user.universityName}</p>

            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <FaGraduationCap />
                {user.faculty}
              </span>
              <span>
                Year {user.year} • Semester {user.semester}
              </span>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-colors">
                Connect
              </button>

              <button
                onClick={() => navigate(`/messages/${user._id}`)}
                className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                Message
              </button>

              <button
                onClick={() => navigate("/edit-profile")}
                className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                Edit Profile
              </button>

              <button
                onClick={handlePortfolioClick}
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
          <p className="text-gray-700 mt-3 leading-relaxed">{user.about}</p>
        </div>

        {/* SKILLS */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-black">Skills</h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {user.skills?.map((skill, i) => (
              <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {skill}
                <FaTimes onClick={()=>removeSkill(skill)} className="cursor-pointer text-gray-500 hover:text-black" />
              </span>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            {showSkillInput ? (
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e)=>setSkillInput(e.target.value)}
                  placeholder="Add skill..."
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                  autoFocus
                />
                <button onClick={addSkill} className="bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Add
                </button>
                <button onClick={() => {setShowSkillInput(false); setSkillInput("");}} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setShowSkillInput(true)} className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                <FaPlus />
              </button>
            )}
          </div>
        </div>

        {/* INTERESTS */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-black">Interests</h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {user.interests?.map((i, index) => (
              <span key={index} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {i}
                <FaTimes onClick={()=>removeInterest(i)} className="cursor-pointer text-gray-500 hover:text-black" />
              </span>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            {showInterestInput ? (
              <div className="flex gap-2">
                <input
                  value={interestInput}
                  onChange={(e)=>setInterestInput(e.target.value)}
                  placeholder="Add interest..."
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                  autoFocus
                />
                <button onClick={addInterest} className="bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Add
                </button>
                <button onClick={() => {setShowInterestInput(false); setInterestInput("");}} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setShowInterestInput(true)} className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                <FaPlus />
              </button>
            )}
          </div>
        </div>

        {/*  NEW: MY PROJECTS SECTION */}
        <div className="mt-8">
          <h2 className="font-bold text-xl text-black mb-6">My Projects</h2>

          {myProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaProjectDiagram className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">No Projects Yet</h3>
              <p className="text-gray-600">Start building your project portfolio by creating your first project</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myProjects.map((p) => (
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
                        Active
                      </div>
                    </div>

                    {/* SKILLS */}
                    <div className="flex flex-wrap gap-2">
                      {p.skillsRequired?.map((s, i) => (
                        <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-lg text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 font-semibold"
          >
            Logout
          </button>
        </div>

      </div>
    </div>

    
  );
};

export default Profile;