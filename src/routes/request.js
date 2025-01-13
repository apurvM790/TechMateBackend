const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{
    try {
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const fromUserId = req.user._id;

        if(req.user._id.equals(toUserId)){
            throw new Error("Invalid connection Request!, Can not Make request to yourself..!");
        }

        const connectionRequest = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        });

        const allowedStatus = [ "interested", "ignored"];
        if(!allowedStatus.includes(status)){
           return res.status(404).json({message: "Invalid Status Type: "+status});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]    
        });

        if(existingConnectionRequest){
            return res.status(404).json({message: "Connection Request Already Exists.!"});
        }

        const data = await connectionRequest.save();
        const toUser = await User.findById(toUserId);
        res.json({
            message: req.user.firstName + ((status=="interested"? " is Interested in " : " Ignored ") + toUser.firstName),
            data:data,
        });
        
    } catch (error) {
        res.status(400).send("Something Went Wrong: "+error.message);
    }

});


requestRouter.post("/request/review/:status/:userId", userAuth , async (req,res)=>{
    try {
        const loggedInUser = req.user;

        const { status, userId } = req.params;
        const toUserId = loggedInUser._id;

        const allowedStatus = [ "accepted", "rejected" ];
        
        if(!allowedStatus.includes(status)){
            return res.status(404).json({message: "Status Not Valid!"});
        }

        const isLoggedInUser = await ConnectionRequest.findOne({
            _id: userId,
            toUserId: toUserId,
            status: "interested",
        });

        if(!isLoggedInUser){
            return res.status(404).json({message: "Connection Request Not Found..!"});
        }

        isLoggedInUser.status = status;

        const data = await isLoggedInUser.save();

        res.status(200).json({message: "Connection "+status+" Successfully..!", data:data});
        
    } catch (error) {
        res.status(400).send("ERROR: "+error.message);    
    }
});

module.exports = requestRouter;