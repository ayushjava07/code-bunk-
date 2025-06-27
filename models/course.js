const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true
    },
    courseDescription: {
        type: String,
        trim: true,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    WhatYouWillLearn: {
        type: String,
        trim: true,
        required: true
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true
        }
    ],
    price: {
        type: Number,
        required: true,
        trim: true
    },
    tags: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true
    },
    reviewAndRating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewAndRating",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})
module.exports=mongoose.model("Course",CourseSchema);