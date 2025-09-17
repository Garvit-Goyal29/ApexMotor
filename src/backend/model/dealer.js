const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email:{
        required: true,
        unique:true,
        type:String,
    },
    phone:{
        required: true,
        type:String,
    },
},);
const dealer = mongoose.model("dealer", userSchema);
module.exports = {
    dealer,
};

