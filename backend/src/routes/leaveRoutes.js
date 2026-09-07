const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  withdrawLeave
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', applyLeave);
router.get('/my', getMyLeaves);
router.delete('/:id', withdrawLeave);

// Admin-only operations
router.get('/all', authorize('admin'), getAllLeaves);
router.put('/:id/status', authorize('admin'), updateLeaveStatus);

module.exports = router;
