const express = require('express');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const router = express.Router();

// Save a new order (already implemented in checkout)
router.post('/add', async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  try {
    const newOrder = new Order({ userId, items, totalPrice });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all recent orders for a user
router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId }).populate('userId', 'name email');
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.status(404).json({ message: 'No recent orders found' });
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Cancel an order
router.put('/cancel/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reorder endpoint
router.post('/reorder', async (req, res) => {
    const { userId, orderId, merge } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      if (merge) {
        // Merge items into the existing cart
        order.items.forEach((orderItem) => {
          const existingItem = cart.items.find((cartItem) => cartItem.productId.equals(orderItem.productId));
          if (existingItem) {
            existingItem.quantity += orderItem.quantity;
          } else {
            cart.items.push(orderItem);
          }
        });
      } else {
        // Replace the cart
        cart.items = order.items;
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
