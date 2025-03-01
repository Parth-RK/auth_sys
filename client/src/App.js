import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import PrivilegeControl from './components/PrivilegeControl';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Appearance from './components/Appearance';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import './styles/App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/privileges" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Layout>
                  <PrivilegeControl />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Remove allowedRoles from users route to allow all authenticated users */}
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/appearance" element={
              <ProtectedRoute>
                <Layout>
                  <Appearance />
                </Layout>
              </ProtectedRoute>
            } />
            
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;