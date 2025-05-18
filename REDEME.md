# Task Management System

A full-stack MERN application for managing tasks with Google OAuth, CRUD operations, PDF reports, and Tailwind CSS.

## Features
- Google OAuth 2.0 authentication
- Task CRUD operations (Title, Description, Deadline, Assigned To, Status)
- Search and sort tasks
- PDF report generation
- Responsive UI with Tailwind CSS
- Optional: Task Details, Settings, 404 pages

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB
- Authentication: Google OAuth 2.0
- PDF: jsPDF
- Version Control: Git/GitHub

## Setup
1. Clone the repo: `git clone https://github.com/your-username/task-management-system.git`
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Create `.env` in `backend` with MongoDB URI, Google OAuth credentials, and JWT secret
5. Run backend: `cd backend && node server.js`
6. Run frontend: `cd frontend && npm start`
7. Access at `http://localhost:3000`
