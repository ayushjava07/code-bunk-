const mongoose=require('mongoose');
const course = require('./course');
const TagsSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    decription:{
        type:String,
        trim:true,
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
})
module.exports=mongoose.model("Tag",TagsSchema);