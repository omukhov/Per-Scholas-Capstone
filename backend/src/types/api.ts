// ==============================
// Adzuna
// ==============================
export interface IRawAdzunaJob {
  id: string | number;
  title?: string;
  description?: string;
  created?: string;
  redirect_url: string;

  company?: {
    display_name?: string;
  };

  location?: {
    display_name?: string;
  };
}

export interface IAdzunaSearchResponse {
  results?: IRawAdzunaJob[];
  count?: number;
}

// ==============================
// Jooble
// ==============================
export interface IRawJoobleJob {
  id?: string | number;
  title?: string;
  snippet?: string;
  updated?: string;
  link: string;
  company?: string;
  location?: string;
  salary?: string;
  source?: string;
  type?: string;
}

export interface IJoobleSearchResponse {
  totalCount?: number;
  jobs?: IRawJoobleJob[];
}

// ==============================
// The Muse
// ==============================
export interface IRawMuseJob {
  id: number;
  name: string;
  contents?: string;
  publication_date?: string;

  company: {
    id: number;
    name: string;
  };

  refs: {
    landing_page: string;
  };

  locations?: Array<{
    name: string;
  }>;
}

export interface IMuseSearchResponse {
  results?: IRawMuseJob[];
  page_count?: number;
}

// ==============================
// Greenhouse
// ==============================
export interface IRawGreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  content?: string;
  location?: {
    name?: string;
  };
}

export interface IGreenhouseJobsResponse {
  jobs?: IRawGreenhouseJob[];
}
// ==============================
// Lever
// ==============================

export interface IRawLeverJob {
  id: string;
  text: string;

  categories?: {
    commitment?: string;
    department?: string;
    location?: string;
    team?: string;
    allLocations?: string[];
  };

  country?: string | null;

  hostedUrl: string;
  applyUrl?: string;

  description?: string;
  descriptionPlain?: string;

  opening?: string;
  openingPlain?: string;

  additional?: string;
  additionalPlain?: string;

  workplaceType?: "unspecified" | "on-site" | "remote" | "hybrid";

  createdAt?: number;
}

// ==============================
// Ashby
// ==============================

export interface IRawAshbyJob {
  id: string;
  title: string;
  location?: string;
  department?: string;
  team?: string;
  employmentType?: string;
  workplaceType?: string;
  isRemote?: boolean;
  descriptionHtml?: string;
  descriptionPlain?: string;
  publishedAt?: string;
  jobUrl: string;
  applyUrl?: string;
  secondaryLocations?: Array<{
    location?: string;
    address?: {
      addressLocality?: string;
      addressRegion?: string;
      addressCountry?: string;
    };
  }>;
  address?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
}

export interface IAshbyResponse {
  apiVersion?: string;
  jobs?: IRawAshbyJob[];
}

// ==============================
// Nominatim
// ==============================
export interface INominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export interface IGeocodedLocation {
  latitude: number;
  longitude: number;
}
