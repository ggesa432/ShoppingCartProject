import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductList.css';

const ProductList = ({ products, addToCart, user }) => {
  const [expandedProductId, setExpandedProductId] = useState(null);

  const toggleDetails = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-item">
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          {/* Add to Cart Button */}
          {user && <button onClick={() => addToCart(product)}>Add to Cart</button>}
          <button onClick={() => toggleDetails(product._id)}>
            {expandedProductId === product._id ? 'Hide Details' : 'Show Details'}
          </button>

          {expandedProductId === product._id && (
            <div className="product-details">
              <p><strong>Category:</strong> {product.category || 'N/A'}</p>
              <p><strong>Description:</strong> {product.description || 'No description available'}</p>

              {/* Link to Reviews */}
              <Link to={`/reviews/${product._id}`} className="review-link">
                View Reviews
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;


