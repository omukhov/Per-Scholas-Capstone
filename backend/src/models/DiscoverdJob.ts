// models/DiscoveredJob.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IDiscoveredJob extends Document {
  company_name: string;
  normalized_company_name: string;
  title: string;
  redirect_url: string;
  source: "adzuna" | "jooble" | "themuse";
  source_job_id?: string;
  location?: string;
  publication_date?: Date;
  status: "pending_ats_resolution" | "resolved" | "failed";
  created_at: Date;
}

const DiscoveredJobSchema: Schema = new Schema({
  company_name: { type: String, required: true },
  normalized_company_name: { type: String, required: true, index: true },
  title: { type: String, required: true },
  redirect_url: { type: String, required: true, unique: true },
  source: {
    type: String,
    required: true,
    enum: ["adzuna", "jooble", "themuse"],
  },
  source_job_id: { type: String },
  location: { type: String, default: "USA" },
  publication_date: { type: Date },
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
