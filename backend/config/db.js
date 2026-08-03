import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (e) {
    console.error(e);
  }
}

export default connectDB;
