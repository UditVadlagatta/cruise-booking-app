import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';
import workerService from '../../services/workerServices';

const CELogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedWorker = localStorage.getItem("worker");
  //   if (storedWorker && storedWorker !== "undefined") {
  //     navigate('/cedashboard/ceprofile', { replace: true });
  //   }
  // }, [navigate]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Functional logic goes here later
    console.log("CE Login Attempted", formData);
    setLoading(true);
    setError('');

    try{
      const data = await workerService.login(formData.email, formData.password);
      // console.log(data);
      const {accessToken , refreshToken , worker} = data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken',refreshToken);
      localStorage.setItem('worker', JSON.stringify(worker));

      window.dispatchEvent(new Event("storage"));

      navigate('/cedashboard/ceprofile');
    }
    catch(err){
        const errorMsg = err.response?.data?.error || 'Login failed. Please try again.'
        setError(errorMsg);
    }
    finally{
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

          {/* Email Field */}
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2 ml-1">
              Work Email
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

          {/* Password Field */}
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>
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
            Employee ?{' '}
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