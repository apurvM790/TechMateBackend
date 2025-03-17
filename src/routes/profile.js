const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

// profile View..
profileRouter.get("/profile/view", userAuth ,async (req,res)=>{
    try {
        const user = req.user;
        // res.send(user);
        res.json({message: "details fetched successfully !!", data:user});

    } catch (error) {
        res.status(400).send("Something Went Wrong...!"+error);
    }
});

// profile Edit..
profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try {
       if(!validateEditProfile(req)){
        throw new Error("Invalid Edit Feilds..!");
       }
       const loggedInUser = req.user;

       Object.keys(req.body).forEach((key) => loggedInUser[key]=req.body[key]);

       res.json({
        message: `${loggedInUser.firstName}, your profile updated successfully.`,
        data: loggedInUser
       });

       await loggedInUser.save();
        
    } catch (error) {
        res.status(400).send("ERROR: "+error.message);
    }
});


// reset password
profileRouter.patch("/profile/password", userAuth, async (req,res)=>{
    try {
        // validate the entered password with the original password..
        const { currentPassword , newPassword} = req.body;
        const loggedInUser = req.user;

        const isValid = await bcrypt.compare(currentPassword, loggedInUser.password);

        if(!isValid){
            throw new Error("Password not matched, Plese enter the correct password!");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Inter Strong Password, for better security");
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        loggedInUser.password = newHashedPassword;
        await loggedInUser.save();
        
        res.send("Password Updated Successfully");
        
    } catch (error) {
        res.status(400).send("ERROR: "+error.message);
        
    }
});


module.exports = profileRouter;