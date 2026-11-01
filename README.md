# 📚 Online Bookstore Application (MERN Stack)

A complete, professional, and beginner-friendly **Online Bookstore Application** built using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, and Node.js). This project is designed for a college practical assignment to demonstrate full-stack CRUD capabilities, robust data validation, RESTful API architecture, responsive modern design, and cloud database persistence.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Project Objectives](#-project-objectives)
3. [Technology Stack](#-technology-stack)
4. [Folder Structure](#-folder-structure)
5. [Database Schema & Atlas Configuration](#-database-schema--atlas-configuration)
6. [REST API Endpoints](#-rest-api-endpoints)
7. [Installation & Setup Guide](#-installation--setup-guide)
8. [Testing & Verification](#-testing--verification)
9. [Screenshots & UI Workflow](#-screenshots--ui-workflow)

---

## 🎯 Project Overview
The Online Bookstore allows college students and readers to view an inventory of books, search for books by title or author name (case-insensitive and partial match), add new books, edit existing books, view comprehensive details, and remove books with safety confirmation prompts.

Key Highlights:
- **No external heavy UI libraries**: Handcrafted, modern CSS with a clean college blue theme, card shadows, hover animations, responsive grids, and clear typography.
- **Real-time Status Badges**: Shows availability ("Available" in emerald green vs. "Out of Stock" in coral red).
- **Persistent Cloud Database**: Connects directly to **MongoDB Atlas** (`StudentCluster`), storing data in the `online_bookstore` database within the `books` collection.
- **Comprehensive Validation**: Prevents invalid prices (must be $\ge 0$), ensures non-empty titles/authors, validates strict enum availability, and handles invalid MongoDB ObjectId formats.

---

## 🎯 Project Objectives
1. **View All Books**: Browse all books in an attractive, responsive card grid.
2. **Search by Title**: Perform partial, case-insensitive title queries.
3. **Search by Author**: Find books quickly by author name.
4. **View Book Details**: Inspect complete book information including MongoDB document ID, timestamps, price, and stock status.
5. **Add New Books**: Validate and persist new book records into MongoDB Atlas.
6. **Edit Book Details**: Update book title, author, price, and stock availability.
7. **Delete Books**: Safely delete books from the cloud database with user confirmation.
8. **Manage Availability**: Toggle books between `Available` and `Out of Stock`.

---

## 💻 Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js 19 / 18 | Functional components with Hooks (`useState`, `useEffect`, `useCallback`) |
| **Build Tool** | Vite | Ultra-fast development server and production bundler |
| **HTTP Client** | Axios | Promise-based HTTP client for backend REST API calls |
| **Styling** | Modern CSS3 | Custom responsive grid, Google Fonts (Inter & Outfit), status pills, animations |
| **Backend** | Node.js & Express.js | Modular REST API with Express Router, CORS, and centralized error handling |
| **Database** | MongoDB Atlas | Cloud-hosted MongoDB cluster (`StudentCluster`) |
| **ODM** | Mongoose | Strict schema modeling, field validation, and timestamps |
| **Environment**| Dotenv | Secure configuration separation between dev/prod |

---

## 📂 Folder Structure

```text
OnlineBookstore/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection with custom DNS resolver
│   ├── models/
│   │   └── Book.js               # Mongoose Schema & Model for books collection
│   ├── routes/
│   │   └── bookRoutes.js         # Express REST API routes (GET, POST, PUT, DELETE, SEARCH)
│   ├── server.js                 # Express server configuration, CORS & middleware
│   ├── test-api.js               # Automated verification and validation test suite
│   ├── .env                      # Environment variables (PORT, MONGO_URI) - DO NOT COMMIT
│   ├── .env.example              # Template environment file with placeholders
│   ├── .gitignore                # Backend-specific ignore file
│   └── package.json              # Backend dependencies and scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with live counters & navigation buttons
│   │   │   ├── BookCard.jsx      # Reusable book card with price, status badge & action buttons
│   │   │   ├── BookList.jsx      # Responsive grid, search bar, category filters & empty states
│   │   │   ├── BookForm.jsx      # Shared form for Adding and Editing books with inline validation
│   │   │   └── BookDetails.jsx   # Detailed view for selected book metadata & timestamps
│   │   ├── services/
│   │   │   └── bookService.js    # Axios API service connecting to http://localhost:5000/api
│   │   ├── App.jsx               # Main state controller and view coordinator
│   │   ├── App.css               # Modern Bookstore blue & white responsive stylesheet
│   │   └── main.jsx              # Application entry point
│   ├── index.html                # HTML entry template with Google Fonts
│   ├── vite.config.js            # Vite bundler configuration
│   └── package.json              # Frontend dependencies and scripts
│
├── .gitignore                    # Root Git ignore file
└── README.md                     # Comprehensive project documentation
```

---

## 🗄️ Database Schema & Atlas Configuration

### Database Details
- **Cluster**: `StudentCluster`
- **Database Name**: `online_bookstore`
- **Collection Name**: `books`

### Mongoose Book Schema (`backend/models/Book.js`)
```javascript
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
      message: '{VALUE} is not a valid availability status',
    },
    default: 'Available',
  },
  createdAt: Date, // Automatic timestamp
  updatedAt: Date  // Automatic timestamp
}
```

### Whitelisting Your IP in MongoDB Atlas
If MongoDB Atlas gives a connection or TLS handshake error:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left sidebar under **Security**, click **Network Access**.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) or click **Add Current IP Address**.
5. Click **Confirm**. MongoDB Atlas will update within 1-2 minutes.

---

## 🔌 REST API Endpoints

All backend APIs are prefixed with `/api/books`.

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api` | API Health Check and Status | `200` |
| `GET` | `/api/books` | Retrieve all books (sorted newest first) | `200`, `500` |
| `GET` | `/api/books/search?query=react` | Search books by title or author | `200`, `500` |
| `GET` | `/api/books/:id` | Retrieve single book details by MongoDB ID | `200`, `400`, `404`, `500` |
| `POST` | `/api/books` | Add a new book (with field & price validation) | `201`, `400`, `500` |
| `PUT` | `/api/books/:id` | Update an existing book's details | `200`, `400`, `404`, `500` |
| `DELETE`| `/api/books/:id` | Delete a book by ID permanently | `200`, `400`, `404`, `500` |

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or higher; tested on v24.18.0)
- **npm** (v9 or higher; tested on v11.16.0)

### 2. Configure Environment Variables
Verify that `backend/.env` exists and contains:
```env
PORT=5000
MONGO_URI=mongodb+srv://STUDENT01:student01@studentcluster.3rswy5g.mongodb.net/online_bookstore?retryWrites=true&w=majority
```

### 3. Run the Backend Server
Open a terminal and execute:
```bash
cd D:\OnlineBookStore\backend
npm start
```
The backend server will start on: **`http://localhost:5000`**

### 4. Run the Frontend Application
Open a second terminal and execute:
```bash
cd D:\OnlineBookStore\frontend
npm run dev
```
The React frontend will start on: **`http://localhost:5173`** (or the displayed Vite port).

---

## 🧪 Testing & Verification

### Running the Automated API Test Suite
An automated test script is provided in `backend/test-api.js` to verify all validations and route responses:
```bash
cd D:\OnlineBookStore\backend
node test-api.js
```
Expected output:
```text
====================================================
🧪 RUNNING ONLINE BOOKSTORE API & VALIDATION TESTS
====================================================

--- [1] Testing Validation: Empty Form / Missing Fields ---
✅ PASS: POST /api/books with empty payload returns HTTP 400
✅ PASS: Error message mentions required title

--- [2] Testing Validation: Invalid & Negative Price ---
✅ PASS: POST with negative price returns HTTP 400
✅ PASS: Error message mentions price cannot be negative

--- [3] Testing Validation: Invalid Availability Enum ---
✅ PASS: POST with invalid availability returns HTTP 400
✅ PASS: Error specifies Available or Out of Stock

--- [4] Testing Validation: Invalid MongoDB ID Format ---
✅ PASS: GET with invalid ID returns HTTP 400
✅ PASS: Message states invalid MongoDB ID format

====================================================
🏁 TEST RESULTS: 8/8 assertions passed.
====================================================
```

### Manual Testing Checklist

1. **Add Book**:
   - Click **➕ Add Book** in the navigation bar.
   - Enter `Clean Code`, `Robert C. Martin`, `450`, `Available`.
   - Click **Add Book**. Observe success toast notification and new card in grid.

2. **Form Validation**:
   - Try submitting the form with empty fields &rarr; See inline error messages.
   - Try entering `-50` as price &rarr; See price validation error.

3. **View Book Details**:
   - Click **👁️ Details** on any book card.
   - Verify the modal shows Title, Author, Price in ₹, Status, MongoDB ObjectId, and Created/Updated timestamps.

4. **Edit Book & Change Availability**:
   - Click **✏️ Edit** on a book.
   - Change availability from **Available** to **Out of Stock**.
   - Change price to `550`. Click **Save Changes**.
   - Notice the status badge immediately updates to red **Out of Stock**.

5. **Search Books**:
   - Type `Clean` in the search bar &rarr; Instant filtering shows the matching book.
   - Type `Robert` in the search bar &rarr; Filters by author name.
   - Type random gibberish &rarr; Displays clear empty state: *"No books matched your search"*.
   - Click **✕** or **Clear Search** to restore all books.

6. **Delete Book**:
   - Click **🗑️ Delete** on a card.
   - A confirmation dialog appears: *"Are you sure you want to delete the book...?"*.
   - Confirm &rarr; The book is permanently removed from MongoDB Atlas and the display refreshes.

---

## 🛡️ Security Best Practices
- **No Credentials in Frontend**: All MongoDB Atlas credentials reside exclusively in `backend/.env`.
- **Git Ignore**: Both `node_modules` and `.env` are excluded via `.gitignore` to prevent secret leaks.
- **Input Sanitization**: Regular expression search parameters are escaped to prevent regex injection.

