import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Appearance = () => {
  const { user } = useAuth();
  const { 
    theme, setTheme,
    fontSize, setFontSize,
    colorScheme, setColorScheme,
    animations, setAnimations
  } = useTheme();

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handleColorSchemeChange = (event) => {
    setColorScheme(event.target.value);
  };

  const handleAnimationsChange = (event) => {
    setAnimations(event.target.checked);
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Saving settings:', { theme, fontSize, colorScheme, animations });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Appearance Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Customize the look and feel of your application
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Theme Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                labelId="theme-select-label"
                value={theme}
                label="Theme"
                onChange={handleThemeChange}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="color-scheme-label">Color Scheme</InputLabel>
              <Select
                labelId="color-scheme-label"
                value={colorScheme}
                label="Color Scheme"
                onChange={handleColorSchemeChange}
              >
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="purple">Purple</MenuItem>
                <MenuItem value="orange">Orange</MenuItem>
              </Select>
            </FormControl>

            <Typography gutterBottom>
              Font Size: {fontSize}px
            </Typography>
            <Slider
              value={fontSize}
              min={12}
              max={24}
              step={1}
              onChange={handleFontSizeChange}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={animations}
                  onChange={handleAnimationsChange}
                  color="primary"
                />
              }
              label="Enable animations"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                p: 2,
                height: 250,
                border: '1px solid #ddd',
                borderRadius: 1,
                bgcolor: theme === 'dark' ? '#121212' : '#fff',
                color: theme === 'dark' ? '#fff' : '#121212',
                fontSize: `${fontSize}px`,
                transition: animations ? 'all 0.3s ease' : 'none',
              }}
            >
              <Typography variant="h6" gutterBottom style={{ color: theme === 'dark' ? '#fff' : '#121212' }}>
                Preview Text
              </Typography>
              <Typography paragraph style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>
                This is how your content will look with the selected appearance settings.
                The quick brown fox jumps over the lazy dog.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Appearance;