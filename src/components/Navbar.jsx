import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ user,worker, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
    if (worker) navigate('/celogin');
    else navigate('/login');
  };
const loggedInUser = user || worker;
const dashboardLink = user ? '/dashboard/profile' : worker ? '/cedashboard/ceprofile' : null;

return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <span className="text-xl font-serif tracking-[0.3em] text-slate-900 leading-none">
            CRUISE<span className="text-amber-600 italic">book</span>
          </span>
          <div className="h-[1px] w-0 bg-amber-600 group-hover:w-full transition-all duration-500"></div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 hover:text-amber-600">Home</Link>
          
          <Link to="/about" className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 hover:text-amber-600">About</Link>
          <Link to="/contact" className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500 hover:text-amber-600">Contact</Link>
          
          {/* {user && (
            <Link to="/dashboard/profile" className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-600">Dashboard</Link>
          )} */}
          {loggedInUser && dashboardLink && (
            <Link to={dashboardLink} className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-600">Dashboard</Link>
          )}

          {/* User Profile / Login Section */}
          {/* destop */}
          {loggedInUser ? (
            <div className="flex items-center space-x-3">
              <FaUserCircle className="w-6 h-6 text-slate-900" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-900">{loggedInUser.username}</span>
                <span className="text-[8px] text-amber-600 font-bold uppercase tracking-widest">{loggedInUser.role}</span>
              </div>
              <button
                onClick={handleLogoutClick}
                className="bg-red-500 text-white text-[10px] uppercase font-bold px-4 py-2 rounded-full hover:bg-red-600 transition-all ml-2"
              >
                Logout Desktop
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-slate-900 text-white text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 rounded-full hover:bg-amber-700 transition-all shadow-lg">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth="1.5" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 flex flex-col p-6 space-y-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[15px] uppercase font-bold text-slate-600">Home</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-[15px] uppercase font-bold text-slate-600">About</Link>
          <Link to="/contact"  onClick={() => setIsMenuOpen(false)} className="text-[15px] uppercase font-bold text-slate-600">Contact</Link>
          
          {/* {loggedInUser ? (
            <>
              <Link to="/dashboard/profile" onClick={() => setIsMenuOpen(false)} className="text-[15px] uppercase font-bold text-slate-600">Dashboard</Link>
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaUserCircle className="w-5 h-5 text-slate-900" />
                  <span className="text-[12px] font-bold text-slate-900">{loggedInUser.username}</span>
                </div>
                <button onClick={handleLogoutClick} className="bg-red-500 text-white text-[10px] px-4 py-2 rounded-full">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-slate-900 text-white text-center text-[10px] py-3 rounded-full">Login</Link>
          )} */}

          {loggedInUser ? (
  <>
    <Link to={dashboardLink} onClick={() => setIsMenuOpen(false)} className="text-[15px] uppercase font-bold text-slate-600">
      Dashboard
    </Link>
    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <FaUserCircle className="w-5 h-5 text-slate-900" />
        <span className="text-[12px] font-bold text-slate-900">{loggedInUser.username}</span>
      </div>
      <button onClick={handleLogoutClick} className="bg-red-500 text-white text-[10px] px-4 py-2 rounded-full">Logout</button>
    </div>
  </>
) : (
  <div className="flex flex-col space-y-2">
    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-slate-900 text-white text-center text-[10px] py-3 rounded-full">Login</Link>
    {/* <Link to="/celogin" onClick={() => setIsMenuOpen(false)} className="bg-slate-900 text-white text-center text-[10px] py-3 rounded-full">Employee Login</Link> */}
  </div>
)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;