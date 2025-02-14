import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useNotification } from '../components/NotificationContext';
import '../css/RecentOrdersPage.css';

const RecentOrdersPage = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const { addNotification } = useNotification();

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUserDetails(userData);
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err.message);
      }
    };

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError('No recent orders found');
        }
      } catch (err) {
        console.error('Error fetching orders:', err.message);
        setError('Error fetching orders');
      }
    };

    fetchUserDetails();
    fetchOrders();
  }, [userId]);


  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
  
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
        );
        addNotification({
          userId,
          message: `Order #${orderId} has been canceled`,
          type: 'dynamic',
          link: `/orders/${orderId}`
        });
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error.message);
    }
  };

  const isDelivered = (createdAt) => {
    const orderDate = new Date(createdAt);
    const currentDate = new Date();
    const diffDays = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
    return diffDays > 2;
  };

  const generatePDF = (order) => {
    const doc = new jsPDF();
    doc.text(`Order Details - ${order._id}`, 20, 20);
    doc.text(`User: ${userDetails?.name || 'Unknown'}`, 20, 30);
    doc.text(`Email: ${userDetails?.email || 'Unknown'}`, 20, 40);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Total Price: $${order.totalPrice.toFixed(2)}`, 20, 60);
    doc.text('Items:', 20, 70);

    let y = 80;
    order.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ${item.quantity} x $${item.price}`, 20, y);
      y += 10;
    });

    doc.text('Thank you for shopping with us!', 20, y + 10);

    //  Save PDF Locally
    doc.save(`Order_${order._id}.pdf`);
  };


  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="recent-orders-container">
      <h1>Recent Orders</h1>

      {userDetails && (
        <div className="user-info">
          <h2>User Information</h2>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <p>No recent orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-item">
            <div className="order-header">Order ID: {order._id}</div>
            <div className="order-details">
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                Status:{' '}
                <span className={`status-badge ${isDelivered(order.createdAt) ? 'delivered' : order.status.toLowerCase()}`}>
                  {isDelivered(order.createdAt) ? 'Delivered' : order.status}
                </span>
              </p>
              <p>Items:</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} - {item.quantity} x ${item.price}
                    {isDelivered(order.createdAt) && order.status !== 'Cancelled' && (
                    <Link to={`/submit-review/${order._id}/${item.productId}`}>
                    <button className="review-button">Write Review</button>
                    </Link>
                  )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="total-price">Total: ${order.totalPrice.toFixed(2)}</div>
            <div className="order-buttons">
              {/* Cancel Order Button */}
              {!isDelivered(order.createdAt) && order.status !== 'Cancelled' && (
                <button className="cancel-button" onClick={() => handleCancelOrder(order._id)}>
                  Cancel Order
                </button>
              )}
            </div>
            <div className="order-buttons">
              <button className="download-button" onClick={() => generatePDF(order)}>
                Download PDF
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentOrdersPage;
