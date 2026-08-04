import axios from "axios";
import { UnifiedInternshipInput } from "../types/api.js";

const internship = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    Accept: "text/plain, text/markdown, */*",
  },
});

const fetchGithubInternships = async (): Promise<UnifiedInternshipInput[]> => {
  try {
    const response = await internship.get(
      "https://raw.githubusercontent.com/SimplifyJobs/Summer2027-Internships/dev/README.md",
    );

    const markdownText: string = response.data;

    const internships: UnifiedInternshipInput[] = [];

    const linkRegex: RegExp =
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|href="(https?:\/\/[^"]+)"/g;

    const lines: string[] = markdownText.split("\n");

    for (const line of lines) {
      if (!line.includes("http") && !line.includes("href")) continue;

      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        const url = match[2] || match[3];

        if (
          url &&
          (url.includes("greenhouse.io") ||
            url.includes("lever.co") ||
            url.includes("ashbyhq.com") ||
            url.includes("workable.com") ||
            url.includes("simplify.jobs") ||
            url.includes("/jobs/"))
        ) {
          const companyMatch = line.match(/\*\*([^*]+)\*\*/);
          const companyName = companyMatch
            ? companyMatch[1]
            : "Unknown Company";

          internships.push({
            source: "github_simplify",
            company_name: companyName.trim(),
            title: "Software Engineering Intern / Entry Level",
            redirect_url: url.trim(),
          });
        }
      }
    }

    return internships;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("[GitHub Error]:", error.message);
    } else {
      console.error("[GitHub Error]:", error);
    }
    return [];
  }
};

export default fetchGithubInternships;
