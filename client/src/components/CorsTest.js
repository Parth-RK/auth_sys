import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import axios from 'axios';

const CorsTest = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    try {
      setStatus('loading');
      console.log('Testing connection to:', `${process.env.REACT_APP_API_URL}/api/cors-test`);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cors-test`);
      
      console.log('CORS test response:', response);
      setStatus('success');
      setMessage(`Connection successful: ${response.data.message}`);
    } catch (error) {
      console.error('CORS test error:', error);
      setStatus('error');
      setMessage(`Connection failed: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>CORS Configuration Test</Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={testConnection}
        disabled={status === 'loading'}
      >
        Test API Connection
      </Button>
      
      {status === 'loading' && (
        <Alert severity="info" sx={{ mt: 2 }}>Testing connection...</Alert>
      )}
      
      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>
      )}
      
      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2">API URL:</Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          {process.env.REACT_APP_API_URL || 'Not set'}
        </Typography>
      </Box>
    </Box>
  );
};

export default CorsTest;
