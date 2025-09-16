const mongoose = require("mongoose")
async function connectDB(URL) {
    mongoose.connect(URL);
}
module.exports = {
    connectDB,
}