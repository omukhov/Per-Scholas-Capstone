import {
  IRawAdzunaJob,
  IRawJoobleJob,
  IRawMuseJob,
  IRawGreenhouseJob,
  IRawAshbyJob,
  IRawLeverJob,
} from "../types/api.js";
import type { ICompany } from "../types/models.js";
import type { IUnifiedJobInput } from "../types/services.js";
import { detectJobLevel, isSoftwareRole } from "./filterJobs.js";
import { cleanCompanyName } from "./company.js";
import { parseDate } from "./dateFunctions.js";
import { detectRemote, isUsLocation } from "./locationFunctions.js";

// ==============================
// Adzuna
// ==============================
export const normalizeAdzuna = (
  rawJob: IRawAdzunaJob,
): IUnifiedJobInput | null => {
  const title = rawJob.title?.trim() || "Unknown Position";

  const jobLevel = detectJobLevel(title);

  if (!jobLevel) {
    return null;
  }

  const companyName = rawJob.company?.display_name?.trim() || "Unknown Company";

  const location = rawJob.location?.display_name?.trim() || "Remote / USA";

  return {
    source_job_id: String(rawJob.id),
    title,
    company_name: companyName,
    normalized_company_name: cleanCompanyName(companyName),
    location,
    country: "US",
    apply_url: rawJob.redirect_url,
    source: "adzuna",
    job_level: jobLevel,
    description: rawJob.description,
    posted_at: parseDate(rawJob.created),
    is_remote: detectRemote(title, location),
    status: "active",
  };
};

// ==============================
// Jooble
// ==============================
export const normalizeJooble = (
  rawJob: IRawJoobleJob,
): IUnifiedJobInput | null => {
  const title = rawJob.title?.trim() || "Unknown Position";

  const jobLevel = detectJobLevel(title);

  if (!jobLevel) {
    return null;
  }

  const companyName = rawJob.company?.trim() || "Unknown Company";

  const location = rawJob.location?.trim() || "Remote / USA";

  return {
    /*
     * Jooble sometimes didn't return id
     * In this case use link.
     */
    source_job_id: rawJob.id ? String(rawJob.id) : rawJob.link,

    title,
    company_name: companyName,
    normalized_company_name: cleanCompanyName(companyName),
    location,
    country: "US",
    apply_url: rawJob.link,
    source: "jooble",
    job_level: jobLevel,
    description: rawJob.snippet,
    posted_at: parseDate(rawJob.updated),
    is_remote: detectRemote(title, location),
    status: "active",
  };
};

// ==============================
// The Muse
// ==============================
export const normalizeMuse = (rawJob: IRawMuseJob): IUnifiedJobInput | null => {
  const title = rawJob.name?.trim() || "Unknown Position";

  const jobLevel = detectJobLevel(title);

  if (!jobLevel) {
    return null;
  }

  const companyName = rawJob.company?.name?.trim() || "Unknown Company";

  const location =
    rawJob.locations
      ?.map((item) => item.name.trim())
      .filter(Boolean)
      .join(", ") || "Remote / USA";

  return {
    source_job_id: String(rawJob.id),
    title,
    company_name: companyName,
    normalized_company_name: cleanCompanyName(companyName),
    location,
    country: "US",
    apply_url: rawJob.refs.landing_page,
    source: "themuse",
    job_level: jobLevel,
    description: rawJob.contents,
    posted_at: parseDate(rawJob.publication_date),
    is_remote: detectRemote(title, location),
    status: "active",
  };
};

// ==============================
// Greenhouse
// ==============================
export const normalizeGreenhouse = (
  rawJob: IRawGreenhouseJob,
  company: ICompany,
): IUnifiedJobInput | null => {
  const title = rawJob.title?.trim();

  if (!title || !rawJob.absolute_url || rawJob.id === undefined) {
    return null;
  }

  if (!isSoftwareRole(title)) {
    return null;
  }

  const jobLevel = detectJobLevel(title);

  if (!jobLevel) {
    return null;
  }

  const location = rawJob.location?.name?.trim() || "Unknown";

  if (!isUsLocation(location)) {
    return null;
  }

  return {
    source_job_id: String(rawJob.id),
    title,
    company_name: company.name,
    normalized_company_name:
      company.normalized_name || cleanCompanyName(company.name),
    location,
    country: "US",
    apply_url: rawJob.absolute_url,
    source: "greenhouse",
    job_level: jobLevel,
    description: rawJob.content,
    posted_at: parseDate(rawJob.updated_at),
    is_remote: detectRemote(title, location),
    status: "active",
  };
};

// ==============================
// Ashby
// ==============================
export const normalizeAshby = (
  rawJob: IRawAshbyJob,
  company: ICompany,
): IUnifiedJobInput | null => {
  const title = rawJob.title?.trim();
  const applyUrl = rawJob.applyUrl || rawJob.jobUrl;

  if (!title || !applyUrl || !rawJob.id) {
    return null;
  }

  if (!isSoftwareRole(title)) {
    return null;
  }

  const jobLevel = detectJobLevel(title);

  if (!jobLevel) {
    return null;
  }

  const location = rawJob.location?.trim() || "Unknown";

  const addressLocation = [
    rawJob.address?.addressLocality,
    rawJob.address?.addressRegion,
    rawJob.address?.addressCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const fullLocation = addressLocation
    ? `${location}, ${addressLocation}`
    : location;

  if (!isUsLocation(fullLocation)) {
    return null;
  }

  const isRemote =
    rawJob.isRemote ??
    (rawJob.workplaceType?.toLowerCase() === "remote" ||
      detectRemote(title, location));

  return {
    source_job_id: rawJob.id,
    title,
    company_name: company.name,
    normalized_company_name:
      company.normalized_name || cleanCompanyName(company.name),
    location,
    country: "US",
    apply_url: applyUrl,
    source: "ashby",
    job_level: jobLevel,
    description: rawJob.descriptionPlain ?? rawJob.descriptionHtml,
    posted_at: parseDate(rawJob.publishedAt),
    is_remote: isRemote,
    status: "active",
  };
};

// ==============================
// Lever
// ==============================
export const normalizeLever = (
  rawJob: IRawLeverJob,
  company: ICompany,
): IUnifiedJobInput | null => {
  const title = rawJob.text?.trim();
  const applyUrl = rawJob.applyUrl || rawJob.hostedUrl;

  if (!title || !applyUrl || !rawJob.id) {
    return null;
  }

  if (!isSoftwareRole(title)) {
    return null;
  }

  const jobLevel = detectJobLevel(title);

  if (!jobLevel) {
    return null;
  }

  const location =
    rawJob.categories?.allLocations
      ?.map((item) => item.trim())
      .filter(Boolean)
      .join(", ") ||
    rawJob.categories?.location?.trim() ||
    "Unknown";

  const isUsJob =
    rawJob.country?.toUpperCase() === "US" || isUsLocation(location);

  if (!isUsJob) {
    return null;
  }

  return {
    source_job_id: rawJob.id,
    title,
    company_name: company.name,
    normalized_company_name:
      company.normalized_name || cleanCompanyName(company.name),
    location,
    country: "US",
    apply_url: applyUrl,
    source: "lever",
    job_level: jobLevel,
    description: rawJob.descriptionPlain,
    posted_at: parseDate(rawJob.createdAt),
    is_remote:
      rawJob.workplaceType === "remote" || detectRemote(title, location),
    status: "active",
  };
};
