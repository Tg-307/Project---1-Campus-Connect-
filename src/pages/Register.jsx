import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [institutes, setInstitutes] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    institute: '',
    role: 'STUDENT',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const response = await authAPI.getInstitutes();
      setInstitutes(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);

    if (result.success) {
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <motion.div
        className="auth-card auth-card-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join Campus Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create your account and connect with your campus
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input"
                placeholder="John"
                required
              />
            </motion.div>

            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input"
                placeholder="Doe"
                required
              />
            </motion.div>
          </div>

          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="username">
              <FiUser /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              placeholder="johndoe"
              required
            />
          </motion.div>

          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="email">
              <FiMail /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="john@university.edu"
              required
            />
          </motion.div>

          <div className="form-row">
            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="institute">Institute</label>
              <select
                id="institute"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Institute</option>
                {institutes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.code} - {inst.name}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="STAFF">Staff</option>
              </select>
            </motion.div>
          </div>

          <div className="form-row">
            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="password">
                <FiLock /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="confirmPassword">
                <FiCheck /> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Create Account <FiArrowRight />
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
