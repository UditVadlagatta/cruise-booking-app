import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import axios from 'axios'
import api from '../api/index';
import customerService from '../api/services/customerService';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


    // const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect(()=>{ 
  //   const fetchCustomers  = async ()=>{
  //     setLoading(true);
  //     setError('');

  //     try{
  //       const data  = await customerService.getAllCustomers()
  //       setCustomers(data);
  //     }
  //     catch (err) {
  //       console.error(err);
  //       setError('Failed to fetch customers, server problem...');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };fetchCustomers();
  // },[])
  
  

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
    // ✅ Use 'api' instead of 'axios'
    // This automatically uses the baseURL from your api/index.js
    // const response = await api.post('/customers/login', {
    //   email: formData.email,
    //   password: formData.password
    // });

    const data = await  customerService.login(formData.email, formData.password);

    const { accessToken, refreshToken, customer } = data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(customer));
    localStorage.setItem('role', 'customer');
    

    // trigger navbar update
window.dispatchEvent(new Event("storage"));


    navigate('/dashboard/profile');
    
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4">
      <div className="mt-30 mb-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8 ">
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
              SIGN UP
            </Link>
          </p>
           <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            

            <Link to="/celogin" className="text-amber-600 hover:text-amber-700 font-semibold">
               Company Employee SIGN IN
            </Link>
            {/* <p>or</p> */} <span> or </span>
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