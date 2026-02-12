import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-header-section">
            <div className="profile-avatar-large">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="profile-header-info">
              <h1>
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="profile-username">@{user?.username}</p>
              <span className={`badge badge-primary`}>
                {user?.profile?.role}
              </span>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <div className="detail-icon">
                <FiMail />
              </div>
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon">
                <FiMapPin />
              </div>
              <div className="detail-content">
                <span className="detail-label">Institute</span>
                <span className="detail-value">
                  {user?.profile?.institute?.name}
                </span>
                <span className="detail-code">
                  {user?.profile?.institute?.code}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon">
                <FiAward />
              </div>
              <div className="detail-content">
                <span className="detail-label">Role</span>
                <span className="detail-value">{user?.profile?.role}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon">
                <FiUser />
              </div>
              <div className="detail-content">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">
                  {new Date(user?.profile?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
