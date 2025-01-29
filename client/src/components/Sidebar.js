import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ drawerWidth, collapsedWidth }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['user', 'manager', 'admin', 'superadmin'] },
    { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['user', 'manager', 'admin', 'superadmin'] },
    { text: 'Database', icon: <StorageIcon />, path: '/database', roles: ['superadmin'] },
    { text: 'Security', icon: <SecurityIcon />, path: '/security', roles: ['admin', 'superadmin'] },
    { text: 'Appearance', icon: <PaletteIcon />, path: '/appearance', roles: ['admin', 'superadmin'] },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin', 'superadmin'] },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        position: 'fixed',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        '& .MuiDrawer-paper': {
          position: 'fixed',
          left: 0,
          width: open ? drawerWidth : collapsedWidth,
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: '0.3s', // Synchronized duration
          }),
          overflowX: 'hidden',
          borderRight: theme => `1px solid ${theme.palette.divider}`,
          boxSizing: 'border-box',
          height: '100%',
          whiteSpace: 'nowrap',
        },
      }}
    >
      <DrawerHeader>
        <IconButton 
          onClick={() => setOpen(!open)}
          sx={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: theme => theme.transitions.create(['transform', 'margin'], {
              duration: theme.transitions.duration.shortest,
            }),
          }}
        >
          <MenuIcon />
        </IconButton>
      </DrawerHeader>
      
      <List>
        {menuItems
          .filter(item => item.roles.includes(user.role))
          .map((item) => (
            <Tooltip
              key={item.text}
              title={!open ? item.text : ''}
              placement="right"
            >
              <ListItem
                button
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    transition: theme => theme.transitions.create('margin', {
                      duration: '0.3s', // Synchronized duration
                    }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Box
                  component="span"
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: theme => theme.transitions.create('opacity', {
                      duration: '0.2s',
                      delay: open ? '0.1s' : '0s', // Show text after width expands
                    }),
                    display: 'block',
                    width: open ? 'auto' : 0,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    visibility: open ? 'visible' : 'hidden',
                    transitionProperty: 'opacity, visibility',
                    transitionDuration: '0.2s',
                    transitionDelay: open ? '0.1s' : '0s',
                  }}
                >
                  <ListItemText primary={item.text} />
                </Box>
              </ListItem>
            </Tooltip>
          ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
