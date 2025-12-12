const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGO_URI from env:", process.env.MONGO_URI);  // <--- add this

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
