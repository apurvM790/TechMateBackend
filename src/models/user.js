
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
        enum: ["Male","Female","other"]
    },
    photoUrl: {
        type: String,
        default: "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon-thumbnail.png",

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

userSchema.index({firstName: 1, lastName: 1});

module.exports = mongoose.model("User",userSchema);