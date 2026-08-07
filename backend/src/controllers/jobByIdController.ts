import type { Request, Response } from "express";
import { Job } from "../models/Job.js";
import { JobLocation } from "../models/JobLocation.js";
import { geocodeLocation } from "../services/api/geocodeLocation.js";

export const getJobById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      res.status(404).json({
        error: "Job not found",
      });

      return;
    }

    /*
     * Check if coordinates are already cached.
     */
    let jobLocation = await JobLocation.findOne({
      job_id: job._id,
    }).lean();

    /*
     * Call Nominatim only if coordinates
     * have not been requested before.
     */
    if (!jobLocation) {
      const coordinates = await geocodeLocation(job.location);

      const locationData = coordinates
        ? {
            job_id: job._id,
            source_location: job.location,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            status: "resolved" as const,
          }
        : {
            job_id: job._id,
            source_location: job.location,
            status: "not_found" as const,
          };

      jobLocation = await JobLocation.findOneAndUpdate(
        {
          job_id: job._id,
        },
        {
          $setOnInsert: locationData,
        },
        {
          upsert: true,
          new: true,
        },
      ).lean();
    }

    const coordinates =
      jobLocation?.status === "resolved" &&
      typeof jobLocation.latitude === "number" &&
      typeof jobLocation.longitude === "number"
        ? {
            latitude: jobLocation.latitude,
            longitude: jobLocation.longitude,
          }
        : null;

    res.status(200).json({
      job,
      coordinates,
    });
  } catch (error: unknown) {
    console.error("[Job Details Controller]:", error);

    res.status(500).json({
      error: "Failed to get job details",
    });
  }
};
