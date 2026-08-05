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
    redirect_url: rawJob.redirect_url,
    source: "adzuna",
  };
};

// Strict Jooble Normalizer
export const normalizeJooble = (rawJob: RawJoobleJob): UnifiedJobInput => {
  const company = rawJob.company || "Unknown company";

  return {
    company_name: company,
    normalized_company_name: cleanCompanyName(company),
    redirect_url: rawJob.link,
    source: "jooble",
  };
};

// Strict Muse Normalizer
export const normalizeMuse = (rawJob: RawMuseJob): UnifiedJobInput => {
  const company = rawJob.company?.name || "Unknown company";

  return {
    company_name: company,
    normalized_company_name: cleanCompanyName(company),
    redirect_url: rawJob.refs?.landing_page,
    source: "themuse",
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
