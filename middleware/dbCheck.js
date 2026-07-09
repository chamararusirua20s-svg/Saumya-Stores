const mongoose = require("mongoose");

/**
 * Middleware that returns a 503 if MongoDB is not connected.
 * Attach this to any route that needs a live DB.
 */
const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database not connected. Please configure MONGO_URI in server/.env",
    });
  }
  next();
};

module.exports = { requireDB };
