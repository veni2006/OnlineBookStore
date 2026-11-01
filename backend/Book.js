const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number or zero'],
    },
    availability: {
      type: String,
      required: [true, 'Availability status is required'],
      enum: {
        values: ['Available', 'Out of Stock'],
        message: '{VALUE} is not a valid availability status. Must be "Available" or "Out of Stock"',
      },
      default: 'Available',
    },
  },
  {
    timestamps: true,
    collection: 'books',
  }
);

module.exports = mongoose.model('Book', bookSchema);

