import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setTask(res.data))
      .catch(() => navigate('/tasks'));
  }, [id, navigate]);

  if (!task) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">{task.title}</h1>
        <div className="bg-white p-4 shadow rounded">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
          <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Tasks
        </button>
      </div>
    </div>
  );
};
export default TaskDetails;