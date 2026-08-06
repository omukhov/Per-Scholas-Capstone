import type { JobsResponse } from "../types/pages";

const API_URL = import.meta.env.VITE_API_URL;

export const getJobs = async (page = 1, search = ""): Promise<JobsResponse> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      search,
    });

    const response = await fetch(`${API_URL}/jobs?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to load jobs: ${response.status}`);
    }

    const data: JobsResponse = await response.json();

    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
