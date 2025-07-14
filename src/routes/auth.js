const express = require("express");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { MALE_URL, FEMALE_URL } = require("../utils/constants");

const authRouter = express.Router();

// registering the user for the first time..
authRouter.post("/signup",async (req,res)=>{
    try {
        // validating
        validateSignUp(req);

        const { firstName, lastName, email, password, age, gender } = req.body;

        const findUser = await User.findOne({ email:email });
        if(findUser){
            throw new Error("user already registered");
        }

        const photoUrl = (gender=="Male" || gender=="other") ? MALE_URL : FEMALE_URL ;
            
        // Encrypting password..
        const passwordHash =await bcrypt.hash(password, 10);
        // console.log(passwordHash);

        // creating the new instance of the schema..
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            age,
            gender,
            photoUrl
        });

        await user.save();
        res.json({message:"User added successfully!", data:user});   
    } catch (error) {
        res.status(400).json({message:`${error}`});
    }
})

// login user..
authRouter.post("/login",async (req,res)=>{ 
    try {
        const { email, password } = req.body;

        if(!validator.isEmail(email)){
            throw new Error("Invalid Credentials..!");
        }

        const user = await User.findOne({ email:email });
        if(!user){
            throw new Error("Invalid Credentials..!");
        }
        const isCorrect =await bcrypt.compare(password, user.password);
        if(isCorrect){
            // creating JWT token..
            const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: "7d" });

            // Add token to the cookie and send back to the user..
            res.cookie("token",token, {expires : new Date(Date.now() + 7 * 3600000)});
            res.status(200).json({message:"data fetched successfully!", data:user});
        }
        else{
            throw new Error("Invalid Credentials..!");
        }
        
    } catch (error) {
        res.status(400).send(" "+error);
    }
});

// Logout user..
authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null, { expires : new Date(Date.now())});

    res.send("Logout successfull!");
});

module.exports = authRouter;