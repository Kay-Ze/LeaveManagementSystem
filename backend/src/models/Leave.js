const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    leaveType: {
      type: String,
      required: true,
      enum: ['Annual Leave', 'Casual Leave', 'Sick Leave', 'Unpaid Leave', 'Paid Leave']
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminComment: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Leave', leaveSchema);
