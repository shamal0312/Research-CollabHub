import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBook, FaSave, FaArrowLeft, FaCalendarAlt, FaBuilding, FaIdCard } from "react-icons/fa";

const EditProfile = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    age: "",
    year: "",
    semester: "",
    universityName: "",
    faculty: "",
    phoneNumber: "",
    address: "",
    about: ""
  });

  const navigate = useNavigate();

  // 🔥 fetch current data
  const fetchProfile = async () => {
    const res = await axios.get("/profile");
    setForm(res.data.user);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔥 handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put("/profile", form);

    navigate("/profile"); // go back
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* ✅ PROFESSIONAL EDIT PROFILE HEADER */}
      <div className="bg-black text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-all duration-300"
            >
              <FaArrowLeft className="text-white" />
            </button>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
          </div>
          <p className="text-gray-300">Update your professional information and settings</p>
        </div>
      </div>

      {/* ✅ EDIT FORM CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* ✅ MAIN FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <FaUser className="text-black" />
            Personal Information
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaIdCard className="text-gray-400" />
                  Age
                </label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  type="number"
                  placeholder="25"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  min="18"
                  max="100"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State, Country"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
              />
            </div>
          </form>
        </div>

        {/* ✅ ACADEMIC INFORMATION CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <FaGraduationCap className="text-black" />
            Academic Information
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* University */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBuilding className="text-gray-400" />
                  University
                </label>
                <input
                  name="universityName"
                  value={form.universityName}
                  onChange={handleChange}
                  placeholder="Stanford University"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBook className="text-gray-400" />
                  Faculty/Department
                </label>
                <input
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  Year
                </label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  required
                />
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  Semester
                </label>
                <input
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  placeholder="2"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* ✅ ABOUT SECTION CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <FaBook className="text-black" />
            About Me
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Bio
              </label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                placeholder="Tell us about yourself, your research interests, and professional background..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-400 focus:border-gray-400 transition-all duration-300 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">Share your professional background, research interests, and career goals.</p>
            </div>
          </form>
        </div>

        {/* ✅ ACTION BUTTONS */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Review your changes before saving</p>
              <p className="text-xs text-gray-500 mt-1">All fields marked with * are required</p>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;