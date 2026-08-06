import type { Job, JobsResponse } from "../types/job";

const API_URL = import.meta.env.VITE_API_URL;

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(`${API_URL}/api/jobs`);

    if (!response.ok) {
      throw new Error(`Failed to load jobs: ${response.status}`);
    }

    const data: JobsResponse = await response.json();

    return data.jobs;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
