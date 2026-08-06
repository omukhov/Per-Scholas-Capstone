import { IParsedAts } from "../types/utils.js";

const cleanSlug = (value: string | undefined): string | null => {
  if (!value) return null;

  const slug = decodeURIComponent(value)
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!slug || slug === "jobs" || slug === "job") return null;

  return slug;
};

export const parseAtsUrl = (rawUrl: string): IParsedAts | null => {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split("/").filter(Boolean);

    // ==============================
    // Greenhouse
    // ==============================
    if (
      host === "boards.greenhouse.io" ||
      host === "job-boards.greenhouse.io" ||
      host === "boards.eu.greenhouse.io" ||
      host === "job-boards.eu.greenhouse.io"
    ) {
      const slug = cleanSlug(parts[0]);

      if (slug) {
        const jobsIndex = parts.indexOf("jobs");

        return {
          atsType: "greenhouse",
          atsSlug: slug,
          jobId: jobsIndex >= 0 ? parts[jobsIndex + 1] : undefined,
        };
      }
    }

    // ==============================
    // Lever
    // ==============================
    if (host === "jobs.lever.co" || host === "jobs.eu.lever.co") {
      const slug = cleanSlug(parts[0]);

      if (slug) {
        return {
          atsType: "lever",
          atsSlug: slug,
          jobId: parts[1],
        };
      }
    }

    // ==============================
    // Ashby
    // ==============================
    if (host === "jobs.ashbyhq.com") {
      const slug = cleanSlug(parts[0]);

      if (slug) {
        return {
          atsType: "ashby",
          atsSlug: slug,
          jobId: parts[1],
        };
      }
    }

    /*
     * Sometimes ATS URL inside query parameter:
     * ?url=https://jobs.lever.co/company/...
     * ?redirect=https%3A%2F%2Fboards.greenhouse.io%2F...
     */
    const redirectParams = [
      "url",
      "redirect",
      "redirect_url",
      "target",
      "destination",
      "apply_url",
    ];

    for (const parameter of redirectParams) {
      const nestedUrl = url.searchParams.get(parameter);

      if (nestedUrl?.startsWith("http")) {
        const nestedResult = parseAtsUrl(nestedUrl);
        if (nestedResult) return nestedResult;
      }
    }

    return null;
  } catch {
    return null;
  }
};
