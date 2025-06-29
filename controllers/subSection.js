const SubSection = require('../models/subSection');
const Section = require('../models/section');
const { uploadImage } = require('../utils/imageUploader');
require('dotenv').config()
exports.CreateSubSection = async (req, res) => {
    try {
        const { title, description, timeDuration, SectionId } = req.body;
        const { videoFile } = req.file;
        if (!title || !description || !timeDuration || !SectionId || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const isSection = await Section.findById(SectionId);
        if (!isSection) {
            return res.status(300).json({
                success: false,
                message: "section not exist"
            })
        }
        const videoUrl = await uploadImage(videoFile, process.env.FOLDER_NAME);
        const createSubSection = await SubSection.create({
            title, description, videoUrl, timeDuration
        }, { new: true });
        isSection.subSections.push(createSubSection._id);
        await isSection.save();
        if (createSubSection) {
            const section = await Section.findById(SectionId).populate("subsections").exec();
            return res.status(200).json({
                success: true,
                message: "sub section created successfully",
                subsection: createSubSection,
                section
            })
        }
    } catch (error) {
        console.log("unable to add subsection : ", error.message);
        return res.status(500).json({
            success: false,
            message: "unable to create sub section try again later",
            error: error.message
        })
    }
}
exports.updateSubsection = async (req, res) => {
    const { title, description, timeDuration, SectionId, SubSectionId } = req.body;
    const { videoFile } = req.file;
    const videoUrl = await uploadImage(videoFile, process.env.FOLDER_NAME);
    const UpdateSubsection = await SubSection.findByIdAndUpdate(
        SubSectionId, { title, description, timeDuration, videoUrl }, { new: true }
    );
    if (SubSectionId) {
        const section = await Section.findById(SectionId).populate("subSections").exec();
        return res.status(200).json({
            success: true,
            message: "sub section updated successfully",
            subsection: UpdateSubsection,
            section
        })
    }
}
exports.deleteSubsection = async (req, res) => {
    const { SectionId, SubSectionId } = req.body;
    const DeleteSubsection = await SubSection.findByIdAndDelete(SubSectionId);
    if (!DeleteSubsection) {
        return res.status(404).json({
            success: false,
            message: "sub section not found"
        })
    }
    const section = await Section.findById(SectionId);
    if (!section) {
        return res.status(404).json({
            success: false,
            message: "section not found"
        })
    }
    const deletesubsection = section.subSections.filter((id) => id.toString() !== SubSectionId);
    await section.save();
    const updatedSection = await Section.findById(SectionId).populate("subSections");
    return res.status(200).json({
        success: true,
        message: "sub section updated successfully",
        subsection: deletesubsection,
        section:updatedSection
    })
}