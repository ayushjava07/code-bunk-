const mongoose = require('mongoose');
const mailsender = require('../utils/mailSender');
const { response } = require('express');
const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    Otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
})
const sentMail = async (email,otp) => {
    try {
        mailresponse = await mailsender(email, "verification email from code bunk ", otp);
        console.log("email sent successfully :",response);
    } catch (error) {
        console.log("unable to send otp :", error.message);
        throw error
    }
}
OTPSchema.pre("save",async(next)=>{
    await sentMail(this.email,this.otp);
    next();
})
module.exports = mongoose.model("OTP", OTPSchema);