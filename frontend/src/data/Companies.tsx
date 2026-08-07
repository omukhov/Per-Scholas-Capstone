import styles from "./Companies.module.css";
import type { ICompany } from "../types/pages.ts";
import type { ITableColumn } from "../types/components";

// Columns for companies table
const columns: ITableColumn<ICompany>[] = [
  {
    key: "name",
    title: "Company",
    render: (company) => company.name,
  },

  {
    key: "atsType",
    title: "ATS",
    render: (company) => company.ats_type,
  },

  {
    key: "atsSlug",
    title: "ATS Slug",
    render: (company) => company.ats_slug,
  },

  {
    key: "source",
    title: "Source",
    render: (company) => company.seed_source || "Unknown",
  },

  {
    key: "careers",
    title: "Careers",
    render: (company) =>
      company.ats_url ? (
        <a
          href={company.ats_url}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          View jobs
        </a>
      ) : (
        <span className={styles.unavailable}>Unavailable</span>
      ),
  },
];

export default columns;
