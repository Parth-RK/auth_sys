import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    setExpanded(!expanded);
    
    setIsAnimating(true);
    // Remove animation class after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
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

  return (
    <>
      <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {expanded && (
            <Typography variant="h6" className="sidebar-title">
              AuthSys
            </Typography>
          )}
          <button 
            ref={toggleButtonRef}
            className={`sidebar-toggle ${expanded ? 'expanded' : ''} ${isAnimating ? 'sidebar-toggle-animation' : ''}`}
            onClick={handleToggle}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <div className="toggle-line-top"></div>
            <div className="toggle-line-middle"></div>
            <div className="toggle-line-bottom"></div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">            
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
                {expanded && (
                  <div className="nav-text">
                    {item.text}
                  </div>
                )}
                {!expanded && (
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
              {expanded && (
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
            {expanded && (
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
    </>
  );
};

export default Sidebar;
