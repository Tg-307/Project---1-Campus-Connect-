import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { marketplaceAPI, ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CreateListingModal from '../components/marketplace/CreateListingModal';
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orderingItem, setOrderingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, categoriesRes] = await Promise.all([
        marketplaceAPI.getListings(),
        marketplaceAPI.getCategories(),
      ]);
      
      console.group('📦 Marketplace Data Loaded');
      console.log('Listings Response:', listingsRes.data);
      console.log('Categories Response:', categoriesRes.data);
      
      // Handle different response formats
      let fetchedListings = [];
      let fetchedCategories = [];
      
      // Check if data is directly an array or wrapped in results
      if (Array.isArray(listingsRes.data)) {
        fetchedListings = listingsRes.data;
      } else if (listingsRes.data.results) {
        fetchedListings = listingsRes.data.results;
      } else if (typeof listingsRes.data === 'object') {
        fetchedListings = Object.values(listingsRes.data);
      }
      
      if (Array.isArray(categoriesRes.data)) {
        fetchedCategories = categoriesRes.data;
      } else if (categoriesRes.data.results) {
        fetchedCategories = categoriesRes.data.results;
      } else if (typeof categoriesRes.data === 'object') {
        fetchedCategories = Object.values(categoriesRes.data);
      }
      
      console.log('Parsed Listings:', fetchedListings.length, 'items');
      console.log('Parsed Categories:', fetchedCategories);
      console.groupEnd();
      
      setListings(fetchedListings);
      setCategories(fetchedCategories);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching marketplace data:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load marketplace');
      setLoading(false);
    }
  };

  const handleBuyNow = async (listing) => {
    if (orderingItem === listing.id) return;
    
    setOrderingItem(listing.id);
    try {
      await ordersAPI.createOrder(listing.id);
      toast.success(`Order placed for ${listing.title}! 🎉`);
      fetchData(); // Refresh listings
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to place order';
      toast.error(message);
    } finally {
      setOrderingItem(null);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? listing.category?.id === parseInt(selectedCategory)
      : true;
    return matchesSearch && matchesCategory && listing.status === 'AVAILABLE';
  });

  return (
    <>
      <Navbar />
      <div className="marketplace-container">
        <motion.div
          className="marketplace-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Campus Marketplace 🛍️</h1>
            <p>Buy and sell items within your campus community</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus /> List Item
          </button>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          className="marketplace-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <FiFilter />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Listings Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiShoppingCart />
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            className="listings-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                className="listing-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <div className="listing-image-container">
                  {listing.images?.[0] ? (
                    <img
                      src={`http://localhost:8000${listing.images[0].image}`}
                      alt={listing.title}
                      className="listing-image-full"
                    />
                  ) : (
                    <div className="listing-no-image">
                      <FiShoppingCart />
                    </div>
                  )}
                  <span className="listing-badge badge-success">
                    {listing.status}
                  </span>
                </div>

                <div className="listing-details">
                  <h3>{listing.title}</h3>
                  <p className="listing-description">
                    {listing.description || 'No description available'}
                  </p>

                  <div className="listing-meta">
                    {listing.category && (
                      <span className="badge badge-primary">
                        {listing.category.name}
                      </span>
                    )}
                    <span className="listing-owner">
                      by {listing.owner?.username}
                    </span>
                  </div>

                  <div className="listing-footer">
                    <span className="listing-price-large">₹{listing.price}</span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleBuyNow(listing)}
                      disabled={orderingItem === listing.id}
                    >
                      {orderingItem === listing.id ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <FiShoppingCart /> Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchData}
      />
      
      <Footer />
    </>
  );
};

export default Marketplace;
