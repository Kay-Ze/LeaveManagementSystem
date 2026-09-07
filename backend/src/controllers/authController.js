const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dbStore = require('../data/dbStore');
const { JWT_SECRET } = require('../middleware/auth');

const isValidPentharaEmail = (email) => {
  if (!email) return false;
  return /^[a-zA-Z0-9._%+-]+@penthara\.ai$/i.test(email.trim());
};

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, designation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!isValidPentharaEmail(email)) {
      return res.status(400).json({ message: 'Only @penthara.ai email addresses are authorized for registration' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = global.isMongoConnected
      ? await User.findOne({ email: cleanEmail }).select('_id').lean()
      : dbStore.findUserByEmail(cleanEmail);

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role || 'employee';
    const userStatus = userRole === 'admin' ? 'approved' : 'pending';
    const finalDesignation = designation ? designation.trim() : (userRole === 'admin' ? 'HR Director' : 'Software Engineer');

    const userData = {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: userRole,
      designation: finalDesignation,
      status: userStatus
    };

    const user = global.isMongoConnected
      ? await User.create(userData)
      : dbStore.createUser(userData);

    const userId = (user._id || user.id).toString();
    const token = generateToken(userId, user.role, user.email);

    res.status(201).json({
      success: true,
      pendingApproval: userStatus === 'pending',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        status: user.status || userStatus,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isValidPentharaEmail(email)) {
      return res.status(400).json({ message: 'Only @penthara.ai email addresses are authorized for login' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = global.isMongoConnected
      ? await User.findOne({ email: cleanEmail })
          .select('name email password role designation status createdAt')
          .lean()
      : dbStore.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userId = (user._id || user.id).toString();
    const token = generateToken(userId, user.role, user.email);

    res.json({
      success: true,
      pendingApproval: user.role === 'employee' && user.status === 'pending',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        status: user.status || 'approved',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

const getJoinRequests = async (req, res) => {
  try {
    let requests = [];
    if (global.isMongoConnected) {
      const docs = await User.find({ role: 'employee', status: 'pending' })
        .select('name email role designation status createdAt')
        .sort({ createdAt: -1 })
        .lean();

      requests = docs.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        designation: u.designation,
        status: u.status,
        createdAt: u.createdAt
      }));
    } else {
      requests = dbStore.getPendingJoinRequests();
    }
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching join requests' });
  }
};

const approveJoinRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = global.isMongoConnected
      ? await User.findByIdAndUpdate(
          id, 
          { status: 'approved' }, 
          { new: true, runValidators: true }
        )
        .select('name email role designation status createdAt')
        .lean()
      : dbStore.approveJoinRequest(id);

    if (!user) return res.status(404).json({ message: 'User request not found' });

    res.json({
      success: true,
      message: 'Join request approved successfully',
      user: {
        id: (user._id || user.id).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error approving request' });
  }
};

const rejectJoinRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = global.isMongoConnected
      ? await User.findByIdAndUpdate(
          id, 
          { status: 'rejected' }, 
          { new: true, runValidators: true }
        )
        .select('_id')
        .lean()
      : dbStore.rejectJoinRequest(id);

    if (!user) return res.status(404).json({ message: 'User request not found' });

    res.json({ success: true, message: 'Join request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error rejecting request' });
  }
};

const checkUserStatus = async (req, res) => {
  try {
    const email = req.query.email ? req.query.email.trim().toLowerCase() : '';
    if (!email) return res.status(400).json({ message: 'Email query parameter required' });

    const user = global.isMongoConnected
      ? await User.findOne({ email })
          .select('name email role designation status createdAt')
          .lean()
      : dbStore.findUserByEmail(email);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      success: true,
      status: user.status || 'approved',
      user: {
        id: (user._id || user.id).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        status: user.status || 'approved',
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error checking status' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  checkUserStatus
};
