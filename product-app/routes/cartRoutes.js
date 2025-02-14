const express = require('express');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Coupon = require('../models/couponModel');
const sendEmail = require('../src/components/sendEmail');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
  const { userId, productId, name, price, quantity, category, description } = req.body;

  if (!userId || userId === "guest") {
    return res.status(400).json({ error: "You must log in to add items to the cart" });
}

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.productId == productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, name, price, quantity, category, description });
      }
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, name, price, quantity, category, description }],
      });
    }

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch cart items
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
  
    const cart = await Cart.findOne({ userId });
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found for this user' });
    }
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/remove/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout Route
router.post('/checkout', async (req, res) => {
  console.log("Received checkout request:", req.body);
  const { userId, couponCode } = req.body;

  try {
    console.log('Checkout initiated for userId:', userId);
    console.log('Coupon code provided:', couponCode);

    //  Fetch the user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });

      if (coupon && !coupon.isUsed) {
        discount = (cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * coupon.discount) / 100;
        coupon.isUsed = true;
        await coupon.save();
      } else {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
      }
    }

    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - discount,
    });

    await order.save();
    await Cart.deleteOne({ userId });

    const emailText = `
      Hello ${user.name},

      Thank you for your order!

      Order ID: ${order._id}
      Total Price: $${order.totalPrice.toFixed(2)}
      Items:
      ${order.items.map(item => `${item.name} - ${item.quantity} x $${item.price}`).join('\n')}

      We appreciate your business!

      Regards,
      ShoppingCart Team
    `;

    await sendEmail(user.email, 'Order Confirmation', emailText);
    console.log('Order created:', order);
    res.status(200).json({ message: 'Payment successful', orderId: order._id});
  } catch (error) {
    console.error('Error during checkout:', error.message);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
