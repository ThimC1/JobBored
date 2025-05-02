import Company from "../models/Comapany.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary"; // ✅ Correct NPM package
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
    

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
            password: hashedPassword,
            image: imageUpload.secure_url,
            
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id),
        })
        
    } catch (error) {
        res.json({success:false, message: error.message });
    }

  }

// Company login
export const loginCompany = async (req, res) => { 
    const { email, password } = req.body;

    try{
         const company = await Company.findOne({ email });
         if (company && bcrypt.compareSync(password, company.password)) {
             res.json({
                 success: true,
                 company: {
                     _id: company._id,
                     name: company.name,
                     email: company.email,
                     image: company.image,
                 },
                 token: generateToken(company._id),
             });
         } else {
             res.json({ success: false, message: "Invalid email or password" });
         }
     } catch (error) {
         res.json({ success: false, message: error.message });
     }
  }

// Get company data
export const getCompanyData = async (req, res) => { 

    const company = req.company

    try {

        const company = req.company

        res.json({success:true, company})
        
    } catch (error) {
        res.json({success:false, message: error.message });
    }

  }

//Post a new job
export const postJob = async (req, res) => { 

    const { title, description,location, salary, level,category} = req.body;

    const companyId = req.company._id;

    try {

        const newJOb =  new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJOb.save()
        res.json({success:true,newJOb})
        
    } catch (error) {
        res.json({success:false, message: error.message });
    }
     
  }

//Get Company JOb applicants
export const getJobApplicants = async (req, res) => {   }

//Get Company posted Jobs
export const getPostedJobs = async (req, res) => { 
    try {
        const companyId = req.company._id

        const jobs = await Job.find({companyId})

        res.json({success:true, jobs})
        
    } catch (error) {
        res.json({success:false, message: error.message });
    }

  }

//Change Job Application Status
export const changeJobApplicationsStatus = async (req, res) => {   }

//Change Job Visibility
export const ChangeJobVisibility = async (req, res) => {  
    try {
        const {id} = req.body
        
        const companyId = req.company._id

        const job = await Job.findById(id)
        if (companyId.toString() !== job.companyId.toString()) {
            job.visible = !job.visible
           
        }
        await job.save()

        res.json({success:true, job})

    } catch (error) {

        res.json({success:false, message: error.message });
        
    }
 }