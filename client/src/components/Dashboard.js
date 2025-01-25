import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Assignment as AssignmentIcon,
  SupervisorAccount as AdminIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const roleConfig = {
  user: {
    color: 'info',
    icon: <PersonIcon />,
    features: ['View Content', 'Create Basic Posts', 'Edit Own Content']
  },
  manager: {
    color: 'success',
    icon: <AssignmentIcon />,
    features: ['User Management', 'Content Approval', 'Reports Access']
  },
  admin: {
    color: 'warning',
    icon: <AdminIcon />,
    features: ['Full User Control', 'System Settings', 'Security Logs']
  },
  superadmin: {
    color: 'error',
    icon: <SecurityIcon />,
    features: ['Global Access', 'Permission Management', 'System Configuration']
  }
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleData = roleConfig[user.role];
  const [logoutDialog, setLogoutDialog] = useState(false);

  const handleLogout = () => {
    setLogoutDialog(true);
  };

  const handleNavigate = (path) => {
    console.log('Navigating to:', path); // Debug
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <DashboardIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={roleData.icon}
              label={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`}
              color={roleData.color}
              sx={{ 
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            />
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* User Welcome Card */}
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white'
              }}
            >
              <Typography variant="h4" gutterBottom>
                Welcome, {user.name}!
              </Typography>
              <Typography variant="subtitle1">
                Access Level: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Typography>
            </Paper>
          </Grid>

          {/* Available Features */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Available Features
              </Typography>
              <Grid container spacing={2}>
                {roleData.features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'scale(1.02)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {feature}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNavigate('/privileges')}
                      startIcon={<SecurityIcon />}
                      fullWidth
                    >
                      Manage Privileges
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleNavigate('/users')}
                      startIcon={<AdminIcon />}
                      fullWidth
                    >
                      User Management
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Updated Logout Confirmation Dialog to match other dialogs */}
      <Dialog 
        open={logoutDialog} 
        onClose={() => setLogoutDialog(false)}
      >
        <DialogTitle sx={{ 
          color: 'error.main'  // Changed to use theme color
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLogoutDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"  // Changed to use theme color
            onClick={() => {
              logout();
              setLogoutDialog(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};