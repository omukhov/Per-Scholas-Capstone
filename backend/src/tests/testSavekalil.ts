import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { Company } from "../models/Company.js";

import runKalilImport from "../services/kalilRunner.js";

const importAllKalil = async (): Promise<void> => {
  try {
    await connectDB();

    await runKalilImport();

    const totalCompanies = await Company.countDocuments();

    console.log(`[Kalil Import] Total companies: ${totalCompanies}`);
  } catch (error: unknown) {
    console.error(
      "[Kalil Import] Failed:",
      error instanceof Error ? error.message : error,
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void importAllKalil();
