import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiDollarSign, FiTag, FiFileText } from 'react-icons/fi';
import { marketplaceAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './CreateListingModal.css';

const CreateListingModal = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await marketplaceAPI.getCategories();
      
      console.group('📂 Categories Fetch in Modal');
      console.log('Response:', response.data);
      console.log('Type:', typeof response.data);
      console.log('Is Array:', Array.isArray(response.data));
      
      // Handle different response formats
      let cats = [];
      if (Array.isArray(response.data)) {
        cats = response.data;
      } else if (response.data.results) {
        cats = response.data.results;
      } else if (typeof response.data === 'object') {
        cats = Object.values(response.data);
      }
      
      console.log('Parsed categories:', cats);
      console.log('Categories count:', cats.length);
      console.groupEnd();
      
      setCategories(cats);
      
      if (cats.length === 0) {
        toast.info('No categories available. Contact admin to create categories for your institute.');
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the listing
      const listingData = new FormData();
      listingData.append('title', formData.title);
      listingData.append('description', formData.description);
      listingData.append('price', formData.price);
      if (formData.category_id) {
        listingData.append('category_id', formData.category_id);
      }

      const listingResponse = await marketplaceAPI.createListing(listingData);
      const listingId = listingResponse.data.id;

      // Upload images if any
      if (images.length > 0) {
        for (const image of images) {
          const imageData = new FormData();
          imageData.append('image', image);
          try {
            await marketplaceAPI.uploadImage(listingId, imageData);
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      }

      toast.success('Listing created successfully! 🎉');
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Failed to create listing';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category_id: '',
    });
    setImages([]);
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
            <h2>List New Item</h2>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="input-group">
              <label htmlFor="title">
                <FiTag /> Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="What are you selling?"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">
                <FiFileText /> Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                placeholder="Describe your item..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="price">
                  <FiDollarSign /> Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="images">
                <FiUpload /> Images (optional)
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {images.length > 0 && (
                <p className="file-count">{images.length} file(s) selected</p>
              )}
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
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  'Create Listing'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateListingModal;
