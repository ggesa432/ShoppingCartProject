import React from 'react';
import '../css/CartItem.css'; 

const CartItem = ({ item }) => {
  return (
    <div className="cart-item">
      <h3>{item.name}</h3>
      <p>Price: ${item.price}</p>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
};

export default CartItem;
