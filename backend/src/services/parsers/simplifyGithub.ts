import axios from "axios";
import { load } from "cheerio";
import type {
  ISimplifyGithubConfig,
  IUnifiedJobInput,
} from "../../types/services.js";
import { cleanCompanyName } from "../../utils/company.js";
import { cleanText } from "../../utils/textFunctions.js";
import { isSoftwareRole } from "../../utils/filterJobs.js";
import { detectRemote } from "../../utils/locationFunctions.js";

const github = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/127.0.0.0 Safari/537.36",

    Accept: "text/plain,text/markdown,*/*",
  },
});

const getApplicationUrl = (links: string[]): string | null => {
  const validLinks = links.filter((url) => url.startsWith("http"));

  const directUrl = validLinks.find((url) => !url.includes("simplify.jobs"));

  return directUrl ?? validLinks[0] ?? null;
};

export const fetchSimplifyJobs = async (
  config: ISimplifyGithubConfig,
): Promise<IUnifiedJobInput[]> => {
  try {
    const response = await github.get<string>(config.url, {
      responseType: "text",
    });

    const $ = load(response.data);

    const jobsByUrl = new Map<string, IUnifiedJobInput>();

    $("table tbody tr").each((_, row) => {
      const cells = $(row).find("td");

      if (cells.length < 4) {
        return;
      }

      const companyName = cleanText($(cells[0]).text());

      const title = cleanText($(cells[1]).text());

      const location = cleanText($(cells[2]).text());

      if (!companyName || !title || !isSoftwareRole(title)) {
        return;
      }

      const links: string[] = [];

      cells.slice(3).each((_, cell) => {
        $(cell)
          .find("a[href]")
          .each((_, link) => {
            const href = $(link).attr("href");

            if (href) {
              links.push(href.trim());
            }
          });
      });

      const applyUrl = getApplicationUrl(links);

      if (!applyUrl) {
        return;
      }

      const job: IUnifiedJobInput = {
        source_job_id: applyUrl,
        title,
        company_name: companyName,
        normalized_company_name: cleanCompanyName(companyName),
        location: location || "USA / Remote",
        country: "US",
        apply_url: applyUrl,
        source: config.source,
        job_level: config.job_level,
        is_remote: detectRemote(title, location),
        status: "active",
        season: config.season,
      };

      jobsByUrl.set(applyUrl, job);
    });

    return [...jobsByUrl.values()];
  } catch (error: unknown) {
    console.error(
      `[Simplify GitHub] ${config.source}:`,
      error instanceof Error ? error.message : error,
    );

    return [];
  }
};
