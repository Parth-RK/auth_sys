import React, { useState, useEffect } from 'react';
import { api } from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Chip,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  SupervisorAccount as AdminIcon,
  Assignment as ManagerIcon
} from '@mui/icons-material';

const roleConfig = {
  user: { color: 'info', icon: <PersonIcon />, label: 'User' },
  manager: { color: 'success', icon: <ManagerIcon />, label: 'Manager' },
  admin: { color: 'warning', icon: <AdminIcon />, label: 'Admin' },
  superadmin: { color: 'error', icon: <SecurityIcon />, label: 'Super Admin' }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    type: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updateData = formData) => {
    try {
      const response = await api.put(`/users/${userId}`, updateData);
      setUsers(users.map(user => 
        user._id === userId ? response.data : user
      ));
      setSelectedUser(null);
      setFormData({ name: '', email: '', role: 'user' });
      setOpenDialog(false);
      showSnackbar('User updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      showSnackbar('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      showSnackbar('User deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      showSnackbar('Failed to delete user', 'error');
    }
  };

  const handleDeleteConfirm = (user) => {
    // Special check for superadmin
    if (user.role === 'superadmin' && user._id === currentUser._id) {
      showSnackbar("Superadmin cannot delete their own account", "error");
      return;
    }

    const isSelfDelete = user._id === currentUser._id;
    
    setConfirmDialog({
      open: true,
      title: isSelfDelete ? 'Delete Your Account' : 'Confirm Delete',
      message: isSelfDelete 
        ? 'Are you sure you want to delete your account? This action cannot be undone.'
        : `Are you sure you want to delete user "${user.name}"?`,
      action: () => handleDeleteUser(user._id),
      type: 'delete'
    });
  };

  const handleRoleChangeConfirm = (userId, newRole) => {
    const targetUser = users.find(u => u._id === userId);
    if (!targetUser) return;

    if (userId === currentUser._id) {
      showSnackbar("You cannot modify your own role", "error");
      return;
    }

    const roleLabel = roleConfig[newRole].label;
    const currentRoleLabel = roleConfig[targetUser.role].label;
    
    setConfirmDialog({
      open: true,
      title: 'Confirm Role Change',
      message: `Are you sure you want to change ${targetUser.name}'s role from ${currentRoleLabel} to ${roleLabel}?`,
      action: () => handleUpdateUser(userId, { ...formData, role: newRole }),
      type: 'role'
    });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', role: 'user' });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={roleConfig[user.role].icon}
                        label={roleConfig[user.role].label}
                        color={roleConfig[user.role].color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        {/* Fixed delete button condition - now first */}
                        {(currentUser.role === 'superadmin' || 
                          currentUser.role === 'admin' || 
                          currentUser._id === user._id) && 
                          !(user.role === 'superadmin' && user._id === currentUser._id) && (
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteConfirm(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        {/* Edit button condition - now second */}
                        {(currentUser.role === 'superadmin' ||
                          (currentUser.role === 'admin' && user.role !== 'superadmin')) && (
                          <IconButton
                            color="primary"
                            onClick={() => handleSelectUser(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}

      {/* Custom Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle sx={{ 
          color: confirmDialog.type === 'delete' ? 'error.main' : 'primary.main' 
        }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.type === 'delete' ? 'error' : 'primary'}
            onClick={() => {
              confirmDialog.action();
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Create User'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }} spacing={3}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            {currentUser.role === 'superadmin' && selectedUser?._id !== currentUser._id && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => {
                    if (e.target.value !== formData.role) {
                      handleRoleChangeConfirm(selectedUser._id, e.target.value);
                    }
                  }}
                  label="Role"
                >
                  {Object.entries(roleConfig).map(([role, config]) => (
                    <MenuItem key={role} value={role}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {config.icon}
                        {config.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => handleUpdateUser(selectedUser._id)}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;