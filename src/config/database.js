const mongoose = require("mongoose");


const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_CONNECTION_STR);
}

module.exports = connectDB;

