import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';
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

  const handleNavigate = (path) => {
    console.log('Navigating to:', path); // Debug
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="dashboard-container pattern-bg">
      <AppBar position="static" sx={{ mb: 4 }} className="app-bar">
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
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* User Welcome Card */}
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              className="welcome-card"
              sx={{ 
                p: 3, 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white'
              }}
            >
              <div className="welcome-content">
                <Typography variant="h4" gutterBottom className="welcome-title fade-in">
                  Welcome, {user.name}!
                </Typography>
                <Typography variant="subtitle1" className="fade-in stagger-item-1">
                  Access Level: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </div>
            </Paper>
          </Grid>

          {/* Available Features */}
          <Grid item xs={12} md={8} className="feature-container fade-in stagger-item-2">
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Available Features
              </Typography>
              <Grid container spacing={2}>
                {roleData.features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} className={`fade-in stagger-item-${index+1}`}>
                    <Card className="feature-card hover-lift">
                      <CardContent>
                        <div className="feature-icon">
                          {roleData.icon}
                        </div>
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
          <Grid item xs={12} md={4} className="fade-in stagger-item-3">
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="action-buttons">
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNavigate('/privileges')}
                      startIcon={<SecurityIcon />}
                      fullWidth
                      className="action-button primary slide-in stagger-item-1"
                    >
                      Manage Privileges
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleNavigate('/users')}
                      startIcon={<AdminIcon />}
                      fullWidth
                      className="action-button secondary slide-in stagger-item-2"
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

      {/* Updated Logout Confirmation Dialog */}
      <Dialog 
        open={logoutDialog} 
        onClose={() => setLogoutDialog(false)}
        className="dialog"
      >
        <DialogTitle className="dialog-title" sx={{ color: 'error.main' }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            onClick={() => setLogoutDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            className="confirm-button"
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