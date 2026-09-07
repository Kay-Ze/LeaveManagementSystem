const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AUTH_KEY = 'leave_auth_user';
const TOKEN_KEY = 'leave_auth_token';

// Helper to compute initials from full name
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Save and load token from localStorage
export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getUser = () => {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    if (!parsed.initials && parsed.name) {
      parsed.initials = getInitials(parsed.name);
    }
    return parsed;
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  if (user && !user.initials && user.name) {
    user.initials = getInitials(user.name);
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
};

// Aliases for compatibility across components
export const getCurrentUser = getUser;
export const getAuthToken = getToken;
export const logoutUser = logout;

// Check if email belongs to penthara.ai
export const isValidPentharaEmail = (email) => {
  return Boolean(email && email.trim().toLowerCase().endsWith('@penthara.ai'));
};

// User Registration
export const registerUser = async (name, email, password, role, designation) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role, designation })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  if (data.token) setToken(data.token);
  if (data.user) setUser(data.user);

  return data.user;
};

// User Login
export const loginUser = async (email, password, role) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.token) setToken(data.token);
  if (data.user) setUser(data.user);

  return data.user;
};

// Check user status (used by waiting approval page)
export const checkUserStatus = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/status?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    if (data.user) {
      const current = getUser();
      if (current && current.email === email) {
        setUser({ ...current, ...data.user, status: data.status });
      }
    }
    return data;
  } catch {
    return { status: 'pending' };
  }
};

// Admin: Get all users waiting for approval
export const getPendingJoinRequests = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/join-requests`);
    const data = await response.json();
    return data.requests || [];
  } catch {
    return [];
  }
};

// Admin: Approve a user join request
export const approveJoinRequest = async (id) => {
  const response = await fetch(`${API_URL}/auth/join-requests/${id}/approve`, {
    method: 'POST'
  });
  return await response.json();
};

// Admin: Reject a user join request
export const rejectJoinRequest = async (id) => {
  const response = await fetch(`${API_URL}/auth/join-requests/${id}/reject`, {
    method: 'POST'
  });
  return await response.json();
};
