import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { 
  FaPlus,
  FaAward,
  FaBuilding,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaUser,
  FaPhone,
  FaProjectDiagram,
  FaTools,
  FaCertificate
} from "react-icons/fa";

const PortfolioCertificates = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    year: "",
    fileUrl: ""
  });

  const token = localStorage.getItem("token");

  // 🔥 FETCH PORTFOLIO
  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`/portfolio/public/${slug}`);
      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  // 🔥 ADD CERTIFICATE
  const handleAdd = async () => {
    if (!form.title) return alert("Title required");

    try {
      const updatedCerts = [...(portfolio.certifications || []), form];

      await axios.put(
        "/portfolio/update",
        { certifications: updatedCerts },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Certificate added ✅");

      setForm({
        title: "",
        issuer: "",
        year: "",
        fileUrl: ""
      });

      fetchPortfolio();

    } catch (err) {
      console.error(err);
    }
  };

  if (!portfolio) return <p className="p-6">Loading...</p>;
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
              <button 
                onClick={() => navigate(`/portfolio/${slug}/projects`)} 
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
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
              <button className="flex items-center gap-2 text-white font-semibold">
                <FaGraduationCap />
                Certificates
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ADD CERTIFICATE FORM */}
        {isOwner && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaCertificate className="text-gray-600" />
              Add Certificate
            </h2>
            <p className="text-gray-600">Showcase your professional certifications and achievements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Certificate Title</label>
              <input
                type="text"
                placeholder="e.g., AWS Certified Solutions Architect"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Issuing Organization</label>
              <input
                type="text"
                placeholder="e.g., Amazon Web Services"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Year Issued</label>
              <input
                type="text"
                placeholder="e.g., 2023"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Certificate URL</label>
              <input
                type="url"
                placeholder="https://certificate.com/verify/123456"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Add Certificate
          </button>
        </div>
        )}

        {/* CERTIFICATES DISPLAY */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaGraduationCap className="text-gray-600" />
              Professional Certifications
            </h2>
            <p className="text-gray-600">Your verified achievements and credentials</p>
          </div>

          {portfolio.certifications?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.certifications.map((cert, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  
                  {/* Certificate Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <FaAward className="text-white text-xl" />
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                        {cert.year || "Year"}
                      </span>
                    </div>
                  </div>

                  {/* Certificate Content */}
                  <h3 className="text-lg font-bold text-black mb-2 leading-tight">
                    {cert.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <FaBuilding className="text-gray-500 text-sm" />
                    <p className="text-gray-600 text-sm font-medium">
                      {cert.issuer}
                    </p>
                  </div>

                  {/* View Certificate Link */}
                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium text-sm"
                    >
                      <FaExternalLinkAlt />
                      View Certificate
                    </a>
                  )}

                  {/* Certificate Badge */}
                  {!cert.fileUrl && (
                    <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm">
                      <FaCertificate />
                      Verified
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaGraduationCap className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No Certificates Yet</h3>
              <p className="text-gray-600 mb-8">Start building your professional profile by adding your first certificate</p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-black mb-2">Why add certificates?</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li> Showcase your expertise and skills</li>
                  <li> Build credibility with employers</li>
                  <li> Highlight continuous learning</li>
                  <li> Stand out from the competition</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PortfolioCertificates;