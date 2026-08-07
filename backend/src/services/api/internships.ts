import { IUnifiedJobInput } from "../../types/services.js";
import { fetchSimplifyJobs } from "../parsers/simplifyGithub.js";

// Get data (info about internships) from github
const fetchGithubInternships = (): Promise<IUnifiedJobInput[]> => {
  return fetchSimplifyJobs({
    url:
      "https://raw.githubusercontent.com/" +
      "SimplifyJobs/Summer2027-Internships/dev/README.md",

    source: "github_internships",
    job_level: "internship",
    season: "Summer 2027",
  });
};

export default fetchGithubInternships;
