import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiFileText, FiTag } from 'react-icons/fi';
import { issuesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import '../marketplace/CreateListingModal.css';

const CreateIssueModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
  });

  const categories = [
    'WiFi',
    'Hostel',
    'Mess',
    'Lab',
    'Library',
    'Classroom',
    'Sports',
    'Security',
    'Maintenance',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await issuesAPI.createIssue(formData);
      toast.success('Issue reported successfully! 📢');
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Failed to create issue';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'MEDIUM',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="modal-header">
            <h2>Report New Issue</h2>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="input-group">
              <label htmlFor="title">
                <FiAlertCircle /> Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">
                <FiFileText /> Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                placeholder="Provide detailed information about the issue..."
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="category">
                  <FiTag /> Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <div className="spinner"></div> : 'Report Issue'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateIssueModal;
