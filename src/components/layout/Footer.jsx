import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiGithub, FiLinkedin, FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <h3>Campus Connect</h3>
            <p>Your all-in-one campus management platform for buying, selling, and resolving campus issues.</p>
            <div className="footer-tagline">
              Built with <FiHeart className="heart-icon" /> for campus communities
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone />
                <a href="tel:+918279793749">+91 82797 93749</a>
              </div>
              <div className="contact-item">
                <FiMail />
                <a href="mailto:tanishkgupta0823@gmail.com">tanishkgupta0823@gmail.com</a>
              </div>
              <div className="contact-item">
                <FiGithub />
                <a href="https://github.com/Tg-307" target="_blank" rel="noopener noreferrer">
                  github.com/Tg-307
                </a>
              </div>
            </div>
          </div>

          {/* Developer Section */}
          <div className="footer-section">
            <h4>Developer</h4>
            <div className="developer-info">
              <p className="developer-name">Tanishk Gupta</p>
              <p className="developer-role">Full Stack Developer</p>
              <div className="social-links">
                <a href="https://github.com/Tg-307" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiGithub />
                </a>
                <a href="mailto:tanishkgupta0823@gmail.com" className="social-link">
                  <FiMail />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/marketplace">Marketplace</a></li>
              <li><a href="/orders">Orders</a></li>
              <li><a href="/issues">Issues</a></li>
              <li><a href="/profile">Profile</a></li>
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
          <p>Designed & Developed by Tanishk Gupta</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
