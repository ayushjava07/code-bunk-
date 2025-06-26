const mongoose=require('mongoose');
const ProfileSchema=new mongoose.Schema({
    gender:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        trim:true,
    },
    Dob:{
        type:String,
        trim:true,
    },
    about:{
        type:String,
        trim:true,
    }
})
module.exports=mongoose.model("Profile",ProfileSchema);