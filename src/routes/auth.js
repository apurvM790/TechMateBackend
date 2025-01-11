const express = require("express");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// registering the user for the first time..
authRouter.post("/signup",async (req,res)=>{
    try {
        // validating
        validateSignUp(req);

        const { firstName, lastName, email, password } = req.body;
        
        // Encrypting password..
        const passwordHash =await bcrypt.hash(password, 10);
        // console.log(passwordHash);

        // creating the new instance of the schema..
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        res.send("user added successfully!..")    
    } catch (error) {
        res.status(400).send("Something Went Wrong...!"+error);
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
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$7905", { expiresIn: "7d" });

            // Add token to the cookie and send back to the user..
            res.cookie("token",token, {expires : new Date(Date.now() + 8 * 3600000)});
            res.send("Login successfully..!");
        }
        else{
            throw new Error("Invalid Credentials..!");
        }
        
    } catch (error) {
        res.status(400).send("Something Went Wrong...!"+error);
    }
});

// Logout user..
authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null, { expires : new Date(Date.now())});

    res.send("Logout successfull!");
});

module.exports = authRouter;