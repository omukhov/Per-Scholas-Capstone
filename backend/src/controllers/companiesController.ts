import type { Request, Response } from "express";
import { Company } from "../models/Company.js";

const COMPANIES_PER_PAGE = 50;

export const getCompanies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * COMPANIES_PER_PAGE;
    const search = String(req.query.search || "").trim();

    const filter: Record<string, unknown> = {
      status: true,
    };

    const [companies, totalCompanies] = await Promise.all([
      Company.find()
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(COMPANIES_PER_PAGE)
        .lean(),

      Company.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCompanies / COMPANIES_PER_PAGE);

    res.status(200).json({
      companies,
      pagination: {
        currentPage: page,
        totalPages,
        totalCompanies,
      },
    });
  } catch (error: unknown) {
    console.error("[Companies Controller]:", error);

    res.status(500).json({
      error: "Failed to get companies",
    });
  }
};
