const mongoose = require("mongoose")
async function connectDB(URL) {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "dealerDATA", // ✅ your MongoDB database name
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}
module.exports = { connectDB };