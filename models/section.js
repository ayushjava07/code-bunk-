const mongoose = require('mongoose');
const SectionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.String,
        ref: "Course"
    },
    Subsection: [
        {
            type: mongoose.Schema.Types.String,
            ref: "SubSection"
        }
    ]
})
module.exports=mongoose.model("Section",SectionSchema);