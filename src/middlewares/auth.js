const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try {
        const { token } = req.cookies;

        if(!token){
            throw new Error("Invalid Token, Please Login Again...!");
        }

        // validate token..
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$7905");

        const { _id } = decodedMessage;
        
        // finding user in the database..
        const user = await User.findById( _id );
    
        if(!user){
            throw new Error("User Does Not Exist..!");
        }
        req.user = user;
        next();
        
    } catch (error) { 
        res.status(400).send("ERROR: "+error.message);
    }

}

module.exports = { userAuth };