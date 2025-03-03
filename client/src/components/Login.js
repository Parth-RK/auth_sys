import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '@mui/material';
import '../styles/login.css';

// Import Material icons as SVG paths
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Check if we're coming from register page
    const fromRegister = location.state?.from === 'register';
    if (fromRegister) {
      setAnimationClass('to-login');
    }
    
    // Animation effect for loading elements
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 100 * index + (fromRegister ? 800 : 0)); // Delay if coming from register
    });
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    // Add animation class before navigation
    setAnimationClass('to-register');
    // Navigate after animation starts
    setTimeout(() => {
      navigate('/register', { state: { from: 'login' } });
    }, 100);
  };

  return (
    <div className={`landing-container ${animationClass}`}>
      {/* Background decorative elements */}
      <div className="bg-circles">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Left side with brand messaging */}
      <div className="landing-left">
        <div className="landing-left-content">
          <div className="brand fade-in">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <div className="brand-name">AuthSys</div>
          </div>

          <h1 className="landing-tagline fade-in">
            Secure Authentication <br />For Modern Applications
          </h1>
          
          <p className="landing-subtitle fade-in">
            A powerful, flexible authentication system that helps you manage users, 
            control permissions, and secure your applications with ease.
          </p>

          <ul className="feature-list">
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>Role-based access control</span>
            </li>
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>Secure JWT authentication</span>
            </li>
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>User management dashboard</span>
            </li>
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>Customizable permissions</span>
            </li>
          </ul>

          <div className="testimonials fade-in">
            <p className="testimonial-text">"Authentication is the process of determining whether someone or something is, in fact, who or what it is declared to be."</p>
            <p className="testimonial-author">— Wikipedia</p>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="landing-right">
        <div className="login-container fade-in">
          <div className="login-header">
            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input-field"
                type="email"
                required
                placeholder="your@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
              <span className="input-icon"><EmailIcon /></span>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input-field"
                type="password"
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
              <span className="input-icon"><LockIcon /></span>
            </div>

            <div className="input-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" style={{ marginLeft: '8px', fontSize: '14px', color: 'var(--neutral-600)' }}>Remember me</label>
              </div>
              <a href="#forgot-password" style={{ fontSize: '14px', color: 'var(--primary-main)', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <button 
              className="login-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="login-divider">
              <div className="divider-line"></div>
              <span className="divider-text">or continue with</span>
              <div className="divider-line"></div>
            </div>

            <div className="social-login">
              {/* Google */}
              <button type="button" className="social-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              {/* GitHub */}
              <button type="button" className="social-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1.27c-6.07 0-11 4.93-11 11 0 4.86 3.15 8.98 7.51 10.43.55.1.75-.24.75-.53v-1.86c-3.05.66-3.69-1.47-3.69-1.47-.5-1.27-1.22-1.6-1.22-1.6-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.42-.28-4.97-1.21-4.97-5.38 0-1.19.42-2.16 1.12-2.92-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3 1.12.87-.24 1.8-.36 2.73-.37.93 0 1.86.13 2.73.37 2.08-1.41 3-.13.01 0 3 0 0 .6-.23 1.11.86 0 1.28 1.73 1.28 2.91 0 4.18-2.57 5.1-5 5.37.39.34.74 1.01.74 2.02v3c0 .29.2.63.76.52 4.35-1.45 7.5-5.57 7.5-10.42 0-6.07-4.93-11-11-11z" fill="#333"/>
                </svg>
              </button>
              {/* Twitter */}
              <button type="button" className="social-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" fill="#1DA1F2"/>
                </svg>
              </button>
            </div>
          </form>

          <div className="register-link">
            Don't have an account? <a href="/register" onClick={handleRegisterClick}>Create account</a>
          </div>
        </div>
      </div>
    </div>
  );
};