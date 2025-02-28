// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [passwordRules, setPasswordRules] = useState([
    { text: 'At least 8 characters', met: false },
    { text: 'At least one uppercase letter', met: false },
    { text: 'At least one lowercase letter', met: false },
    { text: 'At least one number', met: false },
    { text: 'At least one special character', met: false }
  ]);
  const { register } = useAuth();
  const navigate = useNavigate();

  // SIMPLIFIED: Just check password formatting rules for UI feedback
  // This doesn't replace backend validation, just provides visual guidance
  const checkPasswordRules = (password) => {
    // Skip validation for admin password
    if (password === 'admin') {
      return setPasswordRules(passwordRules.map(rule => ({...rule, met: true})));
    }
    
    setPasswordRules([
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'At least one lowercase letter', met: /[a-z]/.test(password) },
      { text: 'At least one number', met: /[0-9]/.test(password) },
      { text: 'At least one special character', met: /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password) }
    ]);
  };

  // Update visual feedback when password changes
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    checkPasswordRules(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Only check password match on client side
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.data?.validationFailed) {
        // Update our password rules based on server response
        const serverErrors = err.response.data.passwordErrors || [];
        setPasswordRules(passwordRules.map(rule => {
          // Match rule with server error
          const hasError = serverErrors.some(error => error.includes(rule.text.toLowerCase()));
          return {...rule, met: !hasError};
        }));
      }
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              helperText={formData.password === 'admin' ? 'Using admin password' : ''}
            />
            
            {/* Password requirements checklist */}
            {formData.password && formData.password !== 'admin' && (
              <List dense sx={{ mb: 2 }}>
                {passwordRules.map((rule, idx) => (
                  <ListItem key={idx} sx={{ p: 0 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {rule.met ? (
                        <CheckIcon color="success" fontSize="small" />
                      ) : (
                        <CloseIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={rule.text} 
                      primaryTypographyProps={{ 
                        variant: 'caption',
                        color: rule.met ? 'success.main' : 'error' 
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
              helperText={
                formData.password !== formData.confirmPassword && formData.confirmPassword !== '' 
                  ? "Passwords don't match" 
                  : ''
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Typography align="center">
              Already have an account? <Link to="/login">Sign In</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};