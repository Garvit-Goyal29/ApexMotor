const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500",   // ✅ allow your frontend (Live Server)
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    allowedHeaders: ["Content-Type"], // allow JSON headers
}));
const port = 5000;
const { connectDB } = require("./connection");
const urlRoute = require("./routes/route");
connectDB("mongodb://localhost:27017/dealer").then(() => {
    console.log("Connected");
}).catch((err) => {
    console.log("Error: ", err);
})
app.use("/dealerForm", urlRoute)
app.listen(port, () => console.log("Server started at PORT: ", port));