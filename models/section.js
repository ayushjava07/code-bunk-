const mongoose = require('mongoose');
const SectionSchema = new mongoose.Schema({
    SectionTitle:{
        type:String,
        required:true,
        trim:true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required:true
    },
    Subsection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }
    ]
})
module.exports=mongoose.model("Section",SectionSchema);