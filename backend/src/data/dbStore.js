// Simple in-memory data storage (1 Admin and 5 Employees)
// Pre-hashed bcrypt password for 'password123'
const defaultPasswordHash = '$2b$10$7wV.9bVxURXMJxWDc2VApOKPMvrLUvKFebKicTeffq6JekfajgIxm';

let users = [
  {
    _id: 'usr-admin-01',
    id: 'usr-admin-01',
    name: 'Admin Supervisor',
    email: 'admin@penthara.ai',
    password: defaultPasswordHash,
    role: 'admin',
    designation: 'HR Director',
    status: 'approved',
    totalQuota: 30,
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    _id: 'usr-emp-01',
    id: 'usr-emp-01',
    name: 'Alex Rivera',
    email: 'user@penthara.ai',
    password: defaultPasswordHash,
    role: 'employee',
    designation: 'Frontend Developer',
    status: 'approved',
    totalQuota: 30,
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    _id: 'usr-emp-02',
    id: 'usr-emp-02',
    name: 'Sarah Chen',
    email: 'sarah.chen@penthara.ai',
    password: defaultPasswordHash,
    role: 'employee',
    designation: 'UX Designer',
    status: 'approved',
    totalQuota: 30,
    createdAt: '2025-02-01T00:00:00.000Z'
  },
  {
    _id: 'usr-emp-03',
    id: 'usr-emp-03',
    name: 'David Kim',
    email: 'david.kim@penthara.ai',
    password: defaultPasswordHash,
    role: 'employee',
    designation: 'Backend Dev',
    status: 'approved',
    totalQuota: 30,
    createdAt: '2025-02-15T00:00:00.000Z'
  },
  {
    _id: 'usr-emp-04',
    id: 'usr-emp-04',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@penthara.ai',
    password: defaultPasswordHash,
    role: 'employee',
    designation: 'QA Engineer',
    status: 'pending',
    totalQuota: 30,
    createdAt: '2026-09-06T11:15:00.000Z'
  },
  {
    _id: 'usr-emp-05',
    id: 'usr-emp-05',
    name: 'Liam Scott',
    email: 'liam.scott@penthara.ai',
    password: defaultPasswordHash,
    role: 'employee',
    designation: 'DevOps Engineer',
    status: 'pending',
    totalQuota: 30,
    createdAt: '2026-09-06T10:30:00.000Z'
  }
];

let leaves = [
  {
    _id: 'lev-001',
    id: 'lev-001',
    user: 'usr-emp-01',
    employee: { name: 'Alex Rivera', role: 'Frontend Developer', balance: 14, initials: 'AR' },
    leaveType: 'Annual Leave',
    startDate: '2026-09-12',
    endDate: '2026-09-14',
    duration: 1,
    reason: 'Trip with family',
    appliedOn: '2026-09-06',
    status: 'Approved',
    createdAt: '2026-09-06T14:03:50.331Z'
  },
  {
    _id: 'lev-002',
    id: 'lev-002',
    user: 'usr-emp-01',
    employee: { name: 'Alex Rivera', role: 'Frontend Developer', balance: 14, initials: 'AR' },
    leaveType: 'Casual Leave',
    startDate: '2026-09-10',
    endDate: '2026-09-11',
    duration: 2,
    reason: 'Personal errands',
    appliedOn: '2026-09-06',
    status: 'Approved',
    createdAt: '2026-09-06T14:03:50.331Z'
  },
  {
    _id: 'lev-003',
    id: 'lev-003',
    user: 'usr-emp-02',
    employee: { name: 'Sarah Chen', role: 'UX Designer', balance: 16, initials: 'SC' },
    leaveType: 'Sick Leave',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    duration: 2,
    reason: 'Doctor Appointment',
    appliedOn: '2026-09-05',
    status: 'Pending',
    createdAt: '2026-09-05T10:00:00.000Z'
  },
  {
    _id: 'lev-004',
    id: 'lev-004',
    user: 'usr-emp-03',
    employee: { name: 'David Kim', role: 'Backend Dev', balance: 18, initials: 'DK' },
    leaveType: 'Casual Leave',
    startDate: '2026-09-22',
    endDate: '2026-09-25',
    duration: 4,
    reason: 'Wedding ceremony',
    appliedOn: '2026-09-06',
    status: 'Rejected',
    createdAt: '2026-09-06T11:00:00.000Z'
  }
];

const findUserByEmail = (email) => {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === clean) || null;
};

const findUserById = (id) => {
  const str = String(id);
  return users.find((u) => u._id === str || u.id === str) || null;
};

const createUser = ({ name, email, password, role, designation, status }) => {
  const id = `usr-${Date.now()}`;
  const newUser = {
    _id: id,
    id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: role || 'employee',
    designation: designation || (role === 'admin' ? 'HR Director' : 'Software Engineer'),
    status: status || (role === 'admin' ? 'approved' : 'pending'),
    totalQuota: 30,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

const getPendingJoinRequests = () => {
  return users.filter((u) => u.role === 'employee' && u.status === 'pending');
};

const approveJoinRequest = (id) => {
  const user = findUserById(id);
  if (user) user.status = 'approved';
  return user;
};

const rejectJoinRequest = (id) => {
  const user = findUserById(id);
  if (user) user.status = 'rejected';
  return user;
};

const findLeavesByUser = (userId) => {
  const str = String(userId);
  return leaves.filter((l) => String(l.user) === str);
};

const findAllLeaves = () => {
  return leaves.map((l) => {
    const u = findUserById(l.user);
    return {
      ...l,
      user: u ? { _id: u._id, name: u.name, email: u.email, designation: u.designation } : l.user
    };
  });
};

const findLeaveById = (id) => {
  const str = String(id);
  return leaves.find((l) => l._id === str || l.id === str) || null;
};

const createLeave = ({ user, leaveType, startDate, endDate, duration, reason }) => {
  const id = `lev-${Date.now()}`;
  const userInfo = findUserById(user);
  const newLeave = {
    _id: id,
    id,
    user: String(user),
    employee: {
      name: userInfo ? userInfo.name : 'Employee',
      role: userInfo ? userInfo.designation : 'Staff',
      balance: 14,
      initials: userInfo ? userInfo.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() : 'EM'
    },
    leaveType,
    startDate,
    endDate,
    duration: Number(duration),
    reason,
    appliedOn: new Date().toISOString().split('T')[0],
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  leaves.unshift(newLeave);
  return newLeave;
};

const updateLeave = (id, updates) => {
  const leave = findLeaveById(id);
  if (leave) {
    Object.assign(leave, updates);
  }
  return leave;
};

const deleteLeave = (id) => {
  const str = String(id);
  const idx = leaves.findIndex((l) => l._id === str || l.id === str);
  if (idx !== -1) {
    leaves.splice(idx, 1);
    return true;
  }
  return false;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getPendingJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  findLeavesByUser,
  findAllLeaves,
  findLeaveById,
  createLeave,
  updateLeave,
  deleteLeave
};
