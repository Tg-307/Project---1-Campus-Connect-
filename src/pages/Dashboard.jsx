import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, FiPackage, FiMessageSquare, 
  FiTrendingUp, FiUsers, FiActivity 
} from 'react-icons/fi';
import { marketplaceAPI, ordersAPI, issuesAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    myListings: 0,
    totalOrders: 0,
    totalIssues: 0,
  });
  const [recentListings, setRecentListings] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [listingsRes, ordersRes, issuesRes] = await Promise.all([
        marketplaceAPI.getListings({ limit: 4 }),
        ordersAPI.getOrders({ limit: 4 }),
        issuesAPI.getIssues({ limit: 1 }),
      ]);

      setRecentListings(listingsRes.data.results || listingsRes.data);
      setRecentOrders(ordersRes.data.results || ordersRes.data);

      setStats({
        totalListings: listingsRes.data.count || listingsRes.data.length,
        myListings: (listingsRes.data.results || listingsRes.data).filter(
          l => l.owner?.id === user?.id
        ).length,
        totalOrders: ordersRes.data.count || ordersRes.data.length,
        totalIssues: issuesRes.data.count || issuesRes.data.length,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Listings',
      value: stats.totalListings,
      icon: FiShoppingBag,
      color: 'primary',
      link: '/marketplace',
    },
    {
      title: 'My Listings',
      value: stats.myListings,
      icon: FiPackage,
      color: 'secondary',
      link: '/my-listings',
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: FiTrendingUp,
      color: 'accent',
      link: '/orders',
    },
    {
      title: 'Issues',
      value: stats.totalIssues,
      icon: FiMessageSquare,
      color: 'success',
      link: '/issues',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Welcome back, {user?.first_name}! 👋</h1>
            <p>Here's what's happening in your campus today</p>
          </div>
          <Link to="/marketplace/create" className="btn btn-primary">
            <FiShoppingBag /> Sell Item
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link} className="stat-card" data-color={stat.color}>
                <div className="stat-icon">
                  <stat.icon />
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.title}</p>
                  <h2 className="stat-value">{stat.value}</h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          {/* Recent Listings */}
          <motion.div
            className="content-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="section-header">
              <h2>Recent Listings</h2>
              <Link to="/marketplace" className="view-all-link">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="listings-grid">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="listing-card-mini">
                    {listing.images?.[0] && (
                      <div className="listing-image">
                        <img 
                          src={`http://localhost:8000${listing.images[0].image}`} 
                          alt={listing.title} 
                        />
                      </div>
                    )}
                    <div className="listing-info">
                      <h4>{listing.title}</h4>
                      <p className="listing-price">₹{listing.price}</p>
                      <span className={`badge badge-${listing.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
                        {listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            className="content-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/orders" className="view-all-link">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="orders-list">
                {recentOrders.length === 0 ? (
                  <p className="empty-message">No orders yet</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <h4>{order.listing_title || order.listing?.title || 'Order Item'}</h4>
                        {order.listing?.price && (
                          <p>₹{order.listing.price}</p>
                        )}
                      </div>
                      <span className={`badge badge-${
                        order.status === 'COMPLETED' ? 'success' :
                        order.status === 'PENDING' ? 'warning' :
                        order.status === 'CANCELLED' ? 'danger' : 'info'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/marketplace" className="action-card">
              <FiShoppingBag />
              <span>Browse Marketplace</span>
            </Link>
            <Link to="/issues" className="action-card">
              <FiMessageSquare />
              <span>Report Issue</span>
            </Link>
            <Link to="/orders" className="action-card">
              <FiPackage />
              <span>My Orders</span>
            </Link>
            <Link to="/profile" className="action-card">
              <FiUsers />
              <span>My Profile</span>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
