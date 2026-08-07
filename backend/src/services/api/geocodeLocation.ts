import axios from "axios";
import type { INominatimResult, IGeocodedLocation } from "../../types/api.js";

const nominatim = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

// Get coordinates from location name for map in vacancies
export const geocodeLocation = async (
  location: string,
): Promise<IGeocodedLocation | null> => {
  const normalizedLocation = location.trim();

  if (!normalizedLocation) {
    return null;
  }

  /*
   * Remote vacancies don't have exact coordinates.
   */
  if (normalizedLocation.toLowerCase().startsWith("remote")) {
    return null;
  }

  try {
    const contactEmail = process.env.CONTACT_EMAIL;

    const response = await nominatim.get<INominatimResult[]>("/search", {
      params: {
        q: `${normalizedLocation}, USA`,
        format: "jsonv2",
        limit: 1,
        countrycodes: "us",
      },

      headers: {
        "User-Agent": contactEmail
          ? `JobMarketAnalytics/1.0 (${contactEmail})`
          : "JobMarketAnalytics/1.0",
      },
    });

    const result = response.data[0];

    if (!result) {
      console.log(`[Geocoding] Location not found: ${location}`);

      return null;
    }

    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return null;
    }

    return {
      latitude,
      longitude,
    };
  } catch (error: unknown) {
    console.error(
      `[Geocoding] Failed for ${location}:`,
      axios.isAxiosError(error)
        ? `${error.response?.status ?? "Network error"} — ${error.message}`
        : error instanceof Error
          ? error.message
          : error,
    );

    return null;
  }
};
