import Company from "../models/Comapany.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary"; // ✅ Correct NPM package
    

// Register a new company
export const registerCompany = async (req, res) => { 

    const { name, email,  password } = req.body;

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({success:false, message: "Missing Details" });
    }
    try {

        const companyExitsts = await Company.findOne({ email })
        if (companyExitsts) {
            return res.json({success:false, message: "Company already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            image: imageUpload.secure_url,
            password: hashedPassword,
        });
        
    } catch (error) {
        
    }

  }

// Company login
export const loginCompany = async (req, res) => {   }

// Get company data
export const getCompanyData = async (req, res) => {   }

//Post a new job
export const postJob = async (req, res) => {   }

//Get Company JOb applicants
export const getJobApplicants = async (req, res) => {   }

//Get Company posted Jobs
export const getPostedJobs = async (req, res) => {   }

//Change Job Application Status
export const changeJobApplicationsStatus = async (req, res) => {   }

//Change Job Visibility
export const ChangeJobVisibility = async (req, res) => {   }