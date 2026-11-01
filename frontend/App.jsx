import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import BookDetails from './components/BookDetails';
import bookService from './services/bookService';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'add' | 'edit' | 'details'
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  // Show notification with auto-dismiss
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Fetch all books or search
  const loadBooks = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (query.trim()) {
        response = await bookService.searchBooks(query.trim());
      } else {
        response = await bookService.getAllBooks();
      }

      if (response && response.success) {
        setBooks(response.data || []);
      } else {
        setBooks([]);
        setError(response?.message || 'Failed to fetch books.');
      }
    } catch (err) {
      console.error('API Error in loadBooks:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to the backend server. Make sure the backend is running on port 5000.';
      setError(msg);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Handle Search submit
  const handleSearch = (query) => {
    setSearchQuery(query);
    loadBooks(query);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    loadBooks('');
  };

  // Switch to Add Book view
  const handleAddNewBook = () => {
    setSelectedBook(null);
    setCurrentView('add');
  };

  // Switch to View Details view
  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setCurrentView('details');
  };

  // Switch to Edit Book view
  const handleStartEdit = (book) => {
    setSelectedBook(book);
    setCurrentView('edit');
  };

  // Return to book list
  const handleCancelForm = () => {
    setSelectedBook(null);
    setCurrentView('list');
  };

  // Submit Handler: Add or Update Book
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (currentView === 'edit' && selectedBook?._id) {
        // UPDATE OPERATION
        const res = await bookService.updateBook(selectedBook._id, formData);
        if (res.success) {
          showNotification('success', `Book "${res.data.title}" updated successfully!`);
          setCurrentView('list');
          setSelectedBook(null);
          await loadBooks(searchQuery);
        } else {
          showNotification('error', res.message || 'Failed to update book.');
        }
      } else {
        // CREATE OPERATION
        const res = await bookService.createBook(formData);
        if (res.success) {
          showNotification('success', `Book "${res.data.title}" added to bookstore successfully!`);
          setCurrentView('list');
          setSelectedBook(null);
          // If we had a search filter active, clear it so the newly added book is visible
          if (searchQuery) {
            setSearchQuery('');
            await loadBooks('');
          } else {
            await loadBooks();
          }
        } else {
          showNotification('error', res.message || 'Failed to add book.');
        }
      }
    } catch (err) {
      console.error('Error saving book:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while saving the book.';
      showNotification('error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Book Handler with Confirmation
  const handleDeleteBook = async (book) => {
    if (!book || !book._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the book "${book.title}" by ${book.author}?\n\nThis action will permanently remove it from MongoDB Atlas.`
    );

    if (!confirmed) return;

    try {
      const res = await bookService.deleteBook(book._id);
      if (res.success) {
        showNotification('success', `Book "${book.title}" was deleted successfully.`);
        if (currentView === 'details' || (currentView === 'edit' && selectedBook?._id === book._id)) {
          setCurrentView('list');
          setSelectedBook(null);
        }
        await loadBooks(searchQuery);
      } else {
        showNotification('error', res.message || 'Failed to delete book.');
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while deleting the book.';
      showNotification('error', errorMsg);
    }
  };

  // Counters
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.availability === 'Available').length;
  const outOfStockBooks = books.filter((b) => b.availability === 'Out of Stock').length;

  return (
    <div className="app-layout">
      {/* Navbar with counters and navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        totalBooks={totalBooks}
        availableBooks={availableBooks}
        outOfStockBooks={outOfStockBooks}
        onAddNewBook={handleAddNewBook}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`} role="alert">
          <span className="toast-icon">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="toast-message">{notification.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {/* VIEW: All Books List */}
          {currentView === 'list' && (
            <BookList
              books={books}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              onViewDetails={handleViewDetails}
              onEdit={handleStartEdit}
              onDelete={handleDeleteBook}
              onAddNewBook={handleAddNewBook}
            />
          )}

          {/* VIEW: Add New Book */}
          {currentView === 'add' && (
            <BookForm
              book={null}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          )}

          {/* VIEW: Edit Book */}
          {currentView === 'edit' && (
            <BookForm
              book={selectedBook}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          )}

          {/* VIEW: View Book Details */}
          {currentView === 'details' && (
            <BookDetails
              book={selectedBook}
              onBack={() => setCurrentView('list')}
              onEdit={handleStartEdit}
              onDelete={handleDeleteBook}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 Online Bookstore Application | MERN Stack Practical Assignment</p>
          <p className="footer-subtext">MongoDB Atlas (StudentCluster) • Express.js • React.js • Node.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

