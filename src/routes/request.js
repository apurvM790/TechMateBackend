const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{
    try {
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const fromUserId = req.user._id;

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

        res.json({
            message: "Connection Request Send Successfully.",
            data,
        });
        
    } catch (error) {
        res.status(400).send("Something Went Wrong: "+error.message);
    }

});

module.exports = requestRouter;