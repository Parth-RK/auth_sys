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

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['user', 'admin', 'superadmin'] },
    { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['admin', 'superadmin'] },
    { text: 'Database', icon: <StorageIcon />, path: '/database', roles: ['superadmin'] },
    { text: 'Security', icon: <SecurityIcon />, path: '/security', roles: ['admin', 'superadmin'] },
    { text: 'Appearance', icon: <PaletteIcon />, path: '/appearance', roles: ['admin', 'superadmin'] },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['admin', 'superadmin'] },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 73,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 73,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerHeader>
        <IconButton 
          onClick={() => setOpen(!open)}
          sx={{
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: theme => theme.transitions.create('transform', {
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
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
