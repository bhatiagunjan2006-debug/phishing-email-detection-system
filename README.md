# Library Management System

Full-stack Library Management System built with React, Node.js, Express, MongoDB, JWT, and bcrypt.

## Structure

- `backend` - Express API, MongoDB models, JWT auth, role-based authorization
- `frontend` - React + Vite client with React Router, Axios, reusable components

## Backend setup

1. Create `backend/.env`
2. Add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library_management
JWT_SECRET=replace_with_a_secure_secret
CLIENT_URL=http://localhost:5173
```

3. Install dependencies:

```bash
cd backend
npm install
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## Features

- JWT auth with signup and login
- User and admin roles
- Browse, search, borrow, and return books
- Borrow history dashboard
- Admin management for books, users, and issued books
- Responsive UI with reusable components
"# cybersecurity" 
"# phishing-email-detection-system" 
