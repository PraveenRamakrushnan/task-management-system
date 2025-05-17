import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/api/tasks', task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => navigate('/tasks'))
      .catch((err) => setError(err.response?.data?.errors?.[0]?.msg || 'Failed to add task'));
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl mb-4">Add Task</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="date"
            value={task.deadline}
            onChange={(e) => setTask({ ...task, deadline: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Assigned To"
            value={task.assignedTo}
            onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <select
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddTask;