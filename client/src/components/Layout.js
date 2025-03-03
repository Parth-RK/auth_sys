import React, { useState, useEffect, useRef } from 'react';
import { CssBaseline } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import '../styles/layout.css';

// Import icons from the same location as Sidebar.js
import { 
  Shield, 
  LightMode, 
  DarkMode, 
  Notifications, 
  AccountCircle, 
  Person, 
  Settings, 
  Help, 
  Logout, 
  VerifiedUser, 
  Security, 
  Update, 
  Schedule, 
  ArrowForward, 
  DoneAll, 
  Badge, 
  NotificationsOff 
} from '@mui/icons-material';

const Layout = ({ children }) => {
  // Use the correct properties from the auth context
  const { user, logout } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      icon: 'verified_user',
      message: 'Your account was verified successfully',
      time: '2 min ago',
      read: false,
      color: '#4caf50' // success green
    },
    {
      id: 2,
      type: 'warning',
      icon: 'security',
      message: 'Security alert: new login from Chrome',
      time: '1 hour ago',
      read: false,
      color: '#ff9800' // warning orange
    },
    {
      id: 3,
      type: 'info',
      icon: 'update',
      message: 'System update completed',
      time: 'Yesterday',
      read: false,
      color: '#2196f3' // info blue
    }
  ]);
  
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const profileIconRef = useRef(null);
  const notificationIconRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode toggle with localStorage persistence
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
  };

  // Check for saved dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  // Handle clicks outside of dropdown menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && 
          profileIconRef.current && !profileIconRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target) &&
          notificationIconRef.current && !notificationIconRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false); // Close profile menu if open
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false); // Close notifications if open
  };
  
  // Handle logout using the auth context
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by the auth context/router
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
    // Update the notification count
    setNotificationCount(notifications.filter(notif => !notif.read).length - 1);
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setNotificationCount(0);
  };

  // Get username from user object based on AuthContext structure
  const username = user?.name || (user?.email?.split('@')[0]) || 'User';
  
  // Get email from user data
  const userEmail = user?.email || '';

  // Get user role
  const userRole = user?.role || 'user';

  return (
    <div className="layout-container">
      <CssBaseline />
      
      {/* Scroll Progress Indicator */}
      <div 
        className="scroll-progress" 
        style={{ 
          transform: `scaleX(${scrolled ? window.scrollY / (document.body.scrollHeight - window.innerHeight) : 0})`,
          zIndex: 2500
        }} 
      />
      
      <Sidebar />
      
      {/* Apply left margin to push content away from sidebar */}
      <div className="layout-content-wrapper">
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-brand">
            <div className="header-logo">
              <Shield fontSize="medium" />
            </div>
            <div className="header-title">Authentication System</div>
          </div>
          <div className="header-actions">
            {/* Dark Mode Toggle */}
            <button 
              className={`icon-button ${darkMode ? 'active' : ''}`} 
              onClick={toggleDarkMode} 
              title="Toggle Dark Mode"
              aria-label="Toggle dark mode"
            >
              <span className="icon-transition">
                {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </span>
            </button>
            
            {/* Notifications */}
            <div className="dropdown-container">
              <button 
                ref={notificationIconRef}
                className={`icon-button ${showNotifications ? 'active' : ''}`} 
                onClick={handleNotificationClick} 
                title="Notifications"
                aria-label="Show notifications"
              >
                <span className="icon-transition">
                  <Notifications fontSize="small" />
                </span>
                {notificationCount > 0 && (
                  <span className="notification-badge"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div ref={notificationMenuRef} className="dropdown-menu notification-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-header-title">
                      <Notifications fontSize="small" color="primary" />
                      <h3>Notifications</h3>
                    </div>
                    {notificationCount > 0 && (
                      <button 
                        className="text-button" 
                        onClick={clearAllNotifications}
                      >
                        <DoneAll fontSize="small" />
                        <span>Mark all as read</span>
                      </button>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="notification-list custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(notification => {
                        // Determine which icon to use based on the notification type
                        let IconComponent;
                        switch (notification.icon) {
                          case 'verified_user':
                            IconComponent = VerifiedUser;
                            break;
                          case 'security':
                            IconComponent = Security;
                            break;
                          case 'update':
                            IconComponent = Update;
                            break;
                          default:
                            IconComponent = Notifications;
                        }
                        
                        return (
                          <div 
                            key={notification.id} 
                            className={`notification-item ${notification.read ? 'read' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div 
                              className="notification-icon-container" 
                              style={{ backgroundColor: `${notification.color}20` }}
                            >
                              <IconComponent 
                                style={{ color: notification.color }}
                                fontSize="small"
                                className="notification-icon"
                              />
                            </div>
                            <div className="notification-content">
                              <p>{notification.message}</p>
                              <span className="notification-time">
                                <Schedule fontSize="inherit" className="notification-time-icon" />
                                {notification.time}
                              </span>
                            </div>
                            {!notification.read && (
                              <div className="unread-indicator"></div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-state">
                        <NotificationsOff fontSize="large" className="empty-icon" />
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-footer">
                    <a href="/notifications" className="view-all-link">
                      <span>View all notifications</span>
                      <ArrowForward fontSize="small" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="dropdown-container">
              <button 
                ref={profileIconRef}
                className={`icon-button ${showProfileMenu ? 'active' : ''}`}
                onClick={handleProfileClick}
                title={`${username}'s Profile`}
                aria-label="User profile menu"
              >
                <span className="icon-transition">
                  <AccountCircle fontSize="small" />
                </span>
              </button>
              
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div ref={profileMenuRef} className="dropdown-menu profile-menu">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={username} 
                          className="avatar-image"
                        />
                      ) : (
                        <Person fontSize="large" />
                      )}
                    </div>
                    <div className="profile-info">
                      <h3>{username}</h3>
                      <p>{userEmail}</p>
                      <span className="user-role">
                        <Badge fontSize="small" className="role-icon" />
                        {userRole}
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-items">
                    <a href="/profile" className="dropdown-item">
                      <Person fontSize="small" />
                      <span>Profile</span>
                    </a>
                    <a href="/settings" className="dropdown-item">
                      <Settings fontSize="small" />
                      <span>Settings</span>
                    </a>
                    <a href="/help" className="dropdown-item">
                      <Help fontSize="small" />
                      <span>Support</span>
                    </a>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <Logout fontSize="small" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="layout-content">
          <div className="page-container">
            {children}
          </div>
        </main>
        
        <footer className="footer">
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/support" className="footer-link">Contact Support</a>
          </div>
          <div>© {new Date().getFullYear()} PRK Auth System. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
