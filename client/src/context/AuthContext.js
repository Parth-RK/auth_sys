// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { URLS } from '../utils/urls';

// Create a dedicated axios instance for auth with the correct baseURL
const authAxios = axios.create({
  baseURL: URLS.API.BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Log the actual baseURL being used for debugging
console.log('AuthContext creating axios instance with baseURL:', URLS.API.BASE);

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
      // Use the authAxios instance with the API endpoint
      const url = URLS.API.AUTH.PROFILE;
      console.log(`Loading user from: ${URLS.API.BASE}${url}`);
      
      const res = await authAxios.get(url, {
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
      // Use the authAxios instance with the API endpoint
      const url = URLS.API.AUTH.LOGIN;
      console.log(`Logging in to: ${URLS.API.BASE}${url}`);
      
      const res = await authAxios.post(url, credentials);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      // Use the authAxios instance with the API endpoint
      const url = URLS.API.AUTH.REGISTER;
      console.log(`Registering at: ${URLS.API.BASE}${url}`);
      
      const res = await authAxios.post(url, {
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