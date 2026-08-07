import mongoose, { Schema } from "mongoose";
import type { IJobLocation } from "../types/models.js";

const JobLocationSchema = new Schema<IJobLocation>(
  {
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      unique: true,
      index: true,
    },

    source_location: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["resolved", "not_found"],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const JobLocation = mongoose.model<IJobLocation>(
  "JobLocation",
  JobLocationSchema,
);
