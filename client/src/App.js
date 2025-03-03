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
import { URLS } from './utils/urls';

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
            <Route path={URLS.LOGIN} element={<Login />} />
            <Route path={URLS.REGISTER} element={<Register />} />
            <Route path={URLS.HOME} element={<Login />} />
            
            {/* Protected Routes with Layout */}
            <Route path={URLS.DASHBOARD} element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path={URLS.PRIVILEGES} element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Layout>
                  <PrivilegeControl />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Remove allowedRoles from users route to allow all authenticated users */}
            <Route path={URLS.USERS} element={
              <ProtectedRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path={URLS.APPEARANCE} element={
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