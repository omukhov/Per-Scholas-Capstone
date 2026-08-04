import axios from "axios";

const museClient = axios.create({
  baseURL: "https://www.themuse.com/api/public",
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json",
  },
});

interface MuseJob {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
  };
  refs: {
    landing_page: string;
  };
  publication_date: string;
  levels: Array<{ name: string }>;
  locations: Array<{ name: string }>;
}

interface MuseApiResponse {
  page: number;
  page_count: number;
  results: MuseJob[];
}

const discoverJobsFromMuse = async (page = 0) => {
  try {
    const response = await museClient.get<MuseApiResponse>("/jobs", {
      params: {
        category: "Software Engineering",
        level: "Entry Level",
        page: page,
      },
    });

    const rawJobs = response.data.results || [];

    return rawJobs.map((job) => ({
      source: "themuse" as const,
      company_name: job.company.name,
      title: job.name,
      redirect_url: job.refs.landing_page,
      publication_date: job.publication_date,
      location: job.locations.map((l) => l.name).join(", ") || "USA",
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "[The Muse API Error]:",
        error.response?.status,
        error.message,
      );
    } else {
      console.error("[The Muse API Error]:", error);
    }
    return [];
  }
};

export default discoverJobsFromMuse;
