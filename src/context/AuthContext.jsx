import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const userResponse = await authAPI.getMe();
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      toast.success('Welcome back! 🎉');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 
                      error.response?.data?.username?.[0] || 
                      'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      toast.info('You have been logged out');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
