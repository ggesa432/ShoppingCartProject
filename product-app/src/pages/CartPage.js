import React, { useEffect, useState , useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationContext';
import '../css/CartPage.css';

const CartPage = ({ userId: propUserId }) => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  
  // Ensure userId is correctly fetched from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = propUserId || storedUser?.user?.id;

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available. Please log in again.');
      return;
    }


    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCart(data.items || []);
        } else {
          console.error(`Failed to fetch cart for userId: ${userId}`);
        }
      } catch (error) {
        console.error('Error fetching cart:', error.message);
      }
    };

    fetchCart();
  }, [userId]);

  

  //  Prevent infinite loop by ensuring the function only runs when dependencies change
  const notifyCartStatus = useCallback(() => {
    if (cart.length > 0) {
      const notifiedKey = `notified_cart_${userId}`;
      const hasNotified = localStorage.getItem(notifiedKey);

      if (!hasNotified) {
        addNotification({
          userId,
          message: `You have ${cart.length} items in your cart`,
          type: 'dynamic',
          link: '/cart'
        });

        //  Mark notification as sent
        localStorage.setItem(notifiedKey, 'true');
      }
    } else {
      //  Reset the notification flag when cart is empty
      localStorage.removeItem(`notified_cart_${userId}`);
    }
  }, [cart.length, userId, addNotification]);
  useEffect(() => {
    notifyCartStatus();
  }, [notifyCartStatus]);

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${userId}/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addNotification({
          userId,
          message: `Removed item from cart`,
          type: 'dynamic',
          link: '/cart'
        });

        const data = await response.json();
        setCart(data.items || []);
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => removeItem(item.productId)}>Remove</button>
            </div>
          ))}
          <h2>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</h2>
          <button onClick={() => navigate('/checkout', { state: { cart } })}>
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
