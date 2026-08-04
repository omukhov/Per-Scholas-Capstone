// models/Internship.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IInternship extends Document {
  company_name: string;
  normalized_company_name: string;
  title: string;
  redirect_url: string;
  source: string;
  ats_type?: "greenhouse" | "lever" | "ashby" | "workable" | "other";
  location?: string;
  season?: string; // e.g., "Summer 2027"
  status: "active" | "closed";
  created_at: Date;
}

const InternshipSchema: Schema = new Schema({
  company_name: { type: String, required: true },
  normalized_company_name: { type: String, required: true, index: true },
  title: { type: String, required: true },
  redirect_url: { type: String, required: true, unique: true },
  source: { type: String, default: "github_simplify" },
  ats_type: { type: String },
  location: { type: String, default: "USA" },
  season: { type: String, default: "Summer 2027" },
  status: { type: String, enum: ["active", "closed"], default: "active" },
  created_at: { type: Date, default: Date.now },
});

export const Internship = mongoose.model<IInternship>(
  "Internship",
  InternshipSchema,
);
