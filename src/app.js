const { app, server, io } = require("./utils/socket");
const express = require("express");
const connectDB = require("../src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { BASE_URL } = require("./utils/constants");

require('dotenv').config();


app.use(cors({
    origin: BASE_URL,
    credentials: true,
}));
app.use(express.json()) // middleware to convert json to javascript object or readable form...
app.use(cookieParser()); // middleware to parse cookies stored in the browser..

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",messageRouter);


connectDB()
.then(()=>{
    console.log("DataBase connected succesfully...!");
    
    server.listen(process.env.PORT,()=>{
        console.log("Server is listening at port: ",3000);
    });

})
.catch(err=>{
    console.error("DataBase not connected...!",err);
});
