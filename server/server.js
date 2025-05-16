import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import { clerkWebhook } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillerRoutes from '../server/routes/SkillerRoutes.js'; // ✅ Skiller Routes Imported
import { clerkMiddleware } from '@clerk/express';
import path from 'path';
import fs from 'fs';

// Initialize express app
const app = express();

// Database connection
await connectDB();
await connectCloudinary();

// Ensure "uploads" folder exists
const uploadsFolder = path.join('uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(uploadsFolder)));

// Routes
app.get('/', (req, res) => res.send("API Working!"));
app.post('/webhooks', clerkWebhook);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);
app.use('/api/skillers', skillerRoutes); // ✅ Skiller Routes

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
