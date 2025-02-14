const mongoose = require('mongoose');
const User = require('../models/userModel');

const createSampleUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/productApp'); // Connect to DB

    const users = [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        address: '789 Admin St, NY',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'GesangZeren',
        email: 'gesangsession66@gmail.com',
        address: '123 Main St, New York',
        password: 'gesangzeren123',
        role: 'customer'
      }
    ];

    for (let user of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create(user);
        console.log(`User created: ${user.name}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }

    console.log(' Sample users added successfully!');
  } catch (error) {
    console.error(' Error adding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleUsers();
