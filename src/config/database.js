const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://harrymiss790:Apurvm790@cluster0.8fnap.mongodb.net/devTinder")
}

module.exports = connectDB;

