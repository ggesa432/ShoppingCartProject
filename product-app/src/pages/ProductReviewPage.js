import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ReviewsPage.css';

const ProductReviewPage = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]); 
  const [productName, setProductName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
      console.log(`Fetching reviews for productId: ${productId}`); // Debugging log

      
        const response = await fetch(`http://localhost:5000/api/reviews/${productId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch reviews');
        }

        const data = await response.json();

        if (!data.reviews || !Array.isArray(data.reviews)) {
          throw new Error('Invalid response format');
        }
        
        setReviews(data.reviews); // Make sure to set the reviews array
        setProductName(data.productName || 'Unknown Product');
        
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.message);
        setReviews([]);
      }
    };

    if (productId)  fetchProductReviews();
     
  }, [productId]);


  return (
    <div className="review-page">
      <h1>Reviews for {productName}</h1>
      {error && <p className="error-message">{error}</p>}
      
      {reviews.length === 0 ? (
        <p>No reviews found for this product.</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <p><strong>Reviewed by:</strong> {review.userName}</p>
              <p><strong>Rating:</strong> {review.rating} ⭐</p>
              <p><strong>Comment:</strong> {review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviewPage;
