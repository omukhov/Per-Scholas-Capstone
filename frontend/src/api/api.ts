const API_URL = import.meta.env.VITE_API_URL;

export const getJobs = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      search,
    });

    const response = await fetch(`${API_URL}/jobs?${params}`);

    if (!response.ok) {
      throw new Error("Failed to load jobs");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
