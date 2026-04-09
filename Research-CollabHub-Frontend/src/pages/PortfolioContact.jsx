import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext"; // ✅ ADD HERE
import { 
  FaGithub, 
  FaLinkedin, 
  FaGlobe, 
  FaEnvelope, 
  FaPhone,
  FaEdit,
  FaTimes,
  FaSave,
  FaPaperPlane,
  FaUser,
  FaAward,
  FaProjectDiagram,
  FaTools,
  FaGraduationCap,
  FaWhatsapp
} from "react-icons/fa";

const PortfolioContact = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const { user } = useAuth(); // ✅ ADD
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    contactEmail: "",
    contactPhone: "",
    github: "",
    linkedin: "",
    website: ""
  });

  const token = localStorage.getItem("token");

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(`/portfolio/public/${slug}`);
      setPortfolio(res.data);

      setForm({
        contactEmail: res.data.contactEmail || "",
        contactPhone: res.data.contactPhone || "",
        github: res.data.github || "",
        linkedin: res.data.linkedin || "",
        website: res.data.website || ""
      });

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const handleUpdate = async () => {
    try {
      await axios.put("/portfolio/update", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Updated successfully ✅");
      setEditMode(false);
      fetchPortfolio();

    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = () => {
    if (!message) return alert("Write something");

    console.log("Message sent to:", portfolio.contactEmail);
    console.log("Message:", message);

    alert("Message sent successfully ✅");
    setMessage("");
  };

  if (!portfolio) return <p className="p-6">Loading...</p>;
  const isOwner = user?._id === portfolio?.ownerId; // ✅ ADD
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
              <button className="flex items-center gap-2 text-white font-semibold">
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* CONTACT INFORMATION */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                  <FaPhone className="text-gray-600" />
                  Contact Information
                </h2>
                <p className="text-gray-600">Get in touch through various channels</p>
              </div>
              {isOwner && (
  <button
    onClick={() => setEditMode(!editMode)}
    className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-xl transition-all duration-300 font-medium flex items-center gap-2"
  >
    {editMode ? (
      <>
        <FaTimes />
        Cancel
      </>
    ) : (
      <>
        <FaEdit />
        Edit
      </>
    )}
  </button>
)}
            </div>

            {!editMode || !isOwner ?  (
              <div className="space-y-4">
                
                {/* Email */}
                {portfolio.contactEmail && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <FaEnvelope className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Email</p>
                        <p className="text-black font-medium">{portfolio.contactEmail}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {portfolio.contactPhone && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <FaPhone className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Phone</p>
                        <p className="text-black font-medium">{portfolio.contactPhone}</p>
                      </div>
                    </div>

                    {/* WhatsApp Button */}
                    <button
                      onClick={() => {
                        let phone = portfolio.contactPhone;
                        phone = phone.replace(/\D/g, "");
                        if (phone.startsWith("0")) {
                          phone = "94" + phone.slice(1);
                        }
                        window.open(
                          `https://wa.me/${phone}?text=Hi ${portfolio.fullName}, I saw your portfolio and wanted to connect`
                        );
                      }}
                      className="w-full bg-[#25D366] text-white px-4 py-3 rounded-xl hover:bg-[#128C7E] transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <FaWhatsapp />
                      Chat on WhatsApp
                    </button>
                  </div>
                )}

                {/* Social Links */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Social Profiles</p>
                  
                  {portfolio.github && (
                    <a
                      href={portfolio.github}
                      target="_blank"
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                        <FaGithub className="text-white text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-black font-medium">GitHub</p>
                        <p className="text-sm text-gray-500">View code repositories</p>
                      </div>
                    </a>
                  )}

                  {portfolio.linkedin && (
                    <a
                      href={portfolio.linkedin}
                      target="_blank"
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                        <FaLinkedin className="text-white text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-black font-medium">LinkedIn</p>
                        <p className="text-sm text-gray-500">Professional profile</p>
                      </div>
                    </a>
                  )}

                  {portfolio.website && (
                    <a
                      href={portfolio.website}
                      target="_blank"
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                        <FaGlobe className="text-white text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-black font-medium">Website</p>
                        <p className="text-sm text-gray-500">Personal portfolio</p>
                      </div>
                    </a>
                  )}
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Edit Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">GitHub Profile</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Personal Website</label>
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <FaSave />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-200 text-black px-6 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* MESSAGE FORM */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                <FaEnvelope className="text-gray-600" />
                Send Message
              </h2>
              <p className="text-gray-600">Reach out directly through this form</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Your Message</label>
                <textarea
                  placeholder="Hi! I came across your portfolio and would like to connect..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all bg-gray-50 h-32 resize-none"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                onClick={handleSend}
                className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPaperPlane />
                Send Message
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>Your message will be sent to {portfolio.contactEmail || "the portfolio owner"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PortfolioContact;