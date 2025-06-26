const User = require('../models/user');
const OtpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const bcrypt=require('bcrypt')
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
        let Otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("otp generated :", Otp);
        let result = await OTP.findOne({ Otp: Otp });
        while (result) {
            Otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({ Otp: Otp });
        }
        const otpPayload = { email, Otp };
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success: "true",
            message: "OTP sent successfully",
            Otp
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: "false",
            message: error.message
        })
    }
}
exports.signup = () => {
    const { firstName, lastName, email, password, confirmPassword,otp,accountType, } = req.body;
    if (!firstName&&!lastName&&!email&&!password&&!confirmPassword){
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }
    if(password!==confirmPassword){
        return res.status(401).json({
            success:false,
            message:"passwords does not matched"
        })
    }
    if(User.findOne({email})){
        return res.status(300).json({
            success:false,
            message:"user already exist with this email"
        })
    }
    const findOtp =OTP.findOne({email}).sort({createdAt:-1}).limit(1);
    if(!findOtp==otp){
        return res.status(401).json({
            success:false,
            message:"otp did not matched"
        })
    }
    const hashPassword=bcrypt.getRounds()
}