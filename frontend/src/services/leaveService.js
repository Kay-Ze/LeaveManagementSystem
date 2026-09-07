import { getToken, getUser } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TOTAL_LEAVE_QUOTA = 30;
export const LEAVE_QUOTAS = {
  'Annual Leave': 18,
  'Casual Leave': 8,
  'Sick Leave': 4
};

// Standard headers with JWT auth token
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// Fetch leave records from backend
export const fetchLeaveRecords = async () => {
  const user = getUser();
  const endpoint = user?.role === 'admin' ? '/leaves/all' : '/leaves/my';

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders()
    });
    const result = await response.json();
    const raw = result.data || [];
    return raw.map((item) => ({
      ...item,
      id: item._id || item.id,
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      appliedOn: item.createdAt ? item.createdAt.split('T')[0] : ''
    }));
  } catch {
    return [];
  }
};

// Submit a new leave request
export const submitLeaveRequest = async (leaveData) => {
  const response = await fetch(`${API_URL}/leaves`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(leaveData)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to submit leave');
  }
  return result.data;
};

// Withdraw a pending leave request
export const withdrawLeaveRequest = async (id) => {
  const response = await fetch(`${API_URL}/leaves/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
};

// Admin: Update leave status (Approved or Rejected)
export const updateLeaveStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/leaves/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  return await response.json();
};

// Calculate leave balances (Total, Taken, Remaining)
export const getLeaveStats = (records = []) => {
  const approvedLeaves = records.filter((r) => r.status === 'Approved');

  const takenByType = {
    'Annual Leave': 0,
    'Casual Leave': 0,
    'Sick Leave': 0,
    'Unpaid Leave': 0
  };

  approvedLeaves.forEach((leave) => {
    const type = leave.leaveType === 'Paid Leave' ? 'Annual Leave' : leave.leaveType;
    const days = Number(leave.duration || 0);
    if (takenByType[type] !== undefined) {
      takenByType[type] += days;
    }
  });

  const balanceByType = {
    'Annual Leave': Math.max(0, LEAVE_QUOTAS['Annual Leave'] - takenByType['Annual Leave']),
    'Casual Leave': Math.max(0, LEAVE_QUOTAS['Casual Leave'] - takenByType['Casual Leave']),
    'Sick Leave': Math.max(0, LEAVE_QUOTAS['Sick Leave'] - takenByType['Sick Leave']),
    'Unpaid Leave': 999
  };

  const totalTaken = takenByType['Annual Leave'] + takenByType['Casual Leave'] + takenByType['Sick Leave'];

  return {
    totalAllocated: TOTAL_LEAVE_QUOTA,
    leavesTaken: totalTaken,
    remainingBalance: Math.max(0, TOTAL_LEAVE_QUOTA - totalTaken),
    balanceByType,
    breakdown: {
      annual: balanceByType['Annual Leave'],
      casual: balanceByType['Casual Leave'],
      sick: balanceByType['Sick Leave']
    }
  };
};

// Admin overview stats
export const getAdminStats = (records = []) => {
  return {
    pendingRequests: records.filter((r) => r.status === 'Pending').length,
    onLeaveToday: 3
  };
};

// Alias for compatibility
export const getLeaveRecords = () => [];
