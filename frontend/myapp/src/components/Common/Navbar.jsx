import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { logout } from '../../store/authSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = user?.role === 'student' ? [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Matches', href: '/student/matches' },
    { label: 'Connections', href: '/student/connections' },
    { label: 'Messages', href: '/student/messages' },
    { label: 'Jobs', href: '/student/jobs' },
  ] : [
    { label: 'Dashboard', href: '/alumni/dashboard' },
    { label: 'Students', href: '/alumni/students' },
    { label: 'Connections', href: '/alumni/connections' },
    { label: 'Messages', href: '/alumni/messages' },
    { label: 'Post Job', href: '/alumni/create-job' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Career Nexus
            </h1>
          </div>

          <div className="hidden md:flex items-center space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <button
                onClick={() => navigate(user?.role === 'student' ? '/student/profile' : '/alumni/profile')}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FiUser size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition"
              >
                <FiLogOut size={20} />
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-gray-200"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 space-y-2">
              <button
                onClick={() => {
                  navigate(user?.role === 'student' ? '/student/profile' : '/alumni/profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;