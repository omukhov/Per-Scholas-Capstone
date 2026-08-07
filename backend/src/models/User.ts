import mongoose, { Schema } from "mongoose";
import type { IUser } from "../types/models.js";

const UserSchema = new Schema<IUser>(
  {
    google_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    picture: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
