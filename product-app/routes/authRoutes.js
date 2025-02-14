const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateToken } = require('../utils/jwt')
const router = express.Router();


//  Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);
    
    res.status(201).json({ user: { id: newUser._id, name: newUser.name, email: newUser.email }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
