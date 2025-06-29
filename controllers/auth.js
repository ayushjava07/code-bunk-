const bcrypt = require('bcrypt');
const OtpGenerator = require('otp-generator');
const User = require('../models/user');
const OTP = require('../models/OTP');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
const cookie = require('cookies-parser');
require('dotenv').config();
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserpresent = await User.findOne({ email });
        if (checkUserpresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }
        let otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("otp generated :", otp);
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({ otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp //❌❌
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, otp, contactNumber, accountType } = req.body;
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "passwords does not matched"
            })
        }
        const exisitingUser = await User.findOne({ email });
        if (exisitingUser) {
            return res.status(300).json({
                success: false,
                message: "user already exist with this email"
            })
        }
        const findOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        if (!findOtp || findOtp.Otp !== otp) {
            return res.status(401).json({
                success: false,
                message: "otp did not matched"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const profileDetails = await Profile.create({
            contactNumber,
            Dob: null,
            about: null,
            gender: null
        });
        const addToUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            additionalDetails: profileDetails._id,
            accountType,
            image: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=bunkcode${email}`
        })
        if (addToUser) {
            return res.status(200).json({
                success: true,
                message: "sign up successful",
            })
        }
    } catch (error) {
        console.log("unable to sign up :", error.message)
        return res.status(400).json({
            success: false,
            message: "something went wrong while signing up try again later",
            error: error
        })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "all fields required"
            })
        }
        const user = await User.findOne({ email }).populate('additionalDetails');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not registered"
            })
        }
        const confirmPassword = await bcrypt.compare(password, user.password);
        if (confirmPassword) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.accountType,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2h" });
            user.token = token;
            user.password = undefined;
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "invalid credentials",
            })
        }
    } catch (error) {
        console.log("login failed ", error);
        res.status(400).json({
            success: false,
            message: "something went wrong while signin in try again later",
            error
        })
    }
}
exports.changePassword = async (req, res) => {
    const { password, newPassword, confirmPassword } = req.body;
    const token = req.body.token || req.cookies.token || req.header("Authorization").replace('Bearer', "").trim();
    if (!token) {
        return res.status(402).json({
            success: false,
            message: "unable to find token"
        })
    }
    try {
        const user = await User.findOne({ token });
        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(300).json({
                success: false,
                message: "kindly check your Recent password"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        if (bcrypt.compare(newPassword,user.password)) {
            return res.status(303).json({
                success: false,
                message: "you cannot use previous password"
            })
        }
        const changePw = await User.updateOne({ token }, { password: hashPassword }, { new: true });
        if (changePw) {
            res.status(200).json({
                success:true,
                message:"password reset successful💎"
            })
        }
    }

    catch (error) {
        console.log("some thing went wrong while changing pw :",error);
        res.status(404).json({
            success:false,
            message:"some thing went wrong while changing pw ",
            error:error.message
        })
    }


}