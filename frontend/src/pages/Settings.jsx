import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const Settings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token).user : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl mb-4">Settings</h1>
        {user ? (
          <div className="bg-white p-4 shadow rounded">
            <p><strong>Name:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-red-500">Not logged in</p>
        )}
      </div>
    </div>
  );
};
export default Settings;