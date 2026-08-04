import axios from "axios";
import { RawMuseJob } from "../types/api.js";

const museClient = axios.create({
  baseURL: "https://www.themuse.com/api/public",
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json",
  },
});

const discoverCompaniesFromMuse = async (page = 0): Promise<RawMuseJob[]> => {
  try {
    const response = await museClient.get("/jobs", {
      params: {
        category: "Software Engineering",
        level: "Entry Level",
        page: page,
      },
    });

    return response.data.results || [];
  } catch (error: unknown) {
    console.error("[The Muse API Error]:", error);
    return [];
  }
};

export default discoverCompaniesFromMuse;
