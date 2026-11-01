const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const sampleBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    price: 499.0,
    availability: 'Available',
  },
  {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    price: 350.0,
    availability: 'Available',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    price: 599.0,
    availability: 'Out of Stock',
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    price: 850.0,
    availability: 'Available',
  },
  {
    title: "You Don't Know JS: Scope & Closures",
    author: 'Kyle Simpson',
    price: 299.0,
    availability: 'Available',
  },
];

const seedDB = async () => {
  try {
    console.log('[MongoDB Atlas] Connecting to cluster...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'online_bookstore',
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB Atlas] Connected to database: ${conn.connection.name}`);

    const existingCount = await Book.countDocuments();
    if (existingCount === 0) {
      const inserted = await Book.insertMany(sampleBooks);
      console.log(`[Seed Success] Inserted ${inserted.length} starter books into collection 'books'.`);
    } else {
      console.log(`[Seed Info] Database already contains ${existingCount} book(s).`);
    }

    const allBooks = await Book.find();
    console.log('\n--- Current Books in online_bookstore.books ---');
    allBooks.forEach((b, i) => {
      console.log(`${i + 1}. "${b.title}" by ${b.author} - ₹${b.price} [${b.availability}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error.message);
    process.exit(1);
  }
};

seedDB();

