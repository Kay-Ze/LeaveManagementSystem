const Leave = require('../models/Leave');
const dbStore = require('../data/dbStore');

const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, duration, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !duration || !reason) {
      return res.status(400).json({ message: 'All leave application fields are required' });
    }

    const userId = (req.user._id || req.user.id).toString();
    const leaveData = {
      user: userId,
      leaveType,
      startDate,
      endDate,
      duration: Number(duration),
      reason,
      status: 'Pending'
    };

    const leave = global.isMongoConnected
      ? await Leave.create(leaveData)
      : dbStore.createLeave(leaveData);

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating leave request' });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const leaves = global.isMongoConnected
      ? await Leave.find({ user: userId })
          .select('leaveType startDate endDate duration reason status adminComment createdAt')
          .sort({ createdAt: -1 })
          .lean()
      : dbStore.findLeavesByUser(userId);

    res.json({ success: true, count: leaves.length, data: leaves });
  } catch {
    res.status(500).json({ message: 'Server error retrieving leave history' });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = global.isMongoConnected
      ? await Leave.find()
          .select('user leaveType startDate endDate duration reason status adminComment createdAt')
          .populate('user', 'name email designation')
          .sort({ createdAt: -1 })
          .lean()
      : dbStore.findAllLeaves();

    res.json({ success: true, count: leaves.length, data: leaves });
  } catch {
    res.status(500).json({ message: 'Server error retrieving all leaves' });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    let updatedLeave = null;
    if (global.isMongoConnected) {
      const updateData = { status };
      if (adminComment) updateData.adminComment = adminComment;

      updatedLeave = await Leave.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select('user leaveType startDate endDate duration reason status adminComment createdAt')
      .populate('user', 'name email designation')
      .lean();

      if (!updatedLeave) return res.status(404).json({ message: 'Leave record not found' });
    } else {
      const existing = dbStore.findLeaveById(id);
      if (!existing) return res.status(404).json({ message: 'Leave record not found' });

      updatedLeave = dbStore.updateLeave(id, {
        status,
        adminComment: adminComment || existing.adminComment
      });
    }

    res.json({ success: true, data: updatedLeave });
  } catch {
    res.status(500).json({ message: 'Server error updating leave status' });
  }
};

const withdrawLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user._id || req.user.id).toString();

    if (global.isMongoConnected) {
      const deleteFilter = { _id: id, status: 'Pending' };
      if (req.user.role !== 'admin') {
        deleteFilter.user = userId;
      }

      const deleted = await Leave.findOneAndDelete(deleteFilter).select('_id').lean();
      if (!deleted) {
        return res.status(400).json({ message: 'Leave record not found or cannot be withdrawn' });
      }
    } else {
      const leave = dbStore.findLeaveById(id);
      if (!leave) return res.status(404).json({ message: 'Leave record not found' });
      if (leave.user.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to withdraw this leave' });
      }
      if (leave.status !== 'Pending') {
        return res.status(400).json({ message: 'Only pending leave requests can be withdrawn' });
      }
      dbStore.deleteLeave(id);
    }

    res.json({ success: true, message: 'Leave request withdrawn successfully' });
  } catch {
    res.status(500).json({ message: 'Server error withdrawing leave' });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  withdrawLeave
};
