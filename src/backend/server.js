const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT ||  5000;

//Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://127.0.0.1:5500", "https://apex-motor.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());

// Connect to MongoDB
const { connectDB } = require("./connection");
const urlRoute = require("./routes/route");
connectDB(process.env.MONGO_URI)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

//Route
app.use("/dealerForm", urlRoute)

//Port
app.listen(port, () => console.log(`🚀 Server running on PORT: ${port}`));