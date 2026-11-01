const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable public DNS servers to resolve MongoDB SRV records on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('[Database] Could not configure DNS servers:', dnsErr.message);
}

/**
 * Connect to MongoDB Atlas (StudentCluster / online_bookstore)
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[Database Error] MONGO_URI is missing in backend/.env file.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'online_bookstore',
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB Atlas Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('\n======================================================');
    console.error('[MongoDB Atlas Connection Warning]');
    console.error(`Details: ${error.message}`);
    console.error('Note: If this is an IP Whitelist error, go to MongoDB Atlas:');
    console.error('  1. Navigate to "Security" > "Network Access"');
    console.error('  2. Click "Add IP Address" and select "Allow Access from Anywhere" (0.0.0.0/0)');
    console.error('  3. Click "Confirm" and wait 1 minute for changes to take effect.');
    console.error('======================================================\n');
  }
};

module.exports = connectDB;
