import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import customerService from '../api/services/customerService';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
  setShowPassword(true); // show password
  setTimeout(() => setShowPassword(false), 5000); // hide after 5 seconds
};

const toggleConfirmPassword = () => {
  setShowConfirmPassword(true); // show confirm password
  setTimeout(() => setShowConfirmPassword(false), 5000); // hide after 5 seconds
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await customerService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      // Matches your Postman: response.customer exists
      const userData = response.customer || response.user || (response.username ? response : null);

      if (userData) {
        // Store user details
        // localStorage.setItem('user', JSON.stringify(userData));
        
        // Handle Token: If backend doesn't send a token on signup, 
        // you might need to redirect to /login instead of /dashboard
        // const token = response.token || response.refreshToken;
        
        navigate('/login', { 
      state: { message: 'Account created successfully! Please log in.' } 
    });
      } else {
        setError('Signup failed. Backend did not return user data.');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      // console.log(err.response?.data?.error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <FaUserCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-serif text-slate-900 mb-2">
            Join <span className="text-amber-600 italic">CRUISEbook</span>
          </h1>
          <p className="text-sm text-slate-500">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserCircle className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder='Enter Username'
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500" />
              </div>
              <input
              placeholder='Enter Email id'
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                required
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600"
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500" />
              </div>
              <input
                // type="password"
                type={showConfirmPassword  ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword (!showConfirmPassword )}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600"
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div> */}

          <div>
  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
    Password
  </label>
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaLock className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500" />
    </div>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
      placeholder="Enter password"
      required
    />
    <button
      type="button"
      onClick={togglePassword} // use your function here
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600"
    >
      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
    </button>
  </div>
</div>

<div>
  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-1">
    Confirm Password
  </label>
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaLock className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500" />
    </div>
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-sm"
      placeholder="Confirm your password"
      required
    />
    <button
      type="button"
      onClick={toggleConfirmPassword} // use your function here
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600"
    >
      {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
    </button>
  </div>
</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-slate-900 text-white text-[11px] uppercase tracking-[0.3em] font-bold py-4 rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-bold">
              SIGN IN
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/celogin" className="text-amber-600 hover:text-amber-700 font-bold">
              Company Employee SIGN IN
            </Link>
            <span> or </span>
            <Link to="/cesignup" className="text-amber-600 hover:text-amber-700 font-bold">
                           SIGN UP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;