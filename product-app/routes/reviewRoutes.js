const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const router = express.Router();

//  Fetch ALL product reviews 
router.get('/all', async (req, res) => {
    try {
        const reviews = await Review.find();

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found ' });
        }

        // Group reviews by productId
        const groupedReviews = {};
        for (const review of reviews) {
            if (!groupedReviews[review.productId]) {
                groupedReviews[review.productId] = {
                    productId: review.productId,
                    productName: '',
                    reviews: [],
                    totalRating: 0,
                    reviewCount: 0,
                };
            }
            groupedReviews[review.productId].reviews.push({
                rating: review.rating,
                comment: review.comment,
            });
            groupedReviews[review.productId].totalRating += review.rating;
            groupedReviews[review.productId].reviewCount += 1;
        }

        // Fetch product names
        const productIds = Object.keys(groupedReviews);
        const products = await Product.find({ _id: { $in: productIds } }, '_id name');

        // Map product names to the grouped reviews
        products.forEach((product) => {
            if (groupedReviews[product._id]) {
                groupedReviews[product._id].productName = product.name;
            }
        });

        // Format response data
        const response = Object.values(groupedReviews).map((product) => ({
            productId: product.productId,
            productName: product.productName,
            averageRating: (product.totalRating / product.reviewCount).toFixed(1),
            reviews: product.reviews.slice(0, 3), // Show only 3 sample reviews
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching product reviews:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//  Fetch reviews for a specific product
router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.isValidObjectId(productId)) { 
            return res.status(400).json({ error: 'Invalid product ID format' });
          }


          const reviews = await Review.find({ productId }).populate('userId', 'name');
        
          const product = await Product.findById(productId, 'name');
        if (!product) {
        return res.status(404).json({ error: 'Product not found' });
        }
        

        const formattedReviews = reviews.map((review) => ({
            _id: review._id,
            productId: review.productId,
            userName: review.userId?.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment,
        }));

        res.status(200).json({ productName: product.name, reviews: formattedReviews });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          message: error.message 
        });
      }
});

//  Add a new review
router.post('/add', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Empty request body' });
          }
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !rating || !comment || !userId ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    
        const newReview = new Review({ productId, rating, comment, userId });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Error adding review' });
    }
});

module.exports = router;
