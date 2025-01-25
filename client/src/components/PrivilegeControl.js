// client/src/components/PrivilegeControl.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosConfig.js';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const privilegeDescriptions = {
  'content.view': 'View content in the system',
  'content.create': 'Create new content',
  'content.edit': 'Edit existing content',
  'content.delete': 'Delete content',
  'user.view': 'View user information',
  'user.edit': 'Edit user information',
  'system.view_logs': 'View system logs',
  'security.view_logs': 'View security logs',
  'security.manage_permissions': 'Manage user permissions'
};

const PrivilegeControl = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const [newRequest, setNewRequest] = useState({
    privileges: [],
    reason: '',
    duration: 7
  });

  // Role-based available privileges
  const availablePrivileges = {
    user: ['content.create', 'content.edit'],
    manager: ['user.view', 'user.edit', 'content.delete'],
    admin: ['system.view_logs', 'security.view_logs', 'security.manage_permissions']
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/privilege-requests');
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests');
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/privilege-requests', newRequest);
      setNewRequest({ privileges: [], reason: '', duration: 7 });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleReviewRequest = async (status) => {
    try {
      await api.put(`/privilege-requests/${selectedRequest._id}/review`, {
        status,
        notes: reviewNotes
      });
      setOpenDialog(false);
      setSelectedRequest(null);
      setReviewNotes('');
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to review request');
    }
  };

  const openReviewDialog = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  // Different views based on user role
  const renderUserView = () => (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Request New Privileges
        </Typography>
        <form onSubmit={handleSubmitRequest}>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Available Privileges
            </Typography>
            {availablePrivileges[user.role]?.map((privilege) => (
              <FormControlLabel
                key={privilege}
                control={
                  <Checkbox
                    checked={newRequest.privileges.includes(privilege)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setNewRequest(prev => ({
                        ...prev,
                        privileges: checked 
                          ? [...prev.privileges, value]
                          : prev.privileges.filter(p => p !== value)
                      }));
                    }}
                    value={privilege}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{privilege}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {privilegeDescriptions[privilege]}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Request"
            value={newRequest.reason}
            onChange={(e) => setNewRequest(prev => ({
              ...prev,
              reason: e.target.value
            }))}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            type="number"
            label="Duration (days)"
            value={newRequest.duration}
            onChange={(e) => setNewRequest(prev => ({
              ...prev,
              duration: parseInt(e.target.value)
            }))}
            inputProps={{ min: 1, max: 30 }}
            sx={{ mb: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Submit Request
          </Button>
        </form>
      </Paper>
    </Box>
  );

  const renderAdminView = () => (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pending Privilege Requests
        </Typography>
        <List>
          {requests
            .filter(r => r.status === 'pending')
            .map((request) => (
              <ListItem
                key={request._id}
                alignItems="flex-start"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1">
                        {request.userId.name}
                      </Typography>
                      <Box>
                        <Button
                          color="primary"
                          size="small"
                          onClick={() => openReviewDialog(request)}
                        >
                          Review
                        </Button>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        Requested Privileges:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {request.requestedPrivileges.map(privilege => (
                          <Chip
                            key={privilege}
                            label={privilege}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                      <Typography variant="body2">
                        Reason: {request.reason}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Requested: {new Date(request.requestedAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
        </List>
      </Paper>
    </Box>
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Privilege Management
      </Typography>

      {user.role !== 'superadmin' && renderUserView()}
      {(user.role === 'admin' || user.role === 'superadmin') && renderAdminView()}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Review Privilege Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review Notes"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleReviewRequest('rejected')} color="error">
            Reject
          </Button>
          <Button onClick={() => handleReviewRequest('approved')} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrivilegeControl;