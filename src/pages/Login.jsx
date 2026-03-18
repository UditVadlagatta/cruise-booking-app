import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import api from '../api/index';
import customerService from '../api/services/customerService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    // If already visible, hide immediately
    if (showPassword) {
      setShowPassword(false);
      setCountdown(0);
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
      return;
    }

    // Show password and start 10s auto-hide countdown
    setShowPassword(true);
    setCountdown(10);

    timerRef.current = setTimeout(() => {
      setShowPassword(false);
      setCountdown(0);
    }, 10000);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await customerService.login(formData.email, formData.password);
      const { accessToken, refreshToken, customer } = data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(customer));
      localStorage.setItem('role', 'customer');

      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard/profile');

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Eye icon (open) ── */
  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  /* ── Eye icon (closed) ── */
  const EyeOffIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4">
      <div className="mt-30 mb-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <FaUserCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-serif text-slate-900 mb-2">
            Welcome to <span className="text-amber-600 italic">CRUISEbook</span>
          </h1>
          <p className="text-sm text-slate-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserCircle className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="Enter your password"
                required
              />

              {/* Eye toggle — only show when password has value */}
              {formData.password && (
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 text-slate-400 hover:text-amber-600 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password for 10s'}
                >
                  {/* Countdown ring when visible */}
                  {showPassword && countdown > 0 && (
                    <span className="text-[10px] font-bold text-amber-500 leading-none">
                      {countdown}s
                    </span>
                  )}
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              )}
            </div>

            {/* Helper text */}
            {showPassword && (
              <p className="mt-1.5 text-[11px] text-amber-500 font-medium">
                Password visible · auto-hides in {countdown}s
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white text-xs uppercase tracking-[0.3em] font-bold py-3 rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-xs text-slate-600 mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-slate-600">
            Admin: username: <span className="font-mono">admin</span>, password: <span className="font-mono">admin</span>
          </p>
          <p className="text-xs text-slate-600">
            User: username: <span className="font-mono">user</span>, password: <span className="font-mono">user</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-semibold">
              SIGN UP
            </Link>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Company Employee?{' '}
            <Link to="/celogin" className="text-amber-600 hover:text-amber-700 font-semibold">
              SIGN IN
            </Link>
            <span> or </span>
            <Link to="/cesignup" className="text-amber-600 hover:text-amber-700 font-semibold">
              SIGN UP
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;