import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/dashboard" className="text-xl font-bold">Task Manager</Link>
        {token && (
          <div className="space-x-4">
            <Link to="/tasks">Tasks</Link>
            <Link to="/settings">Settings</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;