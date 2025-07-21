const socket = require("socket.io");
const http = require("http");
const express = require("express")

const app=express();
const server = http.createServer(app);

console.log("socket created");

const io = socket(server, {
        cors:{
            origin: ["http://localhost:5173/", "https://tech-mate-frontend.vercel.app"],
            methods: ["GET", "POST"],
            credentials: true,
        }
});

io.on("connection",(socket)=>{
    console.log("a user connected: ",socket.id);

    socket.on("joinChat",({ senderId, receiverId })=>{
            const roomId = [senderId, receiverId].sort().join("$_$");
            console.log("joining room: "+roomId);
            socket.join(roomId);
    });
    
    socket.on("disconnect",()=>{
        console.log("A user disconnected : ",socket.id);
    });
});

module.exports = { app, server, io }
