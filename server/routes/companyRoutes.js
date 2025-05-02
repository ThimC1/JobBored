import express from 'express';  
import { changeJobApplicationsStatus, ChangeJobVisibility, getCompanyData, getJobApplicants, getPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();    

//Register a Company
router.post('/register',upload.single('image'), registerCompany);

//Company Login
router.post('/login', loginCompany);

//Get Company Data
router.get('/company', protectCompany, getCompanyData);

//Post a job
router.post('/post-job', protectCompany, postJob);

//Get Applicants Data of Company
router.get('/applicants', protectCompany, getJobApplicants);

//Get Company Job List
router.get('/list-jobs',protectCompany, getPostedJobs);

//Change Job Application Status
router.post('/change-status',protectCompany, changeJobApplicationsStatus);

//Change Applications Visibility
router.post('/change-visibility',protectCompany, ChangeJobVisibility);

export default router;  