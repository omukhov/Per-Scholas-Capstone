import { ICompany } from "../../types/models.js";
import axios from "axios";
import { IRawAshbyJob, IAshbyResponse } from "../../types/api.js";

const ashby = axios.create({
  baseURL: "https://api.ashbyhq.com/posting-api/job-board",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// Get data from Ashby API
const fetchAshbyJobs = async (company: ICompany): Promise<IRawAshbyJob[]> => {
  try {
    const response = await ashby.get<IAshbyResponse>(`/${company.ats_slug}`);
    return response.data.jobs ?? [];
  } catch (error: unknown) {
    console.error(
      `[Ashby] ${company.name}:`,
      axios.isAxiosError(error)
        ? `${error.response?.status ?? "Network error"} — ${error.message}`
        : error instanceof Error
          ? error.message
          : error,
    );

    return [];
  }
};

export default fetchAshbyJobs;
