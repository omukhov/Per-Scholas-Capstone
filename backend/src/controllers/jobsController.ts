import type { Request, Response } from "express";
import { Job } from "../models/Job.js";

const JOBS_PER_PAGE = 50;

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * JOBS_PER_PAGE;
    const level = String(req.query.level || "");
    const search = String(req.query.search || "").trim();
    const remote = String(req.query.remote || "");

    const filter: Record<string, unknown> = {
      status: "active",
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company_name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (level) {
      filter.job_level = level;
    }

    if (remote === "true") {
      filter.is_remote = true;
    }

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .sort({ posted_at: -1, created_at: -1 })
        .skip(skip)
        .limit(JOBS_PER_PAGE)
        .lean(),

      Job.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);

    res.status(200).json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalJobs / JOBS_PER_PAGE),
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
