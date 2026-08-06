import type { Request, Response } from "express";
import { Job } from "../models/Job.js";

const JOBS_PER_PAGE = 50;

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * JOBS_PER_PAGE;

    const search = String(req.query.search || "").trim();

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: escapedSearch, $options: "i" } },
            {
              company_name: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              location: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              description: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const filter = {
      status: "active" as const,
      ...searchFilter,
    };

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .sort({ posted_at: -1, created_at: -1 })
        .skip(skip)
        .limit(JOBS_PER_PAGE)
        .lean(),

      Job.countDocuments({ status: "active" }),
    ]);

    const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
      },
    });
  } catch (error: unknown) {
    console.error("[Vacancies Controller]:", error);

    res.status(500).json({
      error: "Failed to get vacancies",
    });
  }
};
