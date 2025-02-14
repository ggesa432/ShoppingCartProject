const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const createSampleUsers = async () => {
  await mongoose.connect('mongodb://localhost:27017/productApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

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
      email: 'gesangzeren@gmail.com',
      address: '123 Main St, New York',
      password: 'gesangzeren123',
      role: 'customer'
    }
  ];

  for (let user of users) {
    await User.create(user);
  }

  console.log('Sample users added!');
  mongoose.connection.close();
};

createSampleUsers().catch((err) => console.error(err));
