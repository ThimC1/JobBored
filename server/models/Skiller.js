import mongoose from 'mongoose';

const SkillerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  nic: { type: String, unique: true },
  address: {
    street: { type: String },
    city: { type: String },
    province: { type: String },
  },
  profilePicture: { type: String }, // Cloudinary URL here
  skills: [{
    skillName: { type: String, required: true },
    specificSkills: { type: String },
    yearsOfExperience: { type: Number, required: true },
    certification: { type: String },
    description: { type: String } // Fixed typo here
  }],
  availability: {
    days: [{ type: String }], // Example: ['Monday', 'Wednesday']
    timeSlots: [{ type: String }] // Example: ['09:00 - 17:00']
  },
  radius: { type: Number, default: 10 },
  hourlyRate: { type: Number },
  dayRate: { type: Number },
  fullRate: { type: Number },
  state: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
  rating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  declinedJobs: { type: Number, default: 0 },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Skiller', SkillerSchema);
