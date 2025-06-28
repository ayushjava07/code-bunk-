const user = require('../models/user');
const Category=require('../models/category')
//create tag
exports.Category = async (req, res) => {
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
exports.getCategory = async (req, res) => {
    try {
        const category=await Category.find({},{name:true,description:true});
        if(category){
            return res.status(200).json({
                success:true,
                message:"category fetches successfully",
                category:category
            })
        }
    } catch (error) {
        console.log("error occur while fetching Category:", error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while fetching tag ",
            error
        })
    }
}