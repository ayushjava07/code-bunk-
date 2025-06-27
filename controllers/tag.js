const Tag = require('../models/tag');
const user = require('../models/user');
//create tag
exports.Tag = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(500).json({
                success: false,
                message: "all fields are required",
            })
            const createTag = await Tag.create({ name, description });
            if (createTag) {
                return res.status(200).json({
                    success: true,
                    message: "tag created successfully✅",
                })
            }
        }
    } catch (error) {
        console.log("error occur while creating tag:", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating tag ",
            error:error.message
        })
    }
}
//get all tag
exports.getTags = async (req, res) => {
    try {
        const tags=await Tag.find({},{name:true,description:true});
        if(tags){
            return res.status(200).json({
                success:true,
                message:"tags fetches successfully",
                tags:tags
            })
        }
    } catch (error) {
        console.log("error occur while fetching tags:", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while fetching tag ",
            error
        })
    }
}