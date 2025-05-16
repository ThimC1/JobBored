import Skiller from "../models/Skiller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Register a new Skiller
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

        // Read and store profile picture as binary data
        const profilePicture = {
            data: fs.readFileSync(path.join("uploads", imageFile.filename)),
            contentType: imageFile.mimetype
        };

        const skiller = await Skiller.create({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phoneNumber,
            email,
            nic,
            address,
            profilePicture,
            skills,
            availability,
            radius,
            hourlyRate,
            DayRate,
            FullRate,
            password: hashedPassword,
        });

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

    } catch (error) {
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
