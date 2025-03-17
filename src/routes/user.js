const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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


userRouter.get("/feed", userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        // if(!([...req.query.page].every(c => "0987654321".includes(c))) || (req.query.page==="")){
        //     throw new Error("Something Wrong In Query!");
        // }

        // if(!([...req.query.limit].every(c => "0987654321".includes(c))) || (req.query.limit==="")){
        //     throw new Error("Something Wrong In Query!");
        // }

        let limit = parseInt(req.query.limit) || 10;
        limit = limit<=20 ? limit : 20;

        const page = parseInt(req.query.page) || 1;

        const skip = (page-1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((row)=>{
            hideUsersFromFeed.add(row.fromUserId.toString());
            hideUsersFromFeed.add(row.toUserId.toString());
        });

        const feed = await User.find({
            $and:[
            { _id: {$nin:  Array.from(hideUsersFromFeed) }},
            { _id: {$ne: loggedInUser._id}},
        ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({message: "feed fetched successfully.!", data:feed});
        
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = userRouter;