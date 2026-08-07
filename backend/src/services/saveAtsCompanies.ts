import { Company } from "../models/Company.js";
import type {
  IAtsCompanySeed,
  ISaveAtsCompaniesResult,
} from "../types/services.js";

// Save companies to database
export const saveAtsCompanies = async (
  companies: IAtsCompanySeed[],
): Promise<ISaveAtsCompaniesResult> => {
  if (companies.length === 0)
    return {
      added: 0,
      updated: 0,
    };

  /*
   * Remove duplicates by ATS type and slug.
   */
  const uniqueCompanies = new Map<string, IAtsCompanySeed>();

  for (const company of companies) {
    const atsSlug = company.ats_slug.toLowerCase().trim();
    const key = `${company.ats_type}:${atsSlug}`;

    uniqueCompanies.set(key, {
      ...company,
      ats_slug: atsSlug,
    });
  }

  const currentDate = new Date();

  const operations = [...uniqueCompanies.values()].map((company) => ({
    updateOne: {
      filter: {
        ats_type: company.ats_type,
        ats_slug: company.ats_slug,
      },

      update: {
        $set: {
          name: company.name,
          normalized_name: company.normalized_name,
          ats_url: company.ats_url,
          seed_source: company.seed_source,
          active: true,
        },

        $setOnInsert: {
          ats_type: company.ats_type,
          ats_slug: company.ats_slug,
          created_at: currentDate,
        },
      },

      upsert: true,
    },
  }));

  const result = await Company.bulkWrite(operations, {
    ordered: false,
  });

  return {
    added: result.upsertedCount,
    updated: result.modifiedCount,
  };
};
