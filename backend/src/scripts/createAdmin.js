const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rewear');
    
    const adminUser = new User({
      firebaseUid: 'admin-firebase-uid', // Replace with actual Firebase UID
      email: 'admin@rewear.com',
      name: 'Admin User',
      role: 'admin',
      points: 1000
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser(); 