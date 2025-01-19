// client/src/components/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>{user.name} ({user.role})</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          {user.role === 'superadmin' && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Admin Controls</h3>
              {/* Add admin-specific controls here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};