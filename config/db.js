const mongoose = require("mongoose");

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // Fallback to local MongoDB if placeholder or empty
  if (!uri || uri.includes("<username>") || uri.includes("<cluster>")) {
    console.log("⚠️ MONGO_URI not configured. Falling back to local MongoDB connection...");
    uri = "mongodb://127.0.0.1:27017/saumya-stores";
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("ℹ️ Server will continue running in DEMO fallback mode.");
    // Don't call process.exit so nodemon can keep running and retry on file save
  }
};

module.exports = connectDB;