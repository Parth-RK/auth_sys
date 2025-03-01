// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Fix baseURL to properly handle API paths
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://auth-sys-backend.onrender.com/api';

// Log the actual baseURL being used for debugging
console.log('AuthContext using baseURL:', axios.defaults.baseURL);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const res = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post('/auth/login', credentials);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      // Use the default axios configuration which already has the baseURL set
      const res = await axios.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
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