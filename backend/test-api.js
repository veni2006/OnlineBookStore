/**
 * Automated Verification Script for Online Bookstore API
 * Tests validation, error handling, and CRUD operations.
 */
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);

let server;
const PORT = 5055; // dedicated test port

const runTests = async () => {
  console.log('====================================================');
  console.log('🧪 RUNNING ONLINE BOOKSTORE API & VALIDATION TESTS');
  console.log('====================================================\n');

  server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}/api/books`;

  let passedTests = 0;
  let totalTests = 0;

  const assert = (description, condition) => {
    totalTests++;
    if (condition) {
      console.log(`✅ PASS: ${description}`);
      passedTests++;
    } else {
      console.error(`❌ FAIL: ${description}`);
    }
  };

  try {
    // ----------------------------------------------------
    // TEST 1: Validation - Empty Form / Missing Fields
    // ----------------------------------------------------
    console.log('\n--- [1] Testing Validation: Empty Form / Missing Fields ---');
    const emptyRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const emptyData = await emptyRes.json();
    assert('POST /api/books with empty payload returns HTTP 400', emptyRes.status === 400);
    assert('Error message mentions required title', emptyData.message.includes('title is required'));

    // ----------------------------------------------------
    // TEST 2: Validation - Negative / Invalid Price
    // ----------------------------------------------------
    console.log('\n--- [2] Testing Validation: Invalid & Negative Price ---');
    const negPriceRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Learn MERN',
        author: 'John Doe',
        price: -50,
        availability: 'Available',
      }),
    });
    const negPriceData = await negPriceRes.json();
    assert('POST with negative price returns HTTP 400', negPriceRes.status === 400);
    assert('Error message mentions price cannot be negative', negPriceData.message.includes('cannot be negative'));

    // ----------------------------------------------------
    // TEST 3: Validation - Invalid Availability Enum
    // ----------------------------------------------------
    console.log('\n--- [3] Testing Validation: Invalid Availability Enum ---');
    const invalidAvailRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Learn MERN',
        author: 'John Doe',
        price: 299,
        availability: 'Discontinued',
      }),
    });
    const invalidAvailData = await invalidAvailRes.json();
    assert('POST with invalid availability returns HTTP 400', invalidAvailRes.status === 400);
    assert('Error specifies Available or Out of Stock', invalidAvailData.message.includes('Available'));

    // ----------------------------------------------------
    // TEST 4: Validation - Invalid MongoDB ID
    // ----------------------------------------------------
    console.log('\n--- [4] Testing Validation: Invalid MongoDB ID Format ---');
    const invalidIdRes = await fetch(`${baseUrl}/invalid-id-xyz`);
    const invalidIdData = await invalidIdRes.json();
    assert('GET with invalid ID returns HTTP 400', invalidIdRes.status === 400);
    assert('Message states invalid MongoDB ID format', invalidIdData.message.includes('Invalid MongoDB ID'));

    // ----------------------------------------------------
    // TEST 5: Database CRUD Operations (if Atlas is accessible)
    // ----------------------------------------------------
    console.log('\n--- [5] Testing MongoDB Connection for CRUD Cycle ---');
    let dbConnected = false;
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'online_bookstore',
        serverSelectionTimeoutMS: 4000,
      });
      dbConnected = true;
      console.log(' Connected to MongoDB Atlas! Proceeding with Live CRUD testing...');
    } catch (err) {
      console.log('⚠️ MongoDB Atlas is not currently whitelisted for this IP. Skipping live Atlas write tests.');
      console.log('   (Whitelist your IP in MongoDB Atlas to run live writes).');
    }

    if (dbConnected) {
      // 5a. CREATE
      console.log('\n--- [5a] CREATE: Adding a new book ---');
      const createRes = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'JavaScript: The Definitive Guide',
          author: 'David Flanagan',
          price: 799,
          availability: 'Available',
        }),
      });
      const createData = await createRes.json();
      assert('POST /api/books returns HTTP 201 Created', createRes.status === 201);
      assert('Saved book has valid MongoDB _id', createData.data && Boolean(createData.data._id));
      const createdId = createData.data?._id;

      // 5b. READ ALL
      console.log('\n--- [5b] READ: Fetching all books ---');
      const getAllRes = await fetch(baseUrl);
      const getAllData = await getAllRes.json();
      assert('GET /api/books returns HTTP 200', getAllRes.status === 200);
      assert('Response contains array of books', Array.isArray(getAllData.data) && getAllData.data.length > 0);

      // 5c. READ ONE
      console.log('\n--- [5c] READ ONE: Fetching book by ID ---');
      const getOneRes = await fetch(`${baseUrl}/${createdId}`);
      const getOneData = await getOneRes.json();
      assert('GET /api/books/:id returns HTTP 200', getOneRes.status === 200);
      assert('Retrieved book title matches', getOneData.data.title === 'JavaScript: The Definitive Guide');

      // 5d. SEARCH BY TITLE
      console.log('\n--- [5d] SEARCH: Searching by book title ---');
      const searchTitleRes = await fetch(`${baseUrl}/search?query=Definitive`);
      const searchTitleData = await searchTitleRes.json();
      assert('Search by title returns matching book', searchTitleData.data.some((b) => b._id === createdId));

      // 5e. SEARCH BY AUTHOR
      console.log('\n--- [5e] SEARCH: Searching by author name ---');
      const searchAuthorRes = await fetch(`${baseUrl}/search?query=Flanagan`);
      const searchAuthorData = await searchAuthorRes.json();
      assert('Search by author returns matching book', searchAuthorData.data.some((b) => b._id === createdId));

      // 5f. UPDATE (including availability change)
      console.log('\n--- [5f] UPDATE: Modifying title, price, and changing availability to Out of Stock ---');
      const updateRes = await fetch(`${baseUrl}/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'JavaScript: The Definitive Guide (7th Edition)',
          author: 'David Flanagan',
          price: 899.50,
          availability: 'Out of Stock',
        }),
      });
      const updateData = await updateRes.json();
      assert('PUT /api/books/:id returns HTTP 200', updateRes.status === 200);
      assert('Availability successfully updated to "Out of Stock"', updateData.data.availability === 'Out of Stock');
      assert('Price successfully updated to 899.50', updateData.data.price === 899.50);

      // 5g. DELETE
      console.log('\n--- [5g] DELETE: Removing the book ---');
      const deleteRes = await fetch(`${baseUrl}/${createdId}`, {
        method: 'DELETE',
      });
      const deleteData = await deleteRes.json();
      assert('DELETE /api/books/:id returns HTTP 200', deleteRes.status === 200);
      assert('Delete confirmation message returned', deleteData.message.includes('deleted successfully'));

      // 5h. VERIFY DELETION (404)
      const verifyRes = await fetch(`${baseUrl}/${createdId}`);
      assert('Fetching deleted book returns HTTP 404 Not Found', verifyRes.status === 404);
    }
  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
    console.log('\n====================================================');
    console.log(`🏁 TEST RESULTS: ${passedTests}/${totalTests} assertions passed.`);
    console.log('====================================================\n');
    process.exit(0);
  }
};

runTests();

