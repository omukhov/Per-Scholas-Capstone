import type { IJobsResponse } from "../types/pages";

const API_URL = import.meta.env.VITE_API_URL;

export const getJobs = async (
  page = 1,
  search = "",
  internshipOnly = false,
  remoteOnly = false,
): Promise<IJobsResponse> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      search,
    });

    if (internshipOnly) {
      params.set("level", "internship");
    }

    if (remoteOnly) {
      params.set("remote", "true");
    }

    const response = await fetch(`${API_URL}/jobs?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to load jobs: ${response.status}`);
    }

    const data: IJobsResponse = await response.json();

    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
