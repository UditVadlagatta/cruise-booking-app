import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className=" bottom-0 left-0 w-full bg-gray-800/100 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Logo & Description */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="text-2xl font-serif tracking-widest text-amber-500">
            CRUISE<span className="text-white italic">book</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Experience the ocean like never before. Luxury, comfort, and unforgettable memories await you on every voyage.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2 hidden md:flex">
          <h3 className="uppercase tracking-[0.2em] text-amber-500 text-sm mb-2">Quick Links</h3>
          <Link to="/" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Home</Link>
          <Link to="/about" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">About</Link>
          <Link to="/contact" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Contact</Link>
          <Link to="/login" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Login</Link>
        </div>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col space-y-4">
          <h3 className="uppercase tracking-[0.2em] text-amber-500 text-sm mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-white">
            <a href="#" className="hover:text-amber-500 transition-colors"><FaFacebookF /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-amber-500 transition-colors"><FaLinkedinIn /></a>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            &copy; {new Date().getFullYear()} CruiseBook. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;