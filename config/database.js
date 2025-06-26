const express=require('express');
const {mongoose} = require('mongoose');

require("dotenv").config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>console.log("mongo db connected"))
    .catch((error)=>{
        console.log("mongo db not connected ")
        console.log(error);
        process.exit(1);
    })

}
