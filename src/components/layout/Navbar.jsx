import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, FiUser, FiLogOut, FiMenu, FiX, 
  FiHome, FiShoppingBag, FiMessageSquare, FiSettings, FiPackage, FiActivity
} from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import './Layout.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/marketplace', icon: FiShoppingBag, label: 'Marketplace' },
    { path: '/orders', icon: FiPackage, label: 'Orders' },
    { path: '/issues', icon: FiMessageSquare, label: 'Issues' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Campus <span className="brand-accent">Connect</span>
          </motion.h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={link.path} className="nav-link">
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          <NotificationBell />

          <div className="user-menu-container">
            <motion.button
              className="user-menu-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="user-avatar">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="user-role">{user?.profile?.role}</span>
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="dropdown-header">
                    <p className="dropdown-email">{user?.email}</p>
                    <p className="dropdown-institute">{user?.profile?.institute?.name}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item">
                    <FiUser /> Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <FiSettings /> Settings
                  </Link>
                  <Link to="/diagnostic" className="dropdown-item">
                    <FiActivity /> Diagnostics
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FiLogOut /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
