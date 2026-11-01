import React from 'react';

const Navbar = ({
  currentView,
  setCurrentView,
  totalBooks = 0,
  availableBooks = 0,
  outOfStockBooks = 0,
  onAddNewBook,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => setCurrentView('list')} role="button" tabIndex={0}>
          <div className="brand-icon">📚</div>
          <div className="brand-text">
            <h1 className="brand-title">Online Bookstore</h1>
            <span className="brand-subtitle">MERN Stack Application</span>
          </div>
        </div>

        {/* Live Counters / Stats */}
        <div className="navbar-stats">
          <div className="stat-pill total" title="Total Books in Store">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{totalBooks}</span>
          </div>
          <div className="stat-pill available" title="Available in Stock">
            <span className="stat-indicator green"></span>
            <span className="stat-label">Available:</span>
            <span className="stat-value">{availableBooks}</span>
          </div>
          <div className="stat-pill out-of-stock" title="Out of Stock">
            <span className="stat-indicator red"></span>
            <span className="stat-label">Out of Stock:</span>
            <span className="stat-value">{outOfStockBooks}</span>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="navbar-actions">
          <button
            type="button"
            className={`nav-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            <span className="btn-icon">📖</span> All Books
          </button>
          <button
            type="button"
            className={`nav-btn primary-btn ${currentView === 'add' ? 'active' : ''}`}
            onClick={onAddNewBook}
          >
            <span className="btn-icon">➕</span> Add Book
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

