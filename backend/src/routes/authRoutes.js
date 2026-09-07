const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  checkUserStatus
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/status', checkUserStatus);
router.get('/join-requests', getJoinRequests);
router.post('/join-requests/:id/approve', approveJoinRequest);
router.post('/join-requests/:id/reject', rejectJoinRequest);

module.exports = router;
