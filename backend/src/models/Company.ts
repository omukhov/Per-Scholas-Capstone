import mongoose, { Schema } from "mongoose";
import type { ICompany } from "../types/models.js";

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    normalized_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    ats_type: {
      type: String,
      required: true,
      enum: ["greenhouse", "lever", "ashby"],
    },

    ats_slug: {
      type: String,
      required: true,
      trim: true,
    },

    ats_url: {
      type: String,
      trim: true,
    },

    seed_source: {
      type: String,
      required: true,
      enum: ["new_grad_positions", "kalil_ats_scrapers", "manual"],
    },

    active: {
      type: Boolean,
      default: true,
    },

    last_scraped_at: {
      type: Date,
      index: true,
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

CompanySchema.index(
  {
    ats_type: 1,
    ats_slug: 1,
  },
  {
    unique: true,
  },
);

CompanySchema.index({
  normalized_name: 1,
  active: 1,
});

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
