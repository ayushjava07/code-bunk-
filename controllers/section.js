const Section = require('../models/section');
const Course = require('../models/course')


exports.createSection = async (req, res) => {
    const { SectionTitle, CourseId } = req.body;
    try {
        if (!SectionTitle || !CourseId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const isCourse = await Course.findById(CourseId);
        if (!isCourse) {
            return res.status(404).json({
                success: false,
                message: "unable to find the course try to upload the course first "
            })
        }

        const createSection = await Section.create({
            SectionTitle,
            courseId: CourseId
        }, { new: true })
        const SectionInCourse = await Course.findById(CourseId, { $push: { courseContent: createSection._id } }, { new: true });
        const course = await Course.findById({ CourseId }).populate({
            path: "courseContent",
            populate: {
                path: "Subsection"
            }
        })
        if (SectionInCourse) {
            res.status(200).json({
                success: true,
                message: "section addded in course successfully",
                course: course
            })
        }
    } catch (error) {
        console.log("something went wrong while adding section:", error.message);
        res.status(500).json({
            success: false,
            message: "something went wrong while adding section try again later",
            error: error.message
        })
    }
}
exports.updateSection = async (req, res) => {
    try {
        const { SectionId, SectionTitle } = req.body;
        if (!SectionId || !SectionTitle) {
            return res.status(400).json({
                success: false,
                message: "all fields are required!"
            })
        }
        const isSection = await Section.findByIdAndUpdate(SectionId, { SectionTitle }, { new: true });
        if (isSection) {
            return res.status(200).json({
                success: true,
                message: "section updated successfully",
                section: isSection
            })
        }
    } catch (error) {
        console.log("something went wrong while updating section :",error.message);
        res.status(500).json({
            success:false,
            message:"something went wrong while updating the section",
            error:error.message
        })
    }
}
exports.deleteSection=async (req,res)=>{
    try{
            const{sectionId}=req.body;
    if(!sectionId){
        return res.status(400).json({
            success:false,
            message:"all fields are required!"
        })
    }
    const deleteSection=await Section.deleteOne({_id:sectionId});
    //hw we need to delete this from our course also aur jaha jaha ref diya hua hai
    if(deleteSection){
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
        })
    }
    }
    catch(error){
        console.log("something went wrong while deleting the section:",error.message);
        return res.status(500).json({
            success:false,
            message:"something went wrong while deleting the section ",
            error:error.message
        })
    }
}