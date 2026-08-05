// models/DiscoveredJob.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IDiscoveredJob extends Document {
  company_name: string;
  normalized_company_name: string;
  redirect_url: string;
  source: "adzuna" | "jooble" | "themuse";
  status: "pending_ats_resolution" | "resolved" | "failed";
  created_at: Date;
}

const DiscoveredJobSchema: Schema = new Schema({
  company_name: { type: String, required: true },
  normalized_company_name: { type: String, required: true, index: true },
  redirect_url: { type: String, required: true, unique: true },
  source: {
    type: String,
    required: true,
    enum: ["adzuna", "jooble", "themuse"],
  },
  status: {
    type: String,
    enum: ["pending_ats_resolution", "resolved", "failed"],
    default: "pending_ats_resolution",
  },
  created_at: { type: Date, default: Date.now },
});

export const DiscoveredJob = mongoose.model<IDiscoveredJob>(
  "DiscoveredJob",
  DiscoveredJobSchema,
);
