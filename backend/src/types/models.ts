import type { Types } from "mongoose";

// ==============================
// Shared model types
// ==============================
export type JobSource =
  | "adzuna"
  | "jooble"
  | "themuse"
  | "github_new_grad"
  | "github_internships"
  | "greenhouse"
  | "lever"
  | "ashby";

export type JobLevel = "junior" | "entry_level" | "internship";

export type JobStatus = "active" | "closed";

export type AtsType = "greenhouse" | "lever" | "ashby";

export type AtsSeedSource =
  | "new_grad_positions"
  | "kalil_ats_scrapers"
  | "manual";

export type JobLocationStatus = "resolved" | "not_found";

// ==============================
// Company model
// ==============================
export interface ICompany {
  _id: Types.ObjectId;
  name: string;
  normalized_name: string;
  ats_type: AtsType;
  ats_slug: string;
  ats_url?: string;
  seed_source: AtsSeedSource;
  active: boolean;
  last_scraped_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ==============================
// Job model
// ==============================
export interface IJob {
  _id: Types.ObjectId;
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
  season?: string;
  status: JobStatus;
  last_seen_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IJobLocation {
  job_id: Types.ObjectId;
  source_location: string;

  latitude?: number;
  longitude?: number;

  status: JobLocationStatus;

  created_at: Date;
  updated_at: Date;
}
