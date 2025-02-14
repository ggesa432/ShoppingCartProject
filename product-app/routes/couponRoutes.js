const express = require('express');
const Coupon = require('../models/couponModel');
const router = express.Router();

// Generate and save a coupon
router.post('/generate', async (req, res) => {
    const { code, discount } = req.body;
  
    try {
      const newCoupon = new Coupon({ code, discount });
      const savedCoupon = await newCoupon.save();
      res.status(201).json(savedCoupon);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'Coupon code already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

// Validate a coupon
router.post('/validate-coupon', async (req, res) => {
    const { couponCode } = req.body;
  
    try {
      const coupon = await Coupon.findOne({ code: couponCode });
  
      if (coupon && !coupon.isUsed) {
        // Mark the coupon as used
        //coupon.isUsed = true;
        await coupon.save();
  
        return res.status(200).json({ discount: coupon.discount });
      }
  
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  

module.exports = router;
