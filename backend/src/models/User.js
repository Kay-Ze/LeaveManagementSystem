const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee'
    },
    designation: {
      type: String,
      default: 'Software Engineer'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    totalQuota: {
      type: Number,
      default: 30
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
