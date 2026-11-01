import React from 'react';

const BookDetails = ({ book, onBack, onEdit, onDelete }) => {
  if (!book) {
    return (
      <div className="details-card">
        <p>No book selected.</p>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back to Books
        </button>
      </div>
    );
  }

  const isAvailable = book.availability === 'Available';

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="details-wrapper">
      <div className="details-card">
        {/* Top bar with back button */}
        <div className="details-topbar">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Back to All Books
          </button>
          <span className={`status-badge ${isAvailable ? 'badge-available' : 'badge-out-of-stock'}`}>
            <span className="badge-dot"></span>
            {book.availability}
          </span>
        </div>

        {/* Header Hero */}
        <div className="details-hero">
          <div className="details-icon">📚</div>
          <div className="details-hero-content">
            <h2 className="details-title">{book.title}</h2>
            <p className="details-author">
              <span className="author-prefix">Author:</span> {book.author}
            </p>
            <div className="details-price-badge">
              <span className="price-label">Price:</span>
              <span className="price-number">₹{Number(book.price).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Metadata Details Grid */}
        <div className="details-metadata-grid">
          <div className="metadata-item">
            <span className="metadata-label">Availability Status</span>
            <span className="metadata-value font-semibold">
              {book.availability}
            </span>
          </div>

          <div className="metadata-item">
            <span className="metadata-label">Price in INR</span>
            <span className="metadata-value font-semibold">
              ₹{Number(book.price).toFixed(2)}
            </span>
          </div>

          <div className="metadata-item">
            <span className="metadata-label">MongoDB Document ID</span>
            <code className="metadata-code">{book._id}</code>
          </div>

          <div className="metadata-item">
            <span className="metadata-label">Database Collection</span>
            <span className="metadata-value">online_bookstore.books</span>
          </div>

          <div className="metadata-item">
            <span className="metadata-label">Added On (Created At)</span>
            <span className="metadata-value">{formatDate(book.createdAt)}</span>
          </div>

          <div className="metadata-item">
            <span className="metadata-label">Last Modified (Updated At)</span>
            <span className="metadata-value">{formatDate(book.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="details-actions">
          <button
            type="button"
            className="btn-action btn-edit"
            onClick={() => onEdit(book)}
          >
            ✏️ Edit This Book
          </button>
          <button
            type="button"
            className="btn-action btn-delete"
            onClick={() => onDelete(book)}
          >
            🗑️ Delete Book
          </button>
          <button
            type="button"
            className="btn-action btn-close"
            onClick={onBack}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

