import { ICompany } from "../../types/models.js";
import axios from "axios";
import { IRawLeverJob } from "../../types/api.js";

const lever = axios.create({
  baseURL: "https://api.lever.co/v0/postings",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// Get jobs from Lever API
const fetchLeverJobs = async (company: ICompany): Promise<IRawLeverJob[]> => {
  try {
    const response = await lever.get<IRawLeverJob[]>(`/${company.ats_slug}`, {
      params: {
        mode: "json",
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: unknown) {
    console.error(
      `[Lever] ${company.name}:`,
      axios.isAxiosError(error)
        ? `${error.response?.status ?? "Network error"} — ${error.message}`
        : error instanceof Error
          ? error.message
          : error,
    );

    return [];
  }
};

export default fetchLeverJobs;
