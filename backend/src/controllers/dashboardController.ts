import type { Request, Response } from "express";
import { Job } from "../models/Job.js";

export const getDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const activeFilter = {
      status: "active",
    } as const;

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - 14);

    const [
      totalJobs,
      companies,
      remoteJobs,
      internships,
      jobsBySource,
      jobsByLevel,
      jobsByDay,
    ] = await Promise.all([
      Job.countDocuments(activeFilter),

      Job.distinct("normalized_company_name", activeFilter),

      Job.countDocuments({
        ...activeFilter,
        is_remote: true,
      }),

      Job.countDocuments({
        ...activeFilter,
        job_level: "internship",
      }),

      // Jobs by source
      Job.aggregate([
        {
          $match: activeFilter,
        },
        {
          $group: {
            _id: "$source",
            value: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },
        {
          $sort: {
            value: -1,
          },
        },
      ]),

      // Jobs by level
      Job.aggregate([
        {
          $match: activeFilter,
        },
        {
          $group: {
            _id: "$job_level",
            value: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },
        {
          $sort: {
            value: -1,
          },
        },
      ]),

      // Jobs added during last 14 days
      Job.aggregate([
        {
          $match: {
            ...activeFilter,
            created_at: {
              $gte: startDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$created_at",
              },
            },
            jobs: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            jobs: 1,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      summary: {
        totalJobs,
        totalCompanies: companies.length,
        remoteJobs,
        internships,
      },
      jobsBySource,
      jobsByLevel,
      jobsByDay,
    });
  } catch (error) {
    console.error("[Dashboard Controller]:", error);

    res.status(500).json({
      error: "Failed to get dashboard data",
    });
  }
};
