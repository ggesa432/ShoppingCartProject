import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/SubmitReviewPage.css';

const SubmitReviewPage = () => {
  const { productId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?.id || null;
  

  const handleSubmitReview = async () => {
    console.log("Submitting review with data:", { productId, rating, comment, userId });
    if (!productId || !rating || !comment || !userId) {
      alert('All fields are required to submit a review.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          rating, 
          comment, 
          userId 
        }),
      });
  
      if (response.ok) {
        alert('Review submitted successfully!');
        setComment('');
        setRating(0);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error.message);
      alert('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="submit-review-container">
      <h1>Submit Review</h1>

      <div className="review-form">
        <h3>Rate this product:</h3>
        <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
        <h3>Write a Comment:</h3>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        <button onClick={handleSubmitReview}>Submit Review</button>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
