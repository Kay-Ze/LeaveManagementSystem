# Leave Management System

A role-based web application for managing employee leave requests, balances, and administrative approvals.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, React Router
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT Authentication, bcryptjs

---

## Project Structure


---

## Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs by default on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify environment variables in `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend runs by default on `http://localhost:5173`.

---


## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` — Register a new account
- `POST /login` — Authenticate and receive JWT
- `GET /me` — Get current user profile
- `GET /status` — Check user approval status
- `GET /join-requests` — List pending employee approvals
- `POST /join-requests/:id/approve` — Approve user registration
- `POST /join-requests/:id/reject` — Reject user registration

### Leaves (`/api/leaves`)
- `POST /` — Apply for leave
- `GET /my` — Get user's own leave applications
- `DELETE /:id` — Withdraw pending leave request
- `GET /all` — Get all employee leave requests
- `PUT /:id/status` — Approve or reject a leave request





# FeedbackHub — Full-Stack Feedback Collector

Frontend: React, Vue
Backend: Node.js with Express
Database: MongoDB

Key features :- 
    Submission Form - Collect user names, email addresses, numerical ratings, and detailed text comments.
    Admin Dashboard: Build a secure view to list, filter, and analyze incoming feedback entries in real time.

Frontend Folder Structure - 

<img width="262" height="721" alt="image" src="https://github.com/user-attachments/assets/2f721a8a-c64e-4a1e-a03e-c2c5c98f4035" />


command to run frontend -
    npm run dev

Backend Folder Structure -

<img width="260" height="393" alt="image" src="https://github.com/user-attachments/assets/080e59e8-e387-488f-9441-ef997b3f8a6e" />

command to run Backend -
    node server.js



<img width="1846" height="929" alt="image" src="https://github.com/user-attachments/assets/91e83c22-ed46-4cc6-849e-96d504efc221" />
