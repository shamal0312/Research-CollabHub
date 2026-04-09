import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ ADDED
import { FaUser, FaEnvelope, FaGraduationCap } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ ADDED

  const [form, setForm] = useState({
    fullName: "",
    faculty: "",
    year: "",
    semester: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    studentId: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/register", form); // ✅ CHANGED

      login(res.data); // ✅ ADDED (save token + user)

      navigate("/home"); // ✅ CHANGED (go to home)

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* 🔥 3D CARD */}
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200 transform hover:scale-[1.01] transition-all duration-300">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
            <p className="text-gray-600">Join ResearchHub to start your research journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Faculty */}
            <input
              type="text"
              name="faculty"
              placeholder="Enter your faculty"
              value={form.faculty}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Year */}
            <input
              type="number"
              name="year"
              placeholder="Enter your year"
              value={form.year}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Semester */}
            <input
              type="number"
              name="semester"
              placeholder="Enter your semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Age */}
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={form.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Student ID */}
            <input
              type="text"
              name="studentId"
              placeholder="Enter your student ID"
              value={form.studentId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Gender */}
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all shadow-md"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <button onClick={() => navigate("/login")} className="text-black font-medium">
              Already have an account? Sign In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;