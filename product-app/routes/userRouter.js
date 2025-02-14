const express = require('express');
const User = require('../models/userModel');
const router = express.Router();

// Fetch user details by userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user (for testing purposes)
router.post('/', async (req, res) => {
  const { name, address } = req.body;
  try {
    const newUser = new User({ name, address });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



