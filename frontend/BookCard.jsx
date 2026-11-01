import React from 'react';

const BookCard = ({ book, onViewDetails, onEdit, onDelete }) => {
  const isAvailable = book.availability === 'Available';

  return (
    <article className="book-card">
      <div className="card-header">
        <span className={`status-badge ${isAvailable ? 'badge-available' : 'badge-out-of-stock'}`}>
          <span className="badge-dot"></span>
          {book.availability}
        </span>
        <span className="price-tag">₹{Number(book.price).toFixed(2)}</span>
      </div>

      <div className="card-body">
        <div className="book-cover-placeholder">
          <span className="cover-icon">📘</span>
        </div>
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">
          <span className="author-label">By</span> {book.author}
        </p>
      </div>

      <div className="card-footer">
        <button
          type="button"
          className="btn-card btn-view"
          onClick={() => onViewDetails(book)}
          title="View full details"
        >
          👁️ Details
        </button>
        <button
          type="button"
          className="btn-card btn-edit"
          onClick={() => onEdit(book)}
          title="Edit book details"
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn-card btn-delete"
          onClick={() => onDelete(book)}
          title="Delete book"
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
};

export default BookCard;

