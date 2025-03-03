import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';
import { 
  Typography, Paper, Grid, 
  Button, Chip, Box, Avatar, IconButton, 
  Badge, Menu, MenuItem, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, Tabs, Tab, useTheme, useMediaQuery,
  List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  SupervisorAccount as AdminIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  Folder as FolderIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  NotificationsActive as AlertIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  AreaChart, Area, LineChart, Line, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

// Mock data for visualization
const analyticsData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

const activityFeed = [
  { id: 1, title: 'System Update', description: 'Security patches applied', time: '10 minutes ago', icon: <SecurityIcon color="primary" /> },
  { id: 2, title: 'New User Registered', description: 'User John Smith joined', time: '2 hours ago', icon: <PersonIcon color="success" /> },
  { id: 3, title: 'Server Maintenance', description: 'Scheduled downtime in 24h', time: '5 hours ago', icon: <SettingsIcon color="warning" /> },
];

const notifications = [
  { id: 1, title: 'Security Alert', message: 'Unusual login detected', severity: 'error', unread: true },
  { id: 2, title: 'Update Available', message: 'New version 2.1.0 available', severity: 'info', unread: true },
  { id: 3, title: 'Task Completed', message: 'Backup process completed successfully', severity: 'success', unread: false },
];

const pieData = [
  { name: 'Users', value: 400, color: '#0088FE' },
  { name: 'Managers', value: 300, color: '#00C49F' },
  { name: 'Admins', value: 200, color: '#FFBB28' },
];

const roleConfig = {
  user: {
    color: 'info',
    icon: <PersonIcon />,
    features: ['View Content', 'Create Basic Posts', 'Edit Own Content'],
    metrics: { posts: 24, views: 1284, likes: 36 }
  },
  manager: {
    color: 'success',
    icon: <AssignmentIcon />,
    features: ['User Management', 'Content Approval', 'Reports Access'],
    metrics: { users: 34, pending: 8, reports: 12 }
  },
  admin: {
    color: 'warning',
    icon: <AdminIcon />,
    features: ['Full User Control', 'System Settings', 'Security Logs'],
    metrics: { users: 128, alerts: 3, systems: 16 }
  },
  superadmin: {
    color: 'error',
    icon: <SecurityIcon />,
    features: ['Global Access', 'Permission Management', 'System Configuration'],
    metrics: { servers: 8, services: 24, permissions: 56 }
  }
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const roleData = roleConfig[user.role] || roleConfig.user;
  const metrics = roleData.metrics;

  // State management
  const [currentTab, setCurrentTab] = useState(0);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [featurePreviewOpen, setFeaturePreviewOpen] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState(false);
  const [dashboard, setDashboard] = useState({
    cards: [
      { id: 'card1', title: 'Analytics', type: 'analytics' },
      { id: 'card2', title: 'Activity Feed', type: 'activity' },
      { id: 'card3', title: 'User Distribution', type: 'pie' },
      { id: 'card4', title: 'Quick Stats', type: 'stats' },
    ],
  });

  // Handlers
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExpandClick = () => {
    setExpandedActivities(!expandedActivities);
  };

  const handleFeaturePreviewToggle = () => {
    setFeaturePreviewOpen(!featurePreviewOpen);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(dashboard.cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDashboard({ ...dashboard, cards: items });
  };

  // Render card content based on type
  const renderCardContent = (card) => {
    switch (card.type) {
      case 'analytics':
        return (
          <Box sx={{ height: 300, width: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Monthly Performance
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <RechartsTooltip />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        );
      case 'activity':
        return (
          <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
            <List>
              {activityFeed.map((item) => (
                <ListItem key={item.id} sx={{ borderLeft: '3px solid #e0e0e0', mb: 1, borderRadius: '0 8px 8px 0' }}>
                  <ListItemIcon sx={{ minWidth: '42px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {item.description}
                        </Typography>
                        {` — ${item.time}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button startIcon={<ExpandMoreIcon />} onClick={handleExpandClick}>
                {expandedActivities ? "Show Less" : "Show More"}
              </Button>
            </Box>
          </Box>
        );
      case 'pie':
        return (
          <Box sx={{ height: 300, width: '100%' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              User Role Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        );
      case 'stats':
        return (
          <Grid container spacing={3}>
            {Object.entries(metrics).map(([key, value], index) => (
              <Grid item xs={4} key={key}>
                <Box className="stat-box" sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" className="counter-value">
                    <CountUp end={value} duration={2.5} />
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                    {key}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(value / 100) * 100 > 100 ? 100 : (value / 100) * 100} 
                    sx={{ mt: 1, height: 4, borderRadius: 2 }}
                    className={`progress-${index % 4}`}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return <Typography>No content available</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3}
          className="welcome-card"
        >
          <Box className="welcome-content" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" gutterBottom className="welcome-title">
                  Welcome back, {user.name}!
                </Typography>
                <Typography variant="body1" className="welcome-subtitle">
                  Here's what's happening with your projects today.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className="action-button primary"
                  >
                    New Project
                  </Button>
                  <Button
                    variant="outlined"
                    className="action-button secondary"
                  >
                    View Reports
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
      
      {/* Stats Overview */}
      <Box sx={{ my: 3 }}>
        <Grid container spacing={2}>
          {Object.entries(metrics).map(([key, value], index) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Paper elevation={3} className="stat-card hover-lift" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                        {key}
                      </Typography>
                      <Typography variant="h4" className="counter-value" sx={{ fontWeight: 600, my: 0.5 }}>
                        <CountUp end={value} duration={2} />
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip size="small" label="+12% from last month" color="success" variant="outlined" />
                      </Box>
                    </Box>
                    <Avatar className={`stat-icon stat-icon-${index % 4}`} sx={{ p: 1 }}>
                      {index % 4 === 0 && <SpeedIcon />}
                      {index % 4 === 1 && <PersonIcon />}
                      {index % 4 === 2 && <AlertIcon />}
                      {index % 4 === 3 && <FolderIcon />}
                    </Avatar>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ mb: 3 }}>
        <Paper className="tab-container">
          <Tabs 
            value={currentTab} 
            onChange={handleChangeTab} 
            variant="scrollable"
            scrollButtons="auto"
            className="dashboard-tabs"
          >
            <Tab label="Overview" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Analytics" icon={<InsightsIcon />} iconPosition="start" />
            <Tab label="Activity" icon={<NotificationsIcon />} iconPosition="start" />
          </Tabs>
        </Paper>
      </Box>

      {/* Dashboard Content based on Current Tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab === 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="vertical">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <Grid container spacing={3}>
                      {dashboard.cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <Grid 
                              item 
                              xs={12} 
                              md={card.type === 'analytics' || card.type === 'pie' ? 6 : 6}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <Paper 
                                elevation={snapshot.isDragging ? 6 : 3} 
                                className={`feature-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                sx={{ p: 2, minHeight: 350 }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} {...provided.dragHandleProps}>
                                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    {card.title}
                                  </Typography>
                                  <IconButton size="small">
                                    <MoreIcon />
                                  </IconButton>
                                </Box>
                                {renderCardContent(card)}
                              </Paper>
                            </Grid>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Grid>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          
          {currentTab === 1 && (
            <Grid container spacing={3}>
              {/* Analytics tab content */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, minHeight: 400 }}>
                  <Typography variant="h6" gutterBottom>Detailed Analytics</Typography>
                  <Box sx={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
          
          {currentTab === 2 && (
            <Grid container spacing={3}>
              {/* Activity tab content */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                  <List>
                    {activityFeed.map((item) => (
                      <ListItem key={item.id} sx={{ py: 1.5, borderLeft: '3px solid #e0e0e0', mb: 1, borderRadius: '0 8px 8px 0' }}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.description}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {item.time}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Notifications</Typography>
                  <List>
                    {notifications.map((notification) => (
                      <ListItem key={notification.id} sx={{ py: 1.5, borderLeft: `3px solid ${notification.unread ? theme.palette[notification.severity].main : '#e0e0e0'}`, mb: 1, borderRadius: '0 8px 8px 0' }}>
                        <ListItemIcon>
                          {notification.severity === 'error' && <AlertIcon color="error" />}
                          {notification.severity === 'info' && <NotificationsIcon color="info" />}
                          {notification.severity === 'success' && <CheckCircleIcon color="success" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title}
                          secondary={notification.message}
                        />
                        {notification.unread && <Badge color={notification.severity} variant="dot" />}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Feature Preview Dialog */}
      <Dialog
        open={featurePreviewOpen}
        onClose={() => setFeaturePreviewOpen(false)}
        maxWidth="md"
        fullWidth
        className="dialog feature-preview"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">New Feature Preview</Typography>
            <Chip 
              label="Coming Soon" 
              color="primary" 
              size="small" 
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <InsightsIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.8, mb: 2 }} />
            </motion.div>
            <Typography variant="h5" gutterBottom>
              Advanced Analytics Dashboard
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Get deeper insights with our new AI-powered analytics tools. Coming in the next update!
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button variant="outlined" color="primary">
                Join Beta Program
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Custom Tooltip for Help Tips (sample implementation) */}
      <div id="custom-tooltip" className="custom-tooltip" style={{ display: 'none', position: 'absolute' }}>
        <Paper sx={{ p: 1.5, maxWidth: 220 }} className="glassmorphism">
          <Typography variant="subtitle2">Quick Tip</Typography>
          <Typography variant="body2">
            You can drag and drop cards to customize your dashboard layout!
          </Typography>
        </Paper>
      </div>
    </Box>
  );
};