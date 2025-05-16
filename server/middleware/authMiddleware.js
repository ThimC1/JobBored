import jwt from "jsonwebtoken";
import Company from "../models/Comapany.js";
import Skiller from "../models/Skiller.js";

// Company Protection Middleware
export const protectCompany = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.company = await Company.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Token, Authorization Failed" });
    }
};

// Skiller Protection Middleware
export const protectSkiller = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.skiller = await Skiller.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid Token, Authorization Failed" });
    }
};
