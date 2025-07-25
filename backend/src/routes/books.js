const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/authMiddleware');

// Add a book (JWT required)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
], bookController.addBook);

// List books (with filters & pagination)
router.get('/', bookController.listBooks);

// Get book details (with average rating)
router.get('/:id', bookController.getBook);

module.exports = router; 