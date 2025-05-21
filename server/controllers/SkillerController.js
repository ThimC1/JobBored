import Skiller from "../models/Skiller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";

// Register a new Skiller and create a Job
export const registerSkiller = async (req, res) => {
    const { firstName, lastName, dateOfBirth, gender, phoneNumber, email, nic, address, skills, availability, radius, hourlyRate, DayRate, FullRate, password } = req.body;
    const imageFile = req.file;

    if (!firstName || !lastName || !phoneNumber || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const skillerExists = await Skiller.findOne({ phoneNumber });
        if (skillerExists) {
            return res.json({ success: false, message: "Skiller already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload profile picture to Cloudinary
        const profilePictureUpload = await cloudinary.uploader.upload(imageFile.path, {
            folder: 'skillers',
            resource_type: 'auto'
        });

        // Parse skills from JSON string
        const parsedSkills = JSON.parse(skills);

        const skiller = await Skiller.create({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phoneNumber,
            email,
            nic,
            address: JSON.parse(address),
            profilePicture: profilePictureUpload.secure_url,
            skills: parsedSkills,
            availability: JSON.parse(availability),
            radius,
            hourlyRate,
            DayRate,
            FullRate,
            password: hashedPassword,
        });

        // 2. Create a Job post for the new Skiller
        const job = await Job.create({
            title: `Service by ${firstName} ${lastName}`,
            description: `Auto-created job post for ${firstName} ${lastName}.`,
            skillsRequired: parsedSkills,
            postedBy: skiller._id, // or whatever field links Job to Skiller
            hourlyRate,
            DayRate,
            FullRate,
            location: JSON.parse(address), // or adapt as needed
            availability: JSON.parse(availability),
            // Add more fields as per your Job model
        });

        // Delete the temporary file after upload
        fs.unlinkSync(imageFile.path);

        res.json({
            success: true,
            skiller: {
                _id: skiller._id,
                firstName: skiller.firstName,
                lastName: skiller.lastName,
                phoneNumber: skiller.phoneNumber,
                email: skiller.email,
            },
            job: {
                _id: job._id,
                title: job.title,
                skillsRequired: job.skillsRequired,
            },
            token: generateToken(skiller._id),
        });

    } catch (error) {
        // Delete the temporary file if it exists and there's an error
        if (imageFile && imageFile.path) {
            fs.unlinkSync(imageFile.path);
        }
        res.json({ success: false, message: error.message });
    }
};

// Login Skiller
export const loginSkiller = async (req, res) => {
    const { email, password } = req.body;

    try {
        const skiller = await Skiller.findOne({ email });
        if (!skiller) {
            return res.json({ success: false, message: "Skiller not found" });
        }

        if (await bcrypt.compare(password, skiller.password)) {
            res.json({
                success: true,
                skiller: {
                    _id: skiller._id,
                    firstName: skiller.firstName,
                    lastName: skiller.lastName,
                    phoneNumber: skiller.phoneNumber,
                    email: skiller.email,
                },
                token: generateToken(skiller._id),
            });
        } else {
            res.json({ success: false, message: "Invalid phone number or password" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Skiller Data
export const getSkillerData = async (req, res) => {
    try {
        const skiller = await Skiller.findById(req.skiller._id).select("-password");
        res.json({ success: true, skiller });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Skiller State (Available, Busy, Offline)
export const updateSkillerState = async (req, res) => {
    const { state } = req.body;

    try {
        const skiller = await Skiller.findById(req.user._id);
        if (!skiller) {
            return res.json({ success: false, message: "Skiller not found" });
        }

        skiller.state = state;
        await skiller.save();

        res.json({ success: true, skiller });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Skiller Rating after Job Completion
export const updateSkillerRating = async (req, res) => {
    const { rating } = req.body;

    try {
        const skiller = await Skiller.findById(req.user._id);
        if (!skiller) {
            return res.json({ success: false, message: "Skiller not found" });
        }

        // Calculate new rating (average)
        skiller.rating = ((skiller.rating * skiller.completedJobs) + rating) / (skiller.completedJobs + 1);
        skiller.completedJobs += 1;
        await skiller.save();

        res.json({ success: true, skiller });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Utility function to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
