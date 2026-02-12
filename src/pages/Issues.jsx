import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, FiMessageSquare, FiAlertCircle, 
  FiCheckCircle, FiClock, FiFilter 
} from 'react-icons/fi';
import { issuesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CreateIssueModal from '../components/issues/CreateIssueModal';
import '../styles/Issues.css';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await issuesAPI.getIssues();
      setIssues(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast.error('Failed to load issues');
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN':
        return <FiAlertCircle />;
      case 'IN_PROGRESS':
        return <FiClock />;
      case 'RESOLVED':
        return <FiCheckCircle />;
      default:
        return <FiMessageSquare />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'RESOLVED':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'primary';
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'ALL') return true;
    return issue.status === filter;
  });

  return (
    <>
      <Navbar />
      <div className="issues-container">
        <motion.div
          className="issues-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Campus Issues 📢</h1>
            <p>Report and track issues in your campus</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus /> Report Issue
          </button>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="issues-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.replace('_', ' ')}
              <span className="filter-count">
                {status === 'ALL'
                  ? issues.length
                  : issues.filter((i) => i.status === status).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Issues List */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiMessageSquare />
            <h3>No issues found</h3>
            <p>Be the first to report an issue</p>
          </motion.div>
        ) : (
          <motion.div
            className="issues-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                className="issue-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="issue-header-section">
                  <div className="issue-icon" data-status={issue.status}>
                    {getStatusIcon(issue.status)}
                  </div>
                  <div className="issue-header-content">
                    <div className="issue-title-row">
                      <h3>{issue.title}</h3>
                      <span className={`badge badge-${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <div className="issue-meta">
                      <span className="issue-category">
                        <FiFilter /> {issue.category}
                      </span>
                      <span className="issue-time">
                        {formatDistanceToNow(new Date(issue.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="issue-author">
                        by {issue.created_by?.username}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="issue-description">{issue.description}</p>

                <div className="issue-footer">
                  <span className={`badge badge-${getStatusColor(issue.status)}`}>
                    {getStatusIcon(issue.status)}
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CreateIssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchIssues}
      />
      <Footer />
    </>
  );
};

export default Issues;
