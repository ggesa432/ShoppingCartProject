import React, { useEffect, useState } from 'react';
import '../css/ReorderPage.css';

const ReorderPage = ({ userId: propUserId }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = propUserId || storedUser?.user?.id;

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, [userId]);

  const handleReorder = async (orderId, merge = true) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, orderId, merge }),
      });

      if (response.ok) {
        alert('Order added to cart!');
      } else {
        alert('Failed to reorder');
      }
    } catch (err) {
      console.error('Error reordering:', err.message);
      alert('Error reordering. Please try again.');
    }
  };

  return (
    <div className="reorder-page">
      <h1>Reorder Page</h1>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders found to reorder.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-header">Order ID: {order._id}</div>
            <div className="order-details">
              Items:
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))}
              </ul>
              <p>Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
            <div className="order-buttons">
              <button onClick={() => handleReorder(order._id, true)}>Merge to Cart</button>
              <button onClick={() => handleReorder(order._id, false)}>Replace Cart</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReorderPage;
