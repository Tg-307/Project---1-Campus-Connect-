import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getMe: () => api.get('/auth/me/'),
  getInstitutes: () => api.get('/institutes/'),
};

// Marketplace API
export const marketplaceAPI = {
  getListings: (params) => api.get('/listings/', { params }),
  getListing: (id) => api.get(`/listings/${id}/`),
  createListing: (data) => api.post('/listings/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateListing: (id, data) => api.patch(`/listings/${id}/`, data),
  deleteListing: (id) => api.delete(`/listings/${id}/`),
  getCategories: () => api.get('/categories/'),
  uploadImage: (listingId, imageData) => api.post(`/listings/${listingId}/upload_image/`, imageData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/orders/', { params }),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (listingId) => api.post('/orders/', { listing_id: listingId }),
  acceptOrder: (id) => api.patch(`/orders/${id}/accept/`),
  rejectOrder: (id) => api.patch(`/orders/${id}/reject/`),
  completeOrder: (id) => api.patch(`/orders/${id}/complete/`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel/`),
};

// Issues API
export const issuesAPI = {
  getIssues: (params) => api.get('/issues/', { params }),
  getIssue: (id) => api.get(`/issues/${id}/`),
  createIssue: (data) => api.post('/issues/', data),
  updateIssue: (id, data) => api.patch(`/issues/${id}/`, data),
  deleteIssue: (id) => api.delete(`/issues/${id}/`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications/', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/mark_read/`),
  markAllAsRead: () => api.patch('/notifications/mark_all_read/'),
  getUnreadCount: () => api.get('/notifications/unread_count/'),
};

export default api;
