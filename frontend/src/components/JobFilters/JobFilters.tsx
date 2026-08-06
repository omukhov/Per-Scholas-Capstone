import styles from "./JobFilters.module.css";
import type { IJobFiltersProps } from "../../types/components";

const JobFilters = ({
  searchInput,
  internshipOnly,
  remoteOnly,
  onSearchInputChange,
  onSearch,
  onInternshipChange,
  onRemoteChange,
  onClear,
}: IJobFiltersProps): React.JSX.Element => {
  return (
    <div className={styles.filters}>
      <form
        className={styles.searchForm}
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <input
          type="search"
          value={searchInput}
          placeholder="Search jobs, companies, locations..."
          onChange={(event) => {
            onSearchInputChange(event.target.value);
          }}
          className={styles.searchInput}
        />

        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.buttons}>
        <button
          type="button"
          onClick={onInternshipChange}
          className={`${styles.filterButton} ${
            internshipOnly ? styles.active : ""
          }`}
        >
          Internships
        </button>

        <button
          type="button"
          onClick={onRemoteChange}
          className={`${styles.filterButton} ${
            remoteOnly ? styles.active : ""
          }`}
        >
          Remote
        </button>

        <button type="button" onClick={onClear} className={styles.clearButton}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
