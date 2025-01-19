// client/src/components/Login.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from './Login';

test('renders login form', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );

  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('shows error message on failed login', async () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
  fireEvent.click(screen.getByText(/Sign In/i));

  expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
});