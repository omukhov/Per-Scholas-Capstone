import type {
  AtsSeedSource,
  AtsType,
  JobLevel,
  JobSource,
  JobStatus,
} from "./models.js";

export interface IKalilCsvRow {
  name?: string;
  slug?: string;
  url?: string;
}

/* interface for  unified job in database */
export interface IUnifiedJobInput {
  source_job_id: string;

  title: string;

  company_name: string;
  normalized_company_name: string;

  location: string;
  country: string;

  apply_url: string;

  source: JobSource;
  job_level: JobLevel;

  description?: string;
  posted_at?: Date;

  is_remote?: boolean;

  status?: JobStatus;

  /*
   * Only for internships
   */
  season?: string;
}

/*
 * Company with known ATS slug.
 *
 * Uses for import
 * Kalil и New Grad Positions.
 */
export interface IAtsCompanySeed {
  name: string;
  normalized_name: string;
  ats_type: AtsType;
  ats_slug: string;
  ats_url?: string;
  seed_source: AtsSeedSource;
}

export interface ISaveAtsCompaniesResult {
  added: number;
  updated: number;
}

export interface IJobImportResult {
  received: number;
  accepted: number;
  saved: number;
  rejected: number;
}

export interface ISimplifyGithubConfig {
  url: string;
  source: JobSource;
  job_level: JobLevel;
  season?: string;
}
