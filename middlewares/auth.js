const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user')
exports.isauth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "").trim();
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing !"
            })
        }
        try {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            console.log(verifyToken);
            req.user = verifyToken;
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: "Invalid token !"
            })
        }
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "something went wrong plz try again later!!!"
        })
    }
}

exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success:false,
                message:"this is route for student only"
            })
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success:"something went wrong with your token try again later!!"
        })
    }
}
exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success:false,
                message:"this is route for Instructor only"
            })
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success:"something went wrong with your token try again later!!"
        })
    }
}
exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success:false,
                message:"this is route for Admin only"
            })
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success:"something went wrong with your token try again later!!"
        })
    }
}