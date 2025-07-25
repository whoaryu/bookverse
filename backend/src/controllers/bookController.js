const Book = require('../models/Book');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// Add a new book
exports.addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, author, genre } = req.body;
  try {
    const book = new Book({
      title,
      author,
      genre,
      createdBy: req.user._id,
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List books with filters and pagination
exports.listBooks = async (req, res) => {
  const { page = 1, limit = 10, genre, author, sort = 'date' } = req.query;
  const filter = {};
  if (genre) filter.genre = genre;
  if (author) filter.author = author;
  try {
    // Build aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'book',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avgRating: { $cond: [ { $gt: [ { $size: '$reviews' }, 0 ] }, { $avg: '$reviews.rating' }, null ] },
        },
      },
    ];
    // Sorting
    if (sort === 'rating') {
      pipeline.push({ $sort: { avgRating: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }
    // Pagination
    pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
    pipeline.push({ $limit: Number(limit) });

    // Get total count (without pagination)
    const total = await Book.countDocuments(filter);
    // Get books with aggregation
    const books = await Book.aggregate(pipeline);
    // Populate createdBy username for each book
    const populatedBooks = await Book.populate(books, { path: 'createdBy', select: 'username' });
    res.json({ books: populatedBooks, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get book details with average rating
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username' },
      });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    // Calculate average rating
    let avgRating = 0;
    if (book.reviews.length > 0) {
      avgRating = book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;
      avgRating = Math.round(avgRating * 10) / 10;
    }
    res.json({ ...book.toObject(), avgRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 