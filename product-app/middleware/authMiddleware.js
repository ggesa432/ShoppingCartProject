const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the database
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
