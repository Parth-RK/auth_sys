import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get saved preferences from localStorage or use defaults
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light');
  const [fontSize, setFontSize] = useState(() => 
    parseInt(localStorage.getItem('fontSize') || '16'));
  const [colorScheme, setColorScheme] = useState(() => 
    localStorage.getItem('colorScheme') || 'blue');
  const [animations, setAnimations] = useState(() => 
    localStorage.getItem('animations') !== 'false');

  // Apply theme to document when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    localStorage.setItem('colorScheme', colorScheme);
    
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize/16}rem`;
    localStorage.setItem('fontSize', fontSize.toString());
    
    // Apply animation settings
    if (animations) {
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.classList.add('no-animations');
    }
    localStorage.setItem('animations', animations.toString());
  }, [theme, fontSize, colorScheme, animations]);

  // Value object to be provided to consumers
  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    colorScheme,
    setColorScheme,
    animations,
    setAnimations,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);