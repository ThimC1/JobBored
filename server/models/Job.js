import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skillsRequired: {
      type: [String], // Array of skill names
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skiller", // or "User" if companies can post jobs too
      required: true,
    },
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    DayRate: {
      type: Number,
      default: 0,
    },
    FullRate: {
      type: Number,
      default: 0,
    },
    availability: {
      type: Object, // Or further define structure if needed
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or "Skiller" if skillers apply to jobs
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
