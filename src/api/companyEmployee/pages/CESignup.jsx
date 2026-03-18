import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaIdBadge } from 'react-icons/fa';
import workerService from "../../services/workerServices";
import adminService from "../../services/adminService";

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

  // ✅ toggle: false = worker, true = admin
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ✅ only workers need @cruisebook.com
    if (!isAdmin && !formData.email.endsWith("@cruisebook.com")) {
      setError("Worker email must be @cruisebook.com domain");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      // ✅ call different service based on role toggle
      if (isAdmin) {
        await adminService.register(payload);
        alert("Admin registered successfully");
      } else {
        await workerService.create(payload);
        alert("Employee registered successfully");
      }

      navigate("/celogin");

    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="mt-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300
            ${isAdmin ? "bg-amber-100" : "bg-slate-100"}`}>
            <FaUserShield className={`w-8 h-8 transition-colors duration-300 ${isAdmin ? "text-amber-600" : "text-slate-600"}`} />
          </div>
          <h1 className="text-2xl font-serif text-slate-900 mb-2">
            {isAdmin ? "Admin" : "Employee"}{" "}
            <span className="text-amber-600 italic">Registration</span>
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Create an admin account" : "Create a staff account"}
          </p>
        </div>

        {/* ✅ Role Toggle */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6">
          <div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Register as Admin
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isAdmin ? "Admin account will be created" : "Worker account will be created"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isAdmin}
              onChange={() => {
                setIsAdmin(!isAdmin);
                setError('');
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
              }}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full
                peer peer-checked:bg-amber-500 transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full
                transition-transform peer-checked:translate-x-5"></div>
          </label>
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
              {isAdmin ? "Admin Username" : "Staff Username"}
            </label>
            <div className="relative group">
              <FaIdBadge className="absolute left-3 top-3 text-slate-400"/>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder={isAdmin ? "Admin name" : "Staff ID or Name"}
                onChange={handleChange}
                className="w-full pl-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
              {isAdmin ? "Admin Email" : "Work Email"}
            </label>
            <div className="relative group">
              <FaEnvelope className="absolute left-3 top-3 text-slate-400"/>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder={isAdmin ? "admin@gmail.com" : "employee@cruisebook.com"}
                onChange={handleChange}
                className="w-full pl-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            {!isAdmin && (
              <p className="text-[10px] text-slate-400 mt-1 ml-1">
                Must be @cruisebook.com domain
              </p>
            )}
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
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
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
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
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
            className={`w-full text-white py-4 rounded-lg transition font-bold text-sm tracking-widest uppercase
              ${isAdmin
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-slate-900 hover:bg-amber-700"
              } disabled:opacity-50`}
          >
            {loading
              ? "Creating Account..."
              : isAdmin ? "Register Admin" : "Register Employee"
            }
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-xs space-y-2">
          <p>
            Already have an account?{" "}
            <Link to="/celogin" className="text-amber-600 font-bold">
              EMPLOYEE SIGN IN
            </Link>
          </p>
          <div>
            <span>Go for customer </span>
            <Link to="/login" className="text-amber-600 font-bold">Customer Sign In</Link>
            <span> or </span>
            <Link to="/signup" className="text-amber-600 font-bold">Sign Up</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CESignup;