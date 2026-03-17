import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaIdBadge } from 'react-icons/fa';
import workerService from "../../services/workerServices"; // adjust path if needed

const CESignup = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // 👁 Temporary peek
  const togglePassword = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 5000);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(true);
    setTimeout(() => setShowConfirmPassword(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // 🚀 Submit Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.email.endsWith("@cruisebook.com")) {
      setError("Email must be @cruisebook.com domain");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await workerService.create(payload);

      alert("Employee registered successfully");

      navigate("/celogin");

    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <FaUserShield className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-2xl font-serif text-slate-900 mb-2">
            Employee <span className="text-amber-600 italic">Registration</span>
          </h1>
          <p className="text-sm text-slate-500">Create a staff account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
              Staff Username
            </label>
            <div className="relative group">
              <FaIdBadge className="absolute left-3 top-3 text-slate-400"/>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Staff ID or Name"
                onChange={handleChange}
                className="w-full pl-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
              Work Email
            </label>
            <div className="relative group">
              <FaEnvelope className="absolute left-3 top-3 text-slate-400"/>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="employee@cruisebook.com"
                onChange={handleChange}
                className="w-full pl-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
              Password
            </label>
            <div className="relative group">
              <FaLock className="absolute left-3 top-3 text-slate-400"/>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-3 text-slate-400">
                {showPassword ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
              Confirm Password
            </label>
            <div className="relative group">
              <FaLock className="absolute left-3 top-3 text-slate-400"/>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
              <button type="button" onClick={toggleConfirmPassword} className="absolute right-3 top-3 text-slate-400">
                {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-lg hover:bg-amber-700 transition"
          >
            {loading ? "Creating Staff Account..." : "Register Employee"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-xs">
          <p>
            Already have an account?{" "}
          <Link to="/celogin" className="text-amber-600 font-bold">
            EMPLOYEE SIGN IN
          </Link>
          </p>
          <div className='mt-1'>
            <span>
            Go for customer
            <Link  to="/login" className="text-amber-600 font-bold"
            > Customer Sign In</Link>
          </span>
          <span> or </span>
          <span>
            <Link  to="/login" className="text-amber-600 font-bold"
            > Sign Up</Link>
          </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CESignup;