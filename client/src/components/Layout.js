import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import '../styles/layout.css';


const Layout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="layout-container">
      <CssBaseline />
      
      {/* Scroll Progress Indicator */}
      <div 
        className="scroll-progress" 
        style={{ 
          transform: `scaleX(${scrolled ? window.scrollY / (document.body.scrollHeight - window.innerHeight) : 0})`,
          zIndex: 2500
        }} 
      />
      
      <Sidebar />
      
      {/* Apply left margin to push content away from sidebar */}
      <div className="layout-content-wrapper">
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-brand">
            <div className="header-logo">
              <span className="material-icons"></span>
            </div>
            <div className="header-title">Authentication System</div>
          </div>
          <div className="header-actions">
            {/* Header actions can be added here */}
          </div>
        </header>
        
        <main className="layout-content">
          <div className="page-container">
            {children}
          </div>
        </main>
        
        <footer className="footer">
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/support" className="footer-link">Contact Support</a>
          </div>
          <div>© {new Date().getFullYear()} PRK Auth System. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
