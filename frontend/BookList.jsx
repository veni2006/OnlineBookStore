import React, { useState } from 'react';
import BookCard from './BookCard';

const BookList = ({
  books,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  onSearch,
  onClearSearch,
  onViewDetails,
  onEdit,
  onDelete,
  onAddNewBook,
}) => {
  const [filterAvailability, setFilterAvailability] = useState('ALL');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Filter books in the list based on selected availability pill (if any)
  const filteredBooks = books.filter((book) => {
    if (filterAvailability === 'ALL') return true;
    return book.availability === filterAvailability;
  });

  return (
    <section className="book-list-section">
      {/* Search and Filter Toolbar */}
      <div className="search-toolbar">
        <form className="search-form" onSubmit={handleFormSubmit}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={handleInputChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={onClearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${filterAvailability === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterAvailability('ALL')}
          >
            All ({books.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filterAvailability === 'Available' ? 'active' : ''}`}
            onClick={() => setFilterAvailability('Available')}
          >
            Available ({books.filter((b) => b.availability === 'Available').length})
          </button>
          <button
            type="button"
            className={`filter-pill ${filterAvailability === 'Out of Stock' ? 'active' : ''}`}
            onClick={() => setFilterAvailability('Out of Stock')}
          >
            Out of Stock ({books.filter((b) => b.availability === 'Out of Stock').length})
          </button>
        </div>
      </div>

      {/* Search status header */}
      {searchQuery && (
        <div className="search-feedback">
          <span>
            Search results for "<strong>{searchQuery}</strong>": found <strong>{filteredBooks.length}</strong> book(s)
          </span>
          <button type="button" className="text-btn" onClick={onClearSearch}>
            Reset search
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading books from MongoDB Atlas...</p>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="alert-banner alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <p className="alert-title">Error Loading Books</p>
            <p className="alert-message">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBooks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          {searchQuery ? (
            <>
              <h3 className="empty-state-title">No Books Found</h3>
              <p className="empty-state-message">
                No books matched your search for "<strong>{searchQuery}</strong>".
                <br />
                Try searching with a different title or author name.
              </p>
              <button type="button" className="btn-secondary" onClick={onClearSearch}>
                Clear Search Filter
              </button>
            </>
          ) : filterAvailability !== 'ALL' ? (
            <>
              <h3 className="empty-state-title">No Books in this Category</h3>
              <p className="empty-state-message">
                There are currently no books marked as "{filterAvailability}".
              </p>
              <button type="button" className="btn-secondary" onClick={() => setFilterAvailability('ALL')}>
                Show All Books
              </button>
            </>
          ) : (
            <>
              <h3 className="empty-state-title">Your Bookstore is Empty</h3>
              <p className="empty-state-message">
                There are currently no books in the database. Add your first book to get started!
              </p>
              <button type="button" className="btn-primary" onClick={onAddNewBook}>
                ➕ Add Your First Book
              </button>
            </>
          )}
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookList;

