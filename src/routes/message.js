const express = require("express");
const Message = require("../models/message");
const Connection = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const cloudinary = require("../utils/cloudinary");

const messageRouter = express.Router();

messageRouter.get("/message/user", userAuth, async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;

        const fetchedUser = await Connection.find({ $and:[
            {$or:[{ fromUserId: loggedInUserId },{ toUserId:loggedInUserId }]},
            {status:"accepted"}
        ]}).populate("fromUserId").populate("toUserId");

        const connectionData = fetchedUser.map((conn)=>{
            if(conn?.fromUserId?._id.toString()===loggedInUserId.toString()){
                return conn?.toUserId;
            }
            else{
                return conn?.fromUserId;
            }
        });
        
        res.status(200).json({message:"fetched succesfully",data:connectionData});
        
    } catch (error) {
        res.status(400).json(error.message);
    }
});

messageRouter.get("/message/:id", userAuth, async (req,res)=>{
    try {
        const { id:receiverId } = req.params;
        const loggedInUserId = req.user._id;

        const fetchedMessages = await Message.find({
            $or:[{ senderId:loggedInUserId, receiverId:receiverId },
                { senderId:receiverId, receiverId:loggedInUserId }
            ]
        });

        res.status(200).json({message:"message fetched succesfully", data:fetchedMessages});
        
    } catch (error) {
        res.status(400).json(error.message);
    }
});

messageRouter.post("/message/send/:id", userAuth, async (req,res)=>{
    try {
        const { id:receiverId } = req.params;
        const { text, image } = req.body;
        
        const senderId = req.user._id;
        let imageUrl;
        if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        }
        console.log(imageUrl);

        const newMessage = new Message({ senderId, receiverId, text, image:imageUrl});
        await newMessage.save();

        //todo: realtime chat using socket.io

        res.status(200).json({data:newMessage});

    } catch (error) {
        res.status(400).json(error.message);
    }
});


module.exports = messageRouter;