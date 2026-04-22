import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext"; // 

import { 
  FaUser,
  FaPhone,
  FaProjectDiagram,
  FaAward,
  FaTools,
  FaGraduationCap,
  FaEnvelope,
  FaDownload,
  FaUniversity,
  FaBook,
  FaBriefcase,
  FaIdCard
} from "react-icons/fa";

const PortfolioView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);

  const { user } = useAuth(); // 

  // FETCH PORTFOLIO
  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`/portfolio/public/${slug}`);
      const data = res.data.portfolio || res.data;
      setPortfolio(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  // OWNER CHECK (ADDED)
  const isOwner = user?._id === portfolio?.ownerId;
  const portfolioUrl = `http://192.168.8.192:5173/portfolio/${slug}`;
  if (!portfolio) return <p>Loading...</p>;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* VIEW MODE LABEL */}
      {!isOwner && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-2 font-semibold">
          Viewing Public Portfolio (Read Only)
        </div>
      )}

      {/* PROFESSIONAL NAVIGATION */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <button className="flex items-center gap-2 text-white font-semibold">
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

      {/* PROFESSIONAL ABOUT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
              <FaUser className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{portfolio.fullName}</h1>
              <p className="text-gray-600 text-lg">Professional Portfolio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Share Portfolio
              </h2>

              <p className="text-gray-600">
                Scan this QR code to instantly open this public portfolio.
              </p>

              <p className="text-sm text-gray-500 mt-2 break-all">
                {portfolioUrl}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(portfolioUrl)}`}
                alt="Portfolio QR Code"
                className="w-[180px] h-[180px]"
              />
            </div>

          </div>
        </div>

        {/* BIO SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaIdCard className="text-gray-600" />
              About Me
            </h2>
            <p className="text-gray-600">Professional background and overview</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-800 text-lg leading-relaxed">
              {portfolio.bio || "No bio information available"}
            </p>
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <FaUniversity className="text-gray-600" />
              Education
            </h2>
            <p className="text-gray-600">Academic background and qualifications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaUniversity className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">University</h3>
              </div>
              <p className="text-black font-medium text-lg">
                {portfolio.university || "Not specified"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaBook className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">Degree</h3>
              </div>
              <p className="text-black font-medium text-lg">
                {portfolio.degree || "Not specified"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaBriefcase className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-semibold text-gray-600">Specialization</h3>
              </div>
              <p className="text-black font-medium text-lg">
                {portfolio.specialization || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* CV SECTION */}
        {portfolio.cvFile && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                <FaDownload className="text-gray-600" />
                Curriculum Vitae
              </h2>
              <p className="text-gray-600">Download and view my complete CV</p>
            </div>
            
            <a
              href={portfolio.cvFile}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <FaDownload />
              View Full CV
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default PortfolioView;