import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${73}px)` },
        }}
      >
        <Box sx={{ marginTop: '64px' }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
