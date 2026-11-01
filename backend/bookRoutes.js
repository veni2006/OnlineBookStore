const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();

/**
 * Helper: Validate book payload fields
 */
const validateBookInput = (body) => {
  const { title, author, price, availability } = body;

  if (!title || String(title).trim() === '') {
    return 'Book title is required.';
  }

  if (!author || String(author).trim() === '') {
    return 'Author name is required.';
  }

  if (price === undefined || price === null || price === '' || isNaN(Number(price))) {
    return 'Valid price is required.';
  }

  if (Number(price) < 0) {
    return 'Price must be a positive number or zero (cannot be negative).';
  }

  const validAvailability = ['Available', 'Out of Stock'];
  if (!availability || !validAvailability.includes(String(availability).trim())) {
    return 'Availability must be either "Available" or "Out of Stock".';
  }

  return null;
};

/**
 * @route   GET /api/books/search?query=javascript
 * @desc    Search books by title or author (case-insensitive & partial match)
 * @access  Public
 * (NOTE: Placed before /:id route so 'search' is not treated as an ID)
 */
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || String(query).trim() === '') {
      const allBooks = await Book.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: allBooks.length,
        data: allBooks,
      });
    }

    const trimmedQuery = String(query).trim();
    // Escape regex special characters to prevent regex injection or syntax errors
    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'i');

    const matchingBooks = await Book.find({
      $or: [{ title: regex }, { author: regex }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: matchingBooks.length,
      data: matchingBooks,
    });
  } catch (error) {
    console.error('Error searching books:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to search books.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/books
 * @desc    Retrieve all books (with optional ?query= filter)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};

    if (query && String(query).trim() !== '') {
      const escapedQuery = String(query).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedQuery, 'i');
      filter = { $or: [{ title: regex }, { author: regex }] };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error('Error fetching books:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve books from database.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/books/:id
 * @desc    Retrieve a single book by MongoDB ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB ID format.',
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Error fetching book:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve book.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/books
 * @desc    Add a new book
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const validationError = validateBookInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { title, author, price, availability } = req.body;

    const newBook = new Book({
      title: String(title).trim(),
      author: String(author).trim(),
      price: Number(price),
      availability: String(availability).trim(),
    });

    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      data: savedBook,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('Error adding book:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding book.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/books/:id
 * @desc    Update an existing book
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB ID format.',
      });
    }

    const validationError = validateBookInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const bookToUpdate = await Book.findById(id);
    if (!bookToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
    }

    const { title, author, price, availability } = req.body;

    bookToUpdate.title = String(title).trim();
    bookToUpdate.author = String(author).trim();
    bookToUpdate.price = Number(price);
    bookToUpdate.availability = String(availability).trim();

    const updatedBook = await bookToUpdate.save();

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully!',
      data: updatedBook,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('Error updating book:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating book.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB ID format.',
      });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully!',
      data: deletedBook,
    });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting book.',
      error: error.message,
    });
  }
});

module.exports = router;

