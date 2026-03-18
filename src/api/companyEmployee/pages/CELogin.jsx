import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';
import workerService from '../../services/workerServices';
import adminService from '../../services/adminService';

/* ── Eye icons ── */
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CELogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    if (showPassword) {
      setShowPassword(false);
      setCountdown(0);
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
      return;
    }

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
      // 🔥 Try ADMIN login first
      try {
        const data = await adminService.login(formData.email, formData.password);
        const { accessToken, refreshToken, admin } = data;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', 'admin');
        localStorage.setItem('worker', JSON.stringify({ ...admin, role: 'admin' }));

        window.dispatchEvent(new Event('storage'));
        navigate('/admindashboard/aprofile');
        return;
      } catch (adminErr) {
        // ❌ Admin failed → try worker
      }

      // 🔥 Try WORKER login
      const data = await workerService.login(formData.email, formData.password);
      const { accessToken, refreshToken, worker } = data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', 'worker');
      localStorage.setItem('worker', JSON.stringify({ ...worker, role: 'worker' }));

      window.dispatchEvent(new Event('storage'));
      navigate('/cedashboard/ceprofile');

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid credentials (Admin/Worker)';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4">
      <div className="mt-30 mb-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <FaUserShield className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-2xl font-serif text-slate-900 mb-2">
            Employee <span className="text-amber-600 italic">Portal</span>
          </h1>
          <p className="text-sm text-slate-600">Secure access for CRUISEbook staff</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2 ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                placeholder="employee@cruisebook.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                placeholder="••••••••"
                required
              />

              {/* Eye toggle — only when password has value */}
              {formData.password && (
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 text-slate-400 hover:text-amber-600 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password for 10s'}
                >
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
            className="w-full bg-slate-900 text-white text-[11px] uppercase tracking-[0.3em] font-bold py-4 rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Employee Sign In'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-slate-500">
            Employee?{' '}
            <Link to="/cesignup" className="text-amber-600 hover:text-amber-700 font-bold">
              GO TO SIGN UP
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Standard customer?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-bold">
              GO TO LOGIN
            </Link>
            <span> or </span>
            <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-bold">
              SIGN UP
            </Link>
          </p>
          <p className="text-[10px] text-slate-400 italic">
            Authorized Personnel Only
          </p>
        </div>

      </div>
    </div>
  );
};

export default CELogin;