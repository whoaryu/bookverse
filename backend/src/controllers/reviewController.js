const Review = require('../models/Review');
const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// Add a review to a book
exports.addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rating, text } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const review = new Review({
      book: book._id,
      user: req.user._id,
      rating,
      text,
    });
    await review.save();
    book.reviews.push(review._id);
    await book.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List reviews for a book
exports.listReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 