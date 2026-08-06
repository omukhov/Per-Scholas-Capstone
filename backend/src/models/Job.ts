import mongoose, { Schema } from "mongoose";
import { IJob } from "../types/models.js";

const JobSchema: Schema = new Schema(
  {
    source_job_id: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company_name: {
      type: String,
      required: true,
      trim: true,
    },

    normalized_company_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    location: {
      type: String,
      default: "Remote / USA",
      trim: true,
    },

    country: {
      type: String,
      default: "US",
      trim: true,
      index: true,
    },

    apply_url: {
      type: String,
      required: true,
      trim: true,
    },

    season: {
      type: String,
      trim: true,
      index: true,
    },

    source: {
      type: String,
      required: true,
      enum: [
        "adzuna",
        "jooble",
        "themuse",
        "github_new_grad",
        "github_internships",
        "greenhouse",
        "lever",
        "ashby",
      ],
      index: true,
    },

    job_level: {
      type: String,
      required: true,
      enum: ["junior", "entry_level", "internship"],
      index: true,
    },

    description: {
      type: String,
    },

    posted_at: {
      type: Date,
      index: true,
    },

    is_remote: {
      type: Boolean,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
      index: true,
    },

    last_seen_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  },
);

JobSchema.index(
  {
    source: 1,
    source_job_id: 1,
  },
  {
    unique: true,
  },
);

JobSchema.index({
  status: 1,
  job_level: 1,
  posted_at: -1,
});

export const Job = mongoose.model<IJob>("Job", JobSchema);
