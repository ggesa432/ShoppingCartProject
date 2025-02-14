const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      category: { type: String },
      description: { type: String },
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

