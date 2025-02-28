import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as LogoutIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const Sidebar = ({ drawerWidth, collapsedWidth }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard', 
      roles: ['user', 'manager', 'admin', 'superadmin']
    },
    { 
      text: 'Users', 
      icon: <PeopleIcon />, 
      path: '/users', 
      roles: ['manager', 'admin', 'superadmin']
    },
    { 
      text: 'Database', 
      icon: <StorageIcon />, 
      path: '/database', 
      roles: ['admin', 'superadmin']
    },
    { 
      text: 'Security', 
      icon: <SecurityIcon />, 
      path: '/security', 
      roles: ['admin', 'superadmin']
    },
    { 
      text: 'Appearance', 
      icon: <PaletteIcon />, 
      path: '/appearance', 
      roles: ['admin', 'superadmin']
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings', 
      roles: ['user', 'manager', 'admin', 'superadmin']
    },
  ];

  const handleToggle = () => {
    setOpen(!open);
  };

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Filter menu items by user role
  const filteredMenuItems = menuItems.filter(
    item => item.roles.includes(user.role)
  );

  const sidebarContent = (
    <div className={`sidebar ${open ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo">
            <BadgeIcon />
          </div>
          <Typography variant="h6" className="sidebar-logo-text">
            AuthSys
          </Typography>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={handleToggle}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeftIcon 
            className={`sidebar-toggle-icon ${open ? 'expanded' : ''}`} 
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-section-title">Main Navigation</div>
          
          {filteredMenuItems.map((item) => (
            <div 
              key={item.text} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              tabIndex={0}
              role="button"
            >
              <div className="nav-icon">
                {item.icon}
              </div>
              <div className="nav-text">
                {item.text}
              </div>
              {!open && (
                <div className="nav-tooltip">
                  {item.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile / Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="user-name">
                {user.name}
              </div>
              <div className="user-role">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
            </div>
          </div>
          <button 
            className="user-logout"
            onClick={logout}
            aria-label="Logout"
          >
            <LogoutIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Drawer */}
      {!isMobile && (
        <Box 
          component="aside"
          sx={{
            width: open ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : collapsedWidth,
              boxSizing: 'border-box',
              transition: theme => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <div className={`mobile-backdrop ${mobileOpen ? 'visible' : ''}`} onClick={toggleMobileDrawer} />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMobileDrawer}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1100,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <div className={`sidebar mobile-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
