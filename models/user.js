const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    }
    ,
    email: {
        type: String,
        unique: true,
        required: true
    }
    ,
    password: {
        type: String,
        required: true
    },
    additionDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    accountType: {
        required: true,
        type: String,
        enum: ["Student", "Admin", "Instructor"]
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    token:{
        type:String,
    },
    resetExpiresPw:{
        type:Date,
        default:Date.now()
    },
    image: {
        type: String,
        required: true
    },
    courseProgress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress"
    }
}
)
module.exports=mongoose.model("User",UserSchema);