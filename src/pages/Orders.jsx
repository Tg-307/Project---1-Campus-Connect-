import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiCheck, FiX, FiClock, FiShoppingBag } from 'react-icons/fi';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getOrders();
      setOrders(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    setActionLoading(orderId);
    try {
      await ordersAPI.acceptOrder(orderId);
      toast.success('Order accepted! ✅');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to accept order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId) => {
    setActionLoading(orderId);
    try {
      await ordersAPI.rejectOrder(orderId);
      toast.success('Order rejected');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (orderId) => {
    setActionLoading(orderId);
    try {
      await ordersAPI.completeOrder(orderId);
      toast.success('Order completed! 🎉');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (orderId) => {
    setActionLoading(orderId);
    try {
      await ordersAPI.cancelOrder(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
      case 'REJECTED':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FiClock />;
      case 'ACCEPTED':
      case 'COMPLETED':
        return <FiCheck />;
      case 'CANCELLED':
      case 'REJECTED':
        return <FiX />;
      default:
        return <FiPackage />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    if (filter === 'BUYING') return order.buyer?.id === user?.id;
    if (filter === 'SELLING') return order.seller?.id === user?.id;
    return order.status === filter;
  });

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <motion.div
          className="orders-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>My Orders 📦</h1>
            <p>Manage your buying and selling transactions</p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="orders-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {['ALL', 'BUYING', 'SELLING', 'PENDING', 'ACCEPTED', 'COMPLETED'].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
              <span className="filter-count">
                {status === 'ALL'
                  ? orders.length
                  : status === 'BUYING'
                  ? orders.filter((o) => o.buyer?.id === user?.id).length
                  : status === 'SELLING'
                  ? orders.filter((o) => o.seller?.id === user?.id).length
                  : orders.filter((o) => o.status === status).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiShoppingBag />
            <h3>No orders found</h3>
            <p>Start buying or selling items in the marketplace</p>
          </motion.div>
        ) : (
          <motion.div
            className="orders-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredOrders.map((order, index) => {
              const isBuyer = order.buyer?.id === user?.id;
              const isSeller = order.seller?.id === user?.id;

              return (
                <motion.div
                  key={order.id}
                  className="order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="order-header">
                    <div className="order-listing-info">
                      {order.listing?.images?.[0] && (
                        <img
                          src={`http://localhost:8000${order.listing.images[0].image}`}
                          alt={order.listing.title}
                          className="order-image"
                        />
                      )}
                      <div>
                        <h3>{order.listing?.title}</h3>
                        <p className="order-price">₹{order.listing?.price}</p>
                      </div>
                    </div>
                    <span className={`badge badge-${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>

                  <div className="order-details">
                    <div className="order-party">
                      <span className="party-label">
                        {isBuyer ? 'Seller:' : 'Buyer:'}
                      </span>
                      <span className="party-name">
                        {isBuyer ? order.seller?.username : order.buyer?.username}
                      </span>
                    </div>
                    <div className="order-time">
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="order-actions">
                    {isSeller && order.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAccept(order.id)}
                          disabled={actionLoading === order.id}
                        >
                          {actionLoading === order.id ? (
                            <div className="spinner"></div>
                          ) : (
                            <>
                              <FiCheck /> Accept
                              <Footer />
    </>
                          )}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleReject(order.id)}
                          disabled={actionLoading === order.id}
                        >
                          <FiX /> Reject
                        </button>
                        <Footer />
    </>
                    )}

                    {isBuyer && order.status === 'PENDING' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleCancel(order.id)}
                        disabled={actionLoading === order.id}
                      >
                        {actionLoading === order.id ? (
                          <div className="spinner"></div>
                        ) : (
                          <>
                            <FiX /> Cancel Request
                            <Footer />
    </>
                        )}
                      </button>
                    )}

                    {isSeller && order.status === 'ACCEPTED' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleComplete(order.id)}
                        disabled={actionLoading === order.id}
                      >
                        {actionLoading === order.id ? (
                          <div className="spinner"></div>
                        ) : (
                          <>
                            <FiCheck /> Mark Complete
                            <Footer />
    </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
