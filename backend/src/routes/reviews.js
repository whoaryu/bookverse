const express = require('express');
const { body } = require('express-validator');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// Add a review (JWT required)
router.post('/', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('text').notEmpty().withMessage('Text is required'),
], reviewController.addReview);

// List reviews for a book
router.get('/', reviewController.listReviews);

module.exports = router; 