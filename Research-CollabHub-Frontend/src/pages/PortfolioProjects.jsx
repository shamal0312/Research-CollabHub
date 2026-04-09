import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext"; // ✅ ADD
import { 
  FaUser,
  FaPhone,
  FaProjectDiagram,
  FaGraduationCap,
  FaTools,
  FaAward,
  FaPlus,
  FaGithub,
  FaExternalLinkAlt,
  FaTrash,
  FaCode,
  FaImage
} from "react-icons/fa";

const PortfolioProjects = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  // 🔥 FETCH PORTFOLIO
  const fetchPortfolio = async () => {
    const res = await axios.get(`/portfolio/public/${slug}`);
    setPortfolio(res.data);
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  // 🔥 ADD PROJECT
  const addProject = async () => {
    if (!title) return alert("Title required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("githubLink", githubLink);
    formData.append("demoLink", demoLink);
    formData.append("technologies", technologies);
    if (image) formData.append("image", image);

    try {
      await axios.post("/portfolio/project", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Project added ✅");

      setTitle("");
      setDescription("");
      setGithubLink("");
      setDemoLink("");
      setTechnologies("");
      setImage(null);

      fetchPortfolio();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE PROJECT
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await axios.delete(`/portfolio/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchPortfolio();

    } catch (err) {
      console.error(err);
    }
  };

  if (!portfolio) return <p>Loading...</p>;
 const isOwner = user?._id === portfolio?.ownerId;
  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* PROFESSIONAL NAVIGATION */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate(`/portfolio/${slug}`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaUser />
                About
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/contact`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaPhone />
                Contact
              </button>
              <button className="flex items-center gap-2 text-white font-semibold">
                <FaProjectDiagram />
                Projects
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/results`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaAward />
                Results
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/skills`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaTools />
                Skills
              </button>
              <button 
                onClick={() => navigate(`/portfolio/${slug}/certificates`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <FaGraduationCap />
                Certificates
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ADD PROJECT FORM */}
    {isOwner && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaCode className="text-gray-600" />
              Add New Project
            </h2>
            <p className="text-gray-600">Showcase your development projects and technical expertise</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Project Title</label>
              <input
                type="text"
                placeholder="e.g., E-commerce Platform"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Technologies</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-2">Project Description</label>
            <textarea
              placeholder="Describe your project, its features, and your role in development..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50 h-32 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">GitHub Repository</label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Live Demo (Optional)</label>
              <input
                type="url"
                placeholder="https://project-demo.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-2">Project Screenshot</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FaImage />
                  <span>{image.name}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={addProject}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Add Project
          </button>
        </div>
    )}

        {/* DISPLAY PROJECTS */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaProjectDiagram className="text-gray-600" />
              Project Portfolio
            </h2>
            <p className="text-gray-600">Your completed development projects</p>
          </div>

          {portfolio.projects?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.projects.map((p) => (
                <div key={p._id} className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  
                  {/* Project Image */}
                  {p.image && (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-3 leading-tight">
                      {p.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {p.description}
                    </p>

                    {/* Technologies */}
                    {p.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.technologies.map((t, i) => (
                          <span key={i} className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        {p.githubLink && (
                          <a
                            href={p.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium text-sm"
                          >
                            <FaGithub />
                            Code
                          </a>
                        )}

                        {p.demoLink && (
                          <a
                            href={p.demoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 font-medium text-sm"
                          >
                            <FaExternalLinkAlt />
                            Demo
                          </a>
                        )}
                      </div>
                   {isOwner && (
                      <button
                        onClick={() => deleteProject(p._id)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2"
                        title="Delete project"
                      >
                        <FaTrash />
                      </button>
                     )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaProjectDiagram className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No Projects Yet</h3>
              <p className="text-gray-600 mb-8">Start building your portfolio by adding your first project</p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-black mb-2">Why add projects?</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li> Showcase your technical skills</li>
                  <li> Demonstrate practical experience</li>
                  <li> Build credibility with employers</li>
                  <li> Create a comprehensive portfolio</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PortfolioProjects;