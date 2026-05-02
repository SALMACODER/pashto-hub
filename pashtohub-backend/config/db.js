/**
 * MongoDB connection using Mongoose.
 * Does NOT kill the server on failure — the API stays up so the
 * frontend can show a meaningful error instead of a connection refused.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast instead of waiting 30s
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('⚠️  Server will keep running, but database routes will fail until Mongo is reachable.');
    // Do NOT call process.exit(1) — let the server stay alive
  }
};

module.exports = connectDB;