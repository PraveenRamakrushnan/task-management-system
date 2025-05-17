import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('token');
    console.log('Token from URL or localStorage:', token); // Debug
    if (token) {
      const decoded = jwtDecode(token);
      console.log('Decoded user:', decoded.user);
      setUser(decoded.user);
      localStorage.setItem('token', token);
      axios
        .get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTasks(res.data))
        .catch((err) => {
          console.error('Tasks fetch failed:', err);
          navigate('/login');
        });
    } else {
      console.error('No token found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl mb-4">Welcome, {user.displayName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded">
            Total Tasks: {tasks.length}
          </div>
          <div className="p-4 bg-white shadow rounded">
            Pending: {tasks.filter((t) => t.status === 'Pending').length}
          </div>
          <div className="p-4 bg-white shadow rounded">
            Completed: {tasks.filter((t) => t.status === 'Done').length}
          </div>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Manage Tasks
        </button>
      </div>
    </div>
  );
};
export default Dashboard;