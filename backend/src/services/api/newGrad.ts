import { fetchSimplifyJobs } from "../parsers/simplifyGithub.js";
import { IUnifiedJobInput } from "../../types/services.js";

const fetchGithubNewGrad = (): Promise<IUnifiedJobInput[]> => {
  return fetchSimplifyJobs({
    url:
      "https://raw.githubusercontent.com/" +
      "SimplifyJobs/New-Grad-Positions/dev/README.md",

    source: "github_new_grad",
    job_level: "entry_level",
  });
};

export default fetchGithubNewGrad;
