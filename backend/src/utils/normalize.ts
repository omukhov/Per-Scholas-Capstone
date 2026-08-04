import {
  RawAdzunaJob,
  RawJoobleJob,
  RawMuseJob,
  UnifiedJobInput,
} from "../types/api.js";

export const cleanCompanyName = (name?: string): string => {
  if (!name) return "unknown";
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\b(inc|llc|corp|corporation|ltd|co|group)\b/gi, "")
    .trim();
};

// Strict Adzuna Normalizer
export const normalizeAdzuna = (rawJob: RawAdzunaJob): UnifiedJobInput => {
  const company = rawJob.company?.display_name || "Unknown company";

  return {
    company_name: company,
    normalized_company_name: cleanCompanyName(company),
    title: rawJob.title ? rawJob.title.replace(/<\/?[^>]+(>|$)/g, "") : "",
    redirect_url: rawJob.redirect_url,
    source: "adzuna",
    source_job_id: String(rawJob.id),
    location: rawJob.location?.display_name || "USA",
    publication_date: rawJob.created ? new Date(rawJob.created) : new Date(),
  };
};

// Strict Jooble Normalizer
export const normalizeJooble = (rawJob: RawJoobleJob): UnifiedJobInput => {
  const company = rawJob.company || "Unknown company";

  return {
    company_name: company,
    normalized_company_name: cleanCompanyName(company),
    title: rawJob.title ? rawJob.title.replace(/<\/?[^>]+(>|$)/g, "") : "",
    redirect_url: rawJob.link,
    source: "jooble",
    source_job_id: rawJob.id ? String(rawJob.id) : undefined,
    location: rawJob.location || "USA",
    publication_date: rawJob.updated ? new Date(rawJob.updated) : new Date(),
  };
};

// Strict Muse Normalizer
export const normalizeMuse = (rawJob: RawMuseJob): UnifiedJobInput => {
  const company = rawJob.company?.name || "Unknown company";

  return {
    company_name: company,
    normalized_company_name: cleanCompanyName(company),
    title: rawJob.name || "",
    redirect_url: rawJob.refs?.landing_page,
    source: "themuse",
    source_job_id: String(rawJob.id),
    location: rawJob.locations?.map((l) => l.name).join(", ") || "USA",
    publication_date: rawJob.publication_date
      ? new Date(rawJob.publication_date)
      : new Date(),
  };
};

export const detectAtsType = (
  url: string,
): "greenhouse" | "lever" | "ashby" | "workable" | "other" => {
  if (url.includes("greenhouse.io")) return "greenhouse";
  if (url.includes("lever.co")) return "lever";
  if (url.includes("ashbyhq.com")) return "ashby";
  if (url.includes("workable.com")) return "workable";
  return "other";
};
