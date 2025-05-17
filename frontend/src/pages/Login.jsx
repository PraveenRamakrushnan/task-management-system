import React from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl mb-6">Task Management System</h1>
        <button
          onClick={handleGoogleLogin}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
export default Login;