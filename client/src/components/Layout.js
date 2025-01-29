import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 73;

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar drawerWidth={DRAWER_WIDTH} collapsedWidth={COLLAPSED_DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',  // Center horizontally
          ml: `${COLLAPSED_DRAWER_WIDTH}px`, // Add margin for collapsed sidebar
          width: `calc(100% - ${COLLAPSED_DRAWER_WIDTH}px)`,
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            maxWidth: 1200,  // Maximum width for content
            mt: '64px',      // Top margin for header
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
