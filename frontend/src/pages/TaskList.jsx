import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    axios
      .get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => setTasks(tasks.filter((task) => task._id !== id)));
  };

  const handlePDF = () => {
    const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  if (!token) {
    console.error('No token found in localStorage');
    return;
  }
  axios
    .get('http://localhost:5000/api/tasks/pdf', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tasks.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error('PDF download failed:', err.response?.data || err);
        if (err.response && err.response.data) {
          const reader = new FileReader();
          reader.onload = () => {
            console.error('Error details:', JSON.parse(reader.result));
          };
          reader.readAsText(err.response.data);
        }
      });
  };

  const sortedTasks = [...tasks]
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const fieldA = sortBy === 'deadline' ? new Date(a.deadline) : a.title.toLowerCase();
      const fieldB = sortBy === 'deadline' ? new Date(b.deadline) : b.title.toLowerCase();
      return sortOrder === 'asc' ? (fieldA > fieldB ? 1 : -1) : (fieldA < fieldB ? 1 : -1);
    });

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl mb-4">Task List</h1>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded mb-2 md:mb-0 md:w-1/3"
          />
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="deadline">Deadline</option>
              <option value="title">Title</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <button
          onClick={handlePDF}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download PDF Report
        </button>
        <table className="w-full border-collapse border bg-white shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Deadline</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/task/${task._id}`)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-task/${task._id}`)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => navigate('/add-task')}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};
export default TaskList;