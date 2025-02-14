import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/CheckoutPage.css';
import { useNotification } from '../components/NotificationContext';

const CheckoutPage = ({ userId }) => {
  const location = useLocation();
  const cart = useMemo(() => location.state?.cart || [], [location.state?.cart]);

  const [userDetails, setUserDetails] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [couponInput, setCouponInput] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isPaymentMade, setIsPaymentMade] = useState(false);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      } finally {
        setLoading(false); // ✅ Stop Loading
      }
    };

    fetchUserDetails();

    const calculateTotals = () => {
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmt = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
      setTotalQuantity(totalQty);
      setTotalAmount(totalAmt);
      setDiscountedTotal(totalAmt);
    };

    calculateTotals();
  }, [userId, cart]);

  // ✅ Prevent multiple notifications
  useEffect(() => {
    if (userId) {
      // ✅ Prevent duplicate notifications using localStorage
      const hasNotified = localStorage.getItem(`notified_checkout_${userId}`);
      
      if (!hasNotified) {
        addNotification({
          userId,
          message: 'Review your cart before proceeding to checkout',
          type: 'static',
          link: '/checkout'
        });

        // ✅ Mark notification as sent
        localStorage.setItem(`notified_checkout_${userId}`, 'true');
      }
    }
  }, [userId, addNotification]);

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: couponInput.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const discount = (totalAmount * data.discount) / 100;
        setDiscountedTotal(totalAmount - discount);
        setIsCouponApplied(true);
        alert('Coupon applied successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Invalid or expired coupon.');
      }
    } catch (error) {
      console.error('Error validating coupon:', error.message);
      alert('Error applying coupon. Please try again.');
    }
  };

  const handleMakePayment = async () => {
    try {
      const payload = { userId, couponCode: isCouponApplied ? couponInput.trim() : null };
      console.log('Checkout payload:', payload);

      const response = await fetch('http://localhost:5000/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const orderId = data.orderId;

        if (!orderId) {
          console.error("Order ID is missing from response");
          return;
        }

        addNotification({
          userId,
          message: `Payment successful for order #${orderId}!`,
          type: 'dynamic',
          link: `/orders/${orderId}`
        });

        setIsPaymentMade(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to process payment. Please try again.');
      }
    } catch (error) {
      console.error('Error during payment:', error.message);
      alert('Error during payment. Please try again.');
    }
  };

  if (isPaymentMade) {
    return (
      <div className="checkout-page">
        <h1>Payment Page</h1>
        <p>Thank you for your payment! Your items are being processed.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout Page</h1>

      {/* ✅ Show Loading Indicator */}
      {loading ? (
        <p>Loading user details...</p>
      ) : (
        userDetails && (
          <div className="user-details">
            <p>We will deliver products to:</p>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Address:</strong> {userDetails.address}</p>
          </div>
        )
      )}

      <h2>Cart Summary</h2>
      <div className="cart-summary">
        {cart.map((item) => (
          <div key={item.productId} className="cart-item">
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="purchase-summary">
        <h3>Purchase Summary</h3>
        <p><strong>Total Quantity:</strong> {totalQuantity}</p>
        <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
        {isCouponApplied && (
          <p><strong>Discounted Total:</strong> ${discountedTotal.toFixed(2)}</p>
        )}
      </div>

      <div className="coupon-area">
        <h3>Apply Coupon</h3>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          className="coupon-input"
        />
        <button onClick={handleApplyCoupon} className="apply-coupon-button">
          Apply Coupon
        </button>
      </div>

      <button className="checkout-button" onClick={handleMakePayment}>
        Make Payment
      </button>
    </div>
  );
};

export default CheckoutPage;
