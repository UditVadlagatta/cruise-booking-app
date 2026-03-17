import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock login - replace with actual API call
      if (formData.username === 'admin' && formData.password === 'admin') {
        const user = { username: 'admin', role: 'admin' };
        const token = 'mock-jwt-token';
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        navigate('/dashboard');
      } else if (formData.username === 'user' && formData.password === 'user') {
        const user = { username: 'user', role: 'customer' };
        const token = 'mock-jwt-token';
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
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

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserCircle className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] font-bold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
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
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
