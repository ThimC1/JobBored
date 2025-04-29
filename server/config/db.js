import mongoose from "mongoose";

// Funtion to connect to MongoDB
const connectDB = async () => {
    mongoose.connection.on('connected', ()=>console.log('Database connected'));

    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
}

export default connectDB;