import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCouponAction } from '../store/couponActions';
import '../css/CouponComponent.css';

const CouponComponent = () => {
  const dispatch = useDispatch();
  const coupon = useSelector((state) => {
    return state?.coupon?.value; // Return the coupon value
  });
  console.log('Coupon Value from Redux:', coupon); // Log the coupon value
  
  const handleGenerateCoupon =async () => {
    const generatedCoupon = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
    dispatch(generateCouponAction(generatedCoupon)); // Dispatch the action
    try {
      const response = await fetch('http://localhost:5000/api/coupons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: generatedCoupon, discount: 10 }), // 10% discount
      });
  
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'GENERATE_COUPON', payload: data.code });
        alert(`Generated Coupon: ${data.code}`);
      } else {
        alert('Failed to generate coupon');
      }
    } catch (error) {
      console.error('Error generating coupon:', error.message);
    }
  };

  return (
    <div className="coupon-page">
      <h1>Coupon Page</h1>
      <button onClick={handleGenerateCoupon} className="generate-button">
        Generate Coupon
      </button>
      <div className="coupon-area">
        {coupon ? (
          <div className="coupon-display">
            <p>Your Generated Coupon Code:</p>
            <h2>{coupon}</h2>
          </div>
        ) : (
          <p className="no-coupon">No coupon generated yet. Click the button above to generate one!</p>
        )}
      </div>
    </div>
  );
};

export default CouponComponent;
