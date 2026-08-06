import axios from "axios";
import { parse } from "csv-parse/sync";
import { cleanCompanyName } from "../../utils/company.js";
import { isNotNull } from "../../utils/typeGuards.js";
import type { AtsType } from "../../types/models.js";
import type { IKalilCsvRow, IAtsCompanySeed } from "../../types/services.js";

const ATS_TYPES: AtsType[] = ["greenhouse", "lever", "ashby"];

const BASE_URL =
  "https://raw.githubusercontent.com/" +
  "kalil0321/ats-scrapers/main/ats-companies";

const createFallbackUrl = (atsType: AtsType, slug: string): string => {
  const fallbackUrls: Record<AtsType, string> = {
    greenhouse: `https://job-boards.greenhouse.io/${slug}`,
    lever: `https://jobs.lever.co/${slug}`,
    ashby: `https://jobs.ashbyhq.com/${slug}`,
  };

  return fallbackUrls[atsType];
};

const extractSlugFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
};

const fetchKalilFile = async (atsType: AtsType): Promise<IAtsCompanySeed[]> => {
  const fileUrl = `${BASE_URL}/${atsType}.csv`;

  try {
    const response = await axios.get<string>(fileUrl, {
      timeout: 15000,
      responseType: "text",
    });

    const rows = parse(response.data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as IKalilCsvRow[];

    return rows
      .map((row): IAtsCompanySeed | null => {
        const name = row.name?.trim();
        const rawSlug = row.slug?.trim();
        const rawUrl = row.url?.trim();

        if (!name) {
          return null;
        }
        /*
         * Depending on CSV version, slug or url
         * can contain either a slug or a full URL.
         */
        const slugSource = rawSlug || rawUrl;

        let slug: string | null;

        if (slugSource && slugSource.startsWith("http")) {
          slug = extractSlugFromUrl(slugSource);
        } else {
          slug = slugSource ?? null;
        }

        if (!slug) {
          return null;
        }

        slug = slug
          .toLowerCase()
          .replace(/^\/+|\/+$/g, "")
          .trim();

        if (!slug) {
          return null;
        }

        /*
         * Find a real URL in either column.
         */
        const sourceUrl = [rawUrl, rawSlug].find((value) =>
          value?.startsWith("http"),
        );
        const atsUrl = sourceUrl ?? createFallbackUrl(atsType, slug);

        return {
          name,
          normalized_name: cleanCompanyName(name),
          ats_type: atsType,
          ats_slug: slug,
          ats_url: atsUrl,
          seed_source: "kalil_ats_scrapers",
        };
      })
      .filter(isNotNull);
  } catch (error: unknown) {
    console.error(
      `[Kalil] Failed to load ${atsType}:`,
      axios.isAxiosError(error)
        ? `${error.response?.status ?? "Network error"} — ${error.message}`
        : error instanceof Error
          ? error.message
          : error,
    );

    return [];
  }
};

const fetchKalilAtsCompanies = async (): Promise<IAtsCompanySeed[]> => {
  /*
   * Only three requests, so Promise.all is safe here.
   */
  const results = await Promise.all(
    ATS_TYPES.map((atsType) => fetchKalilFile(atsType)),
  );

  return results.flat();
};

export default fetchKalilAtsCompanies;
