import express from "express";
import multer from "multer";
import { 
    registerSkiller, 
    loginSkiller, 
    getSkillerData, 
    updateSkillerState, 
    updateSkillerRating 
} from "../controllers/SkillerController.js";
import {protectSkiller} from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Skiller Routes
router.post('/register', upload.single('profilePicture'), registerSkiller);
router.post('/login', loginSkiller);
router.get('/profile', protectSkiller, getSkillerData);
router.post('/state', protectSkiller, updateSkillerState);
router.post('/rating', protectSkiller, updateSkillerRating);

export default router;
