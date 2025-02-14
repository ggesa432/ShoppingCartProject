const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    discount: { type: Number, required: true },
    isUsed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Coupon', couponSchema);
