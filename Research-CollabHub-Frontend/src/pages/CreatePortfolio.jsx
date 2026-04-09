import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaAward, FaFileAlt, FaUpload, FaArrowRight, FaCheckCircle, FaRocket, FaLightbulb } from "react-icons/fa";

const CreatePortfolio = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    contactEmail: "",
    contactPhone: "",
    university: "",
    degree: "",
    specialization: "",
    bio: ""
  });

  const [cv, setCv] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      // CREATE PORTFOLIO
     const res = await axios.post("/portfolio/create", form);

     // GET SLUG FROM BACKEND
     const slug = res.data.portfolioSlug;
      // UPLOAD CV
      if (cv) {
        const formData = new FormData();
        formData.append("cv", cv);

        await axios.post("/portfolio/upload-cv", formData);
      }

      alert("Portfolio created!");

      navigate(`/portfolio/${slug}`);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* PROFESSIONAL HEADER */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FaRocket className="text-3xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Create Your Portfolio</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Showcase your skills, experience, and achievements to potential collaborators and employers
            </p>
          </div>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gray-100 p-8 border-b border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Portfolio Information</h2>
                <p className="text-gray-600">Fill in your professional details</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-8 space-y-8">
            
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaUser className="text-black" />
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="fullName" 
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="contactEmail" 
                      type="email"
                      placeholder="your.email@example.com"
                      value={form.contactEmail}
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="contactPhone" 
                      placeholder="+1 (555) 123-4567"
                      value={form.contactPhone}
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaGraduationCap className="text-black" />
                Academic Background
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaGraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="university" 
                      placeholder="University name"
                      value={form.university}
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBook className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="degree" 
                      placeholder="e.g., Bachelor's, Master's"
                      value={form.degree}
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaAward className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="specialization" 
                      placeholder="e.g., Computer Science, Marketing"
                      value={form.specialization}
                      onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaLightbulb className="text-black" />
                Professional Bio
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-4 top-4 text-gray-400" />
                  <textarea 
                    name="bio" 
                    placeholder="Tell us about your experience, skills, and career goals..."
                    value={form.bio}
                    onChange={handleChange} 
                    rows="6"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all resize-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {form.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* CV Upload Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="text-black" />
                Resume/CV Upload
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-500 transition-colors">
                <input 
                  type="file" 
                  onChange={(e) => setCv(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FaUpload className="text-black text-2xl" />
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    {cv ? cv.name : "Click to upload your CV"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    PDF, DOC, DOCX (MAX. 5MB)
                  </p>
                </label>
              </div>
              
              {cv && (
                <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                  <FaCheckCircle className="text-black" />
                  <div>
                    <p className="font-medium text-gray-900">{cv.name}</p>
                    <p className="text-sm text-gray-500">
                      {(cv.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={submit}
                className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                Create Portfolio
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                By creating a portfolio, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;