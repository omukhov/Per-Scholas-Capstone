// Raw response structure from Adzuna API
export interface RawAdzunaJob {
  id: string | number;
  title?: string;
  created?: string;
  redirect_url: string;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
  };
}

// Raw response structure from Jooble API
export interface RawJoobleJob {
  id?: string | number;
  title?: string;
  updated?: string;
  link: string;
  company?: string;
  location?: string;
}

// Raw response structure from The Muse API
export interface RawMuseJob {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
  };
  refs: {
    landing_page: string;
  };
  publication_date?: string;
  locations?: Array<{ name: string }>;
}

export interface UnifiedJobInput {
  company_name: string;
  normalized_company_name: string;
  title: string;
  redirect_url: string;
  source: "adzuna" | "jooble" | "themuse";
  source_job_id?: string;
  location?: string;
  publication_date?: Date;
}

export interface UnifiedInternshipInput {
  source: string;
  company_name: string;
  title: string;
  redirect_url: string;
  location?: string;
  season?: string;
}
