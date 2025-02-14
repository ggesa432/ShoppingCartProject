import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/OrderDetailsPage.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/details/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err.message);
        setError('Error fetching order details');
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="order-details-page">
      <h1>Order Details</h1>
      {order ? (
        <div>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
          <h3>Items:</h3>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.name} - {item.quantity} x ${item.price}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetailsPage;
