const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req,res)=>{

    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find(
                    {toUserId: loggedInUser._id, status:"interested"}).populate("fromUserId", USER_SAFE_DATA);
                    // {toUserId: loggedInUser._id, status:"interested"}).populate("fromUserId", ["firstName", "lastName", "photoUrl",]);

        res.json({message:"Connection Requests fetched successfully.", data: connectionRequests});
        
    } catch (error) {
        res.status(400).send("ERROR: "+error.message);
    }
});


userRouter.get("/user/connections", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find(
            {$or: [
                    {fromUserId: loggedInUser._id, status: "accepted"},
                    {toUserId: loggedInUser._id, status: "accepted"},
                ]
            }
        ).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({message: "connections fetched successfully !", data: data});
        
    } catch (error) {
        res.status(400).send({message:error.msessage});
    }

});

module.exports = userRouter;