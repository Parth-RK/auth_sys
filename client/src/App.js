import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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

// Component that handles the page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Define which transitions to use based on paths
  const getTransitionClasses = () => {
    const path = location.pathname;
    // Determine which way we're transitioning
    if (path === URLS.REGISTER) {
      return "auth-page-slide-left"; // Sliding from login to register
    } else if (path === URLS.LOGIN) {
      return "auth-page-slide-right"; // Sliding from register to login
    } else {
      return "page-transition"; // Default transition for other pages
    }
  };
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={800} // Increase timeout for smoother transitions
        classNames={getTransitionClasses()}
      >
        <Routes location={location}>
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
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="page-transition-container">
            <AnimatedRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;