const Profile = require('../models/profile');
const User = require('../models/user');
exports.UpdateProfile = async (req, res) => {
    try {
        const { userId, contactNumber, gender, about, Dob } = req.body;
        if (!userId || !contactNumber || !gender || !about || !Dob) {
            return res.status(400).json({
                success: false,
                message: "all fields required"
            })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "no user found"
            })
        }
        const updateProfile = await Profile.findByIdAndUpdate(user.additionalDetails, {
            contactNumber, gender, about, Dob:new Date(Dob)
        }, { new: true });
        const updatedUser = await User.findById(userId).populate("additionalDetails").exec();
        return res.status(200).json({
            success: true,
            message: 'profile updated successfully',
            updatedUser: updatedUser,
            updatedProfile: updateProfile
        })
    } catch (error) {
        console.log("something went wrong while updating the user", error.message);
        return res.status(500).json({
            success: false,
            message: "something went wrong while updating profile",
            error: error.message
        })
    }
}
exports.deleteAccount = async (req, res) => {
    try {
        const { userId, ProfileId } = req.body;
        if (!userId || !ProfileId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const deleteAccount = await User.findByIdAndDelete(userId);
        const deleteProfileDetails = await Profile.findByIdAndDelete(ProfileId);
        return res.status(200).json({
            success: true,
            message: "user deleted successfully"
        })
    } catch (error) {
        console.log("unable to delete user", error.message);
        return res.status(500).json({
            success: false,
            message: "something went wrong while deleting the user",
            error: error.message
        })

    }
}
exports.getAllUsersdetails = async (req, res) => {
    try {
            const{userId}=req.body;
    if(!userId){
        return res.status(400).json({
            success:false,
            message:'all fields are required'
        })
    }
    const userDetails=await User.findById(userId).populate("additionalDetails").exec();
    if(userDetails){
        return res.status(200).json({
            success:true,
            message:"user details fetched successfully",
            details:userDetails
        })
    }
    } catch (error) {
        console.log("unable to fetch user details:",error.message);
        return res.status(500).json({
            success:false,
            message:"unable to fetch user details try again",
            error:error.message
        })
        
    }
}