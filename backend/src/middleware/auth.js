const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'leave_jwt_super_secret_key_2025';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const dbStore = require('../data/dbStore');

    let user = null;
    if (global.isMongoConnected) {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      const storeUser = dbStore.findUserById(decoded.id);
      if (storeUser) {
        user = {
          _id: storeUser._id,
          id: storeUser.id,
          name: storeUser.name,
          email: storeUser.email,
          role: storeUser.role,
          designation: storeUser.designation
        };
      } else {
        user = { id: decoded.id, role: decoded.role, email: decoded.email };
      }
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient permissions' });
  }
  next();
};

module.exports = {
  protect,
  authorize,
  JWT_SECRET
};
