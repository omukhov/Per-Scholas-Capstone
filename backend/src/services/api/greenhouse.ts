import axios from "axios";
import { ICompany } from "../../types/models.js";
import type {
  IGreenhouseJobsResponse,
  IRawGreenhouseJob,
} from "../../types/api.js";

const greenhouse = axios.create({
  baseURL: "https://boards-api.greenhouse.io/v1/boards",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

const fetchGreenhouseJobs = async (
  company: ICompany,
): Promise<IRawGreenhouseJob[]> => {
  try {
    const response = await greenhouse.get<IGreenhouseJobsResponse>(
      `/${company.ats_slug}/jobs`,
      {
        params: {
          content: true,
        },
      },
    );
    return response.data.jobs ?? [];
  } catch (error: unknown) {
    console.error(
      `[Greenhouse] ${company.name}:`,
      axios.isAxiosError(error)
        ? `${error.response?.status ?? "Network error"} — ${error.message}`
        : error instanceof Error
          ? error.message
          : error,
    );

    return [];
  }
};

export default fetchGreenhouseJobs;
