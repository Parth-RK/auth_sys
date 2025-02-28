import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
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
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const Sidebar = ({ drawerWidth, collapsedWidth }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile || isTablet) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile, isTablet]);
  
  // Auto collapse sidebar on mobile and tablet
  useEffect(() => {
    if (isMobile || isTablet) {
      setOpen(false);
    }
  }, [isMobile, isTablet]);

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
    if (isMobile || isTablet) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
      setIsAnimating(true);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Match animation duration
    }
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

  // Simply render the sidebar with the appropriate classes
  const sidebarClassName = `sidebar ${open ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileOpen ? 'showing' : ''}`;

  const sidebarContent = (
    <div className={sidebarClassName}>
      {/* Sidebar Header - simplified without logo */}
      <div className="sidebar-header">
        {/* Only show the text when expanded */}
        {open && (
          <Typography variant="h6" className="sidebar-title">
            AuthSys
          </Typography>
        )}
        {/* Completely rewritten toggle button with explicit line elements */}
        <button 
          ref={toggleButtonRef}
          className={`sidebar-toggle ${open ? 'expanded' : ''} ${isAnimating ? 'sidebar-toggle-animation' : ''}`}
          onClick={handleToggle}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="toggle-line-top"></div>
          <div className="toggle-line-bottom"></div>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          {open && <div className="sidebar-section-title">Main Navigation</div>}
          
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
              {open && (
                <div className="nav-text">
                  {item.text}
                </div>
              )}
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
            {open && (
              <div>
                <div className="user-name">
                  {user.name}
                </div>
                <div className="user-role">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
            )}
          </div>
          {/* Only render logout button when sidebar is expanded */}
          {open && (
            <button 
              className="user-logout"
              onClick={logout}
              aria-label="Logout"
            >
              <LogoutIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Only render the sidebar directly - no Box container needed */}
      {sidebarContent}
      
      {/* Mobile menu toggle button - always visible on mobile */}
      {(isMobile || isTablet) && (
        <>
          <div 
            className={`mobile-backdrop ${mobileOpen ? 'visible' : ''}`} 
            onClick={() => setMobileOpen(false)}
          />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
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
        </>
      )}
    </>
  );
};

export default Sidebar;
