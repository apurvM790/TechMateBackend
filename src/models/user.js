
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 20,
        trim: true,
        minLength: 4,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
        minLength: 4,
    },
    email :{
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ["M","F","other"]
    },
    photoUrl: {
        type: String,
        default: "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg?w=360",

    },
    about: {
        type: String,
        default: "This is about the user...",
    },
    skills: {
        type : [String]
    }
}, 
{timestamps: true}
);

module.exports = mongoose.model("User",userSchema);