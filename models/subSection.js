const mongoose=require('mongoose');
const SubsectionSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true,

    },
    videoUrl:{
        type:String,
        required:true
    },
    timeDuration:{
        type:String,
        trim:true,
        required:true
    },
    additionalUrl:{
        type:String,
    }
})
module.exports=mongoose.model("SubSection",SubsectionSchema)