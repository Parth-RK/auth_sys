// src/components/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from '@mui/material';
import '../styles/register.css';
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

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordRules, setPasswordRules] = useState([
    { text: 'At least 8 characters', met: false },
    { text: 'At least one uppercase letter', met: false },
    { text: 'At least one lowercase letter', met: false },
    { text: 'At least one number', met: false },
    { text: 'At least one special character', met: false }
  ]);
  // Add state for slide animation direction
  const [slideDirection, setSlideDirection] = useState('right');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Animation effect for loading elements
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 100 * index);
    });
  }, []);

  const checkPasswordRules = (password) => {
    if (!password) {
      setPasswordStrength('');
      return setPasswordRules(passwordRules.map(rule => ({...rule, met: false})));
    }
    
    // Special case for admin password for testing
    if (password === 'admin') {
      setPasswordStrength('strength-very-strong');
      return setPasswordRules(passwordRules.map(rule => ({...rule, met: true})));
    }
    
    const rules = [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'At least one lowercase letter', met: /[a-z]/.test(password) },
      { text: 'At least one number', met: /[0-9]/.test(password) },
      { text: 'At least one special character', met: /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password) }
    ];
    
    setPasswordRules(rules);
    
    // Calculate password strength
    const metCount = rules.filter(rule => rule.met).length;
    if (metCount <= 1) setPasswordStrength('strength-weak');
    else if (metCount <= 3) setPasswordStrength('strength-medium');
    else if (metCount <= 4) setPasswordStrength('strength-strong');
    else setPasswordStrength('strength-very-strong');
  };
  
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    checkPasswordRules(password);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update handler for navigation with animation - use the same approach as what we had before
  const handleNavigation = (path) => {
    // Set direction to 'left' for sliding out to the left when going to login page
    setSlideDirection('left'); 
    
    // Delay navigation to allow animation to play
    setTimeout(() => {
      navigate(path);
    }, 500); // Match animation duration (0.5s)
  };
  
  return (
    <div className={`landing-container slide-in-${slideDirection}`}>
      {/* Background decorative elements */}
      <div className="bg-circles">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
      
      {/* SWAPPED: Right side now has the form */}
      <div className="landing-right">
        <div className="login-container fade-in">
          <div className="login-header">
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Join thousands of users today</p>
          </div>
          
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                className="input-field"
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <span className="input-icon"><UserIcon /></span>
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                className="input-field"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={handlePasswordChange}
              />
              <span className="input-icon"><LockIcon /></span>
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className={`password-strength ${passwordStrength}`}>
                <div className="strength-meter">
                  <div className="strength-meter-fill"></div>
                </div>
                <div className="strength-text">
                  {passwordStrength === 'strength-weak' && 'Weak password'}
                  {passwordStrength === 'strength-medium' && 'Medium password'}
                  {passwordStrength === 'strength-strong' && 'Strong password'}
                  {passwordStrength === 'strength-very-strong' && 'Very strong password'}
                </div>
              </div>
            )}
            
            {/* Password requirements checklist */}
            {formData.password && formData.password !== 'admin' && (
              <div className="password-rules">
                {passwordRules.map((rule, idx) => (
                  <div key={idx} className="rule-item">
                    <span className={`rule-icon ${rule.met ? 'valid' : 'invalid'}`}>
                      {rule.met ? <CheckIcon /> : '○'}
                    </span>
                    <span className={`rule-text ${rule.met ? 'valid' : ''}`}>{rule.text}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="input-group">
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                className="input-field"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <span className="input-icon"><LockIcon /></span>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>
                  Passwords don't match
                </div>
              )}
            </div>
            
            <div className="input-group" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '8px' }}>
              <input 
                type="checkbox" 
                id="terms" 
                required
                style={{ marginTop: '3px' }}
              />
              <label htmlFor="terms" style={{ marginLeft: '8px', fontSize: '14px', color: 'var(--neutral-600)', lineHeight: '1.4' }}>
                I agree to the <a href="#terms" style={{ color: 'var(--primary-main)' }}>Terms of Service</a> and <a href="#privacy" style={{ color: 'var(--primary-main)' }}>Privacy Policy</a>
              </label>
            </div>

            <button 
              className="login-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-link">
            Already have an account? <a href="/login" onClick={handleNavigation}>Sign In</a>
          </div>
        </div>
      </div>
      
      <div className="landing-left register">
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
            Join Our <br />Secure Platform
          </h1>
          
          <p className="landing-subtitle fade-in">
            Create your account in seconds and get access to all features.
            Start managing your authentication needs today.
          </p>

          <ul className="feature-list">
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>Free account with basic features</span>
            </li>
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>Secure, encrypted data storage</span>
            </li>
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>Easy to integrate API</span>
            </li>
            <li className="feature-item fade-in">
              <span className="feature-icon"><CheckIcon /></span>
              <span>24/7 technical support</span>
            </li>
          </ul>

          <div className="testimonials fade-in">
            <p className="testimonial-text">"In God we trust, all others we authenticate."</p>
            <p className="testimonial-author">— Unknown, Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};