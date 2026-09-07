const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/leave_management';
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
    global.isMongoConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch {
    global.isMongoConnected = false;
    console.log('MongoDB server offline. Running with file-backed DB Store.');
  }
};

module.exports = connectDB;
