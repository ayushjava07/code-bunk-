const { uploadImage } = require('../utils/imageUploader');
const User = require('../models/user');
const Tag = require('../models/category');
const Course = require('../models/course')
require('dotenv').config();
exports.createCourse = async (req, res) => {
    const { courseName, courseDescription, WhatYouWillLearn, price, category } = req.body;
    const { thumbnail } = req.file;
    if (!courseName || !courseDescription || !thumbnail || !WhatYouWillLearn || !thumbnail || !category || !price) {
        return res.status(300).json({
            success: false,
            message: "all fields are required!"
        })
    }
    try {
        const UserId = req.user.id;
        const instructorDetails = await User.findOne({ UserId });
        if (!instructorDetails) {
            return res.status(404).json({
                success: true,
                message: "No instructor found "
            })
        }
        const tagDetails = await Tag.findById({ category });
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: "tag not found"
            })
        }
        const CloudImageUrl = await uploadImage(thumbnail, process.env.FOLDER_NAME);
        const CourseCreate = await Course.create({
            courseName,
            courseDescription,
            WhatYouWillLearn,
            price,
            category: category._id,
            thumbnail: CloudImageUrl,
            instructor: instructorDetails._id,
        })
        //add the new course to the user schema of instructor
        await User.findByIdAndDelete(
            { id: instructorDetails._id },
            { $push: { Courses: CourseCreate._id } },
            { new: true }
        )
        //update tag 🌀💸 hw




        
        if (createCourse) {
            res.status(200).json({
                success: true,
                message: "course created successfully"
            })
        }
    } catch (error) {
        console.log("something went wrong while creating course", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating course ",
            error: error.message
        })
    }
}
//get all courses
exports.getAllCourse = async () => {
    try {
        const course = Course.find({}, {
        courseName: true,
        thumbnail: true,
        price: true,
        instructor: true,
        reviewAndRating: true,
        studentsEnrolled:true,
    }).populate("Instructor").exec();
    return res.status(200).json({
        success:true,
        message:"successfully loaded all the course",
        course:course
    })
    } catch (error) {
        console.log("something went wrong while loading course", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while loading course ",
            error: error.message
        })
    }
}