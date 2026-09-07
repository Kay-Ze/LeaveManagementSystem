# Leave Management System

A role-based web application for managing employee leave requests, balances, and administrative approvals.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, React Router
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT Authentication, bcryptjs

---

## Project Structure

<img width="355" height="873" alt="image" src="https://github.com/user-attachments/assets/9ab187a1-f27a-4428-93f4-7d983fc19d60" />

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

## Website Preview Images

<img width="1917" height="927" alt="image" src="https://github.com/user-attachments/assets/33bb6c10-3b10-4d7e-90be-305448ab3a0f" />

<img width="1913" height="920" alt="image" src="https://github.com/user-attachments/assets/e5a0c753-6945-4bd3-940e-2a10ced9c236" />

<img width="1919" height="931" alt="image" src="https://github.com/user-attachments/assets/09dc10f1-afb8-4498-a10b-d19db16d6c8a" />

<img width="1917" height="923" alt="image" src="https://github.com/user-attachments/assets/55b9efd1-2377-4ad7-85a0-350e28cdb992" />

<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/4350ed93-b28c-4345-b64a-0a5bab323d6d" />
