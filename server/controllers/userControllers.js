import JobApplication from "../models/JobApplication.js"
import {v2 as cloudinary} from "cloudinary"
import User from "../models/User.js"
import upload from "../config/multer.js"

//Get user data
export const getUserData = async (req, res) => {
    const userId = req.auth.userId

    try {
        const user = await User.findById(userId)

        if (!user){
            return res.json({success:false, message:"User not found"})
        }
        res.json({success:true,user})
    } catch (error) {
        res.json({success:false, message:error.message})
    }

}

//Apply for a job
export const applyForJob = async (req, res) => {

    const { jobId } = req.body 
    
    const userId = req.auth.userId
    
    try {

        const isAlreadyApplied = await JobApplication.findOne({userId, jobId})

        if (isAlreadyApplied>0 ) {
            return res.json({success:false, message:"You have already applied for this job"})
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({success:false, message:"Job not found"})
        }

        await JobApplication.create({
            companyId,userId, jobId,date:Date.now()})

        res.json({success:true, message:"You have successfully applied for this job"})
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//Get user applied applications
export const getUserJobApplications = async (req, res) => {

    try {
        const userId = req.auth.userId  
        const application = await JobApplication.find({userId})
        .populate('jobId','title description location category  level salary')
        .exec()

        if (!application) {
            return res.json({success:false, message:"No applications found"})
        }

        return res.json({success:true, application})

    } catch (error) {
        res.json({success:false, message:error.message})
    }

}

// update user profile (resume)
export const updateUserResume = async (req, res) => {
    try {

        const userId = req.auth.userId
        const resumeFile = req.resumeFile

        const userData = await User.findById(userId)

        if (resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({success:true, message:'Resume Updated'})
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}