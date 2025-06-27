const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailsender = require("../utils/mailSender");
//snding mail
exports.sendmailpw = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            })
        }
        const token = crypto.randomUUID();
        const UpdatedDetails = await User.findOneAndUpdate({ email }, {
            token: token, resetExpiresPw: Date.now() + 5 * 60 * 1000
        }, {
            new: true
        })
        const Url = `http:/localhost:3000/update-password${token}`;
        const mail = await mailsender(email, "password reset link", Url);
        return res.status(200).json({
            success: true,
            message: "mail sent successfully✅"
        })
    } catch (error) {
        console.log("some thing went wrong :", error);
        return res.status(400).json({
            success: false,
            message: "unable to send mail or something went wring while sending email to reset the password"
        })
    }
}
//reset the pw
exports.resetpw = async (req, res) => {
    const { password, confirmPassword, token } = req.body;
    try {
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        if (password !== confirmPassword) {
            return res.status(301).json({
                success: false,
                message: "password not matched"
            })
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "invalid token"
            })
        }
        if (user.resetExpiresPw < Date.now()) {
            return res.status(500).json({
                success: false,
                message: "your token expires"
            })
        }
        const hashPassword = bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ token: token }, { password: hashPassword }, { new: true });
        return res.status(200).json({
            success: true,
            message: "password reset successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: "something went wrong while reset pw"
        })
    }
}