import React, { useState, useEffect } from 'react';

const BookForm = ({ book = null, onSubmit, onCancel, isSubmitting = false }) => {
  const isEditMode = Boolean(book && book._id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    availability: 'Available',
  });

  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  // Populate form if in edit mode
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price !== undefined ? String(book.price) : '',
        availability: book.availability || 'Available',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        price: '',
        availability: 'Available',
      });
    }
    setErrors({});
    setFormTouched(false);
  }, [book]);

  // Validation function
  const validate = (data) => {
    const newErrors = {};

    if (!data.title || data.title.trim() === '') {
      newErrors.title = 'Book title is required.';
    }

    if (!data.author || data.author.trim() === '') {
      newErrors.author = 'Author name is required.';
    }

    if (data.price === '' || data.price === null || data.price === undefined) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(data.price))) {
      newErrors.price = 'Price must be a valid number.';
    } else if (Number(data.price) < 0) {
      newErrors.price = 'Price must be a positive number or zero (cannot be negative).';
    }

    if (!data.availability || !['Available', 'Out of Stock'].includes(data.availability)) {
      newErrors.availability = 'Please select a valid availability status.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (formTouched) {
      const currentErrors = validate(updatedData);
      setErrors(currentErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormTouched(true);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      price: Number(formData.price),
      availability: formData.availability,
    };

    onSubmit(payload);
  };

  return (
    <div className="form-container-card">
      <div className="form-header">
        <div className="form-header-text">
          <h2 className="form-title">{isEditMode ? '✏️ Edit Book Details' : '➕ Add New Book'}</h2>
          <p className="form-subtitle">
            {isEditMode
              ? 'Modify the book information below and save your changes.'
              : 'Enter the book information to add it to MongoDB Atlas.'}
          </p>
        </div>
      </div>

      <form className="book-form" onSubmit={handleSubmit} noValidate>
        {/* Book Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Book Title <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g. Clean Code"
            value={formData.title}
            onChange={handleChange}
            autoFocus={!isEditMode}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Author Name */}
        <div className="form-group">
          <label htmlFor="author" className="form-label">
            Author Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className={`form-input ${errors.author ? 'input-error' : ''}`}
            placeholder="e.g. Robert C. Martin"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <span className="error-message">{errors.author}</span>}
        </div>

        {/* Price & Availability Row */}
        <div className="form-row">
          {/* Price */}
          <div className="form-group flex-1">
            <label htmlFor="price" className="form-label">
              Price (₹) <span className="required-star">*</span>
            </label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                className={`form-input has-prefix ${errors.price ? 'input-error' : ''}`}
                placeholder="499.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          {/* Availability */}
          <div className="form-group flex-1">
            <label htmlFor="availability" className="form-label">
              Availability Status <span className="required-star">*</span>
            </label>
            <select
              id="availability"
              name="availability"
              className={`form-input form-select ${errors.availability ? 'input-error' : ''}`}
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            {errors.availability && <span className="error-message">{errors.availability}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span> Saving...
              </>
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Add Book'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;

