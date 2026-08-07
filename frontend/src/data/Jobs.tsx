import { Link } from "react-router-dom";
import type { IJob } from "../types/pages.ts";
import type { ITableColumn } from "../types/components";

const columns: ITableColumn<IJob>[] = [
  {
    key: "title",
    title: "Position",
    render: (job) => <Link to={`/jobs/${job._id}`}>{job.title}</Link>,
  },
  {
    key: "company",
    title: "Company",
    render: (job) => job.company_name,
  },
  {
    key: "location",
    title: "Location",
    render: (job) => job.location,
  },
  {
    key: "level",
    title: "Level",
    render: (job) => job.job_level,
  },
  {
    key: "source",
    title: "Source",
    render: (job) => job.source,
  },
  {
    key: "apply",
    title: "Apply",
    render: (job) => (
      <a href={job.apply_url} target="_blank" rel="noreferrer">
        Apply
      </a>
    ),
  },
];

export default columns;
