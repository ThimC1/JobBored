import express from 'express';  
import { changeJobApplicationsStatus, ChangeJobVisibility, getCompanyData, getJobApplicants, getPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js';
import upload from '../config/multer.js';

const router = express.Router();    

//Register a Company
router.post('/register',upload.single('image'), registerCompany);

//Company Login
router.post('/login', loginCompany);

//Get Company Data
router.get('/company', getCompanyData);

//Post a job
router.post('/post-job', postJob);

//Get Applicants Data of Company
router.get('/applicants', getJobApplicants);

//Get Company Job List
router.get('/list-jobs', getPostedJobs);

//Change Job Application Status
router.post('/change-status', changeJobApplicationsStatus);

//Change Applications Visibility
router.post('/change-visibility', ChangeJobVisibility);

export default router;  