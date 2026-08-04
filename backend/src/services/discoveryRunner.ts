import discoverCompaniesFromAdzuna from "./adzuna.js";
import discoverCompaniesFromJooble from "./jooble.js";
import discoverCompaniesFromMuse from "./muse.js";
import fetchGithubInternships from "./internships.js";

import { DiscoveredJob } from "../models/DiscoverdJob.js";
import { Internship } from "../models/Internship.js";
import {
  normalizeAdzuna,
  normalizeJooble,
  normalizeMuse,
  cleanCompanyName,
  detectAtsType,
} from "../utils/normalize.js";
import {
  RawAdzunaJob,
  RawJoobleJob,
  RawMuseJob,
  UnifiedJobInput,
  UnifiedInternshipInput,
} from "../types/api.js";

const runFullDiscovery = async () => {
  const [rawAdzuna, rawJooble, rawMuse, rawIntenship] = await Promise.all([
    discoverCompaniesFromAdzuna(1),
    discoverCompaniesFromJooble(),
    discoverCompaniesFromMuse(0),
    fetchGithubInternships(),
  ]);

  const unifiedJobs: UnifiedJobInput[] = [
    ...(rawAdzuna || []).map((job: RawAdzunaJob) => normalizeAdzuna(job)),
    ...(rawJooble || []).map((job: RawJoobleJob) => normalizeJooble(job)),
    ...(rawMuse || []).map((job: RawMuseJob) => normalizeMuse(job)),
  ];

  if (unifiedJobs.length > 0) {
    const jobOperations = unifiedJobs.map((job: UnifiedJobInput) => ({
      updateOne: {
        filter: { redirect_url: job.redirect_url },
        update: { $setOnInsert: job },
        upsert: true,
      },
    }));

    const jobResult = await DiscoveredJob.bulkWrite(jobOperations);
    console.log(`Jobs added: ${jobResult}`);
  }

  if (rawIntenship && rawIntenship.length > 0) {
    const internshipOperations = rawIntenship.map(
      (item: UnifiedInternshipInput) => {
        return {
          updateOne: {
            filter: {
              redirect_url: item.redirect_url,
            },
            update: {
              $setOnInsert: {
                company_name: item.company_name,
                normalized_company_name: cleanCompanyName(item.company_name),
                title: item.title,
                redirect_url: item.redirect_url,
                source: item.source,
                ats_type: detectAtsType(item.redirect_url),
              },
            },
            upsert: true,
          },
        };
      },
    );

    const internsShipResult = await Internship.bulkWrite(internshipOperations);
    console.log(`Internships added: ${internsShipResult}`);
  }
};

export default runFullDiscovery;
