import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ReviewsPage.css';

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]); 
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews/all');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch reviews');
        }
      } catch (error) {
        setError('Error fetching reviews');
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="review-page">
      <h1>All Product Reviews</h1>
      {error && <p>{error}</p>}
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="review-list">
        {reviews.map((product) => (
          <div key={product.productId} className="review-item">
            <h3>{product.productName}</h3>
            <p><strong>Average Rating:</strong> {product.averageRating} ⭐</p>
            <p><strong>Sample Reviews:</strong></p>
            <ul>
              {product.reviews.map((review, index) => (
                <li key={index}>{review.comment}</li>
              ))}
            </ul>
            <Link to={`/reviews/${product.productId}`}>
              <button className="view-review-button">View Product Reviews</button>
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
);
};


export default ReviewPage;
