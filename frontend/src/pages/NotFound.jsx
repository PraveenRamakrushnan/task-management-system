import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you’re looking for doesn’t exist or you lack access.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};
export default NotFound;