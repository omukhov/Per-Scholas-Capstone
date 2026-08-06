import { useEffect, useState } from "react";
import { getJobs } from "../../api/api.ts";
import { useLoading } from "../../context/LoadingContext.jsx";
import type { IJob } from "../../types/pages.ts";
import { columns } from "../../data/Companies.tsx";
import DataTable from "../../components/DataTable/DataTable.tsx";
import JobFilters from "../../components/JobFilters/JobFilters.tsx";

function Jobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [internshipOnly, setInternshipOnly] = useState(false);

  const [remoteOnly, setRemoteOnly] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    async function loadJobs(): Promise<void> {
      try {
        startLoading();
        const data = await getJobs(
          currentPage,
          search,
          internshipOnly,
          remoteOnly,
        );

        setJobs(data.jobs);
        setTotalJobs(data.pagination.totalJobs);
      } catch (error: unknown) {
        stopLoading();
        console.error("Failed to load jobs:", error);
      } finally {
        stopLoading();
      }
    }

    loadJobs();
  }, [currentPage, search, internshipOnly, remoteOnly]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const handleInternshipChange = () => {
    setCurrentPage(1);
    setInternshipOnly((current) => !current);
  };

  const handleRemoteChange = () => {
    setCurrentPage(1);
    setRemoteOnly((current) => !current);
  };

  const handleClear = () => {
    setCurrentPage(1);
    setSearchInput("");
    setSearch("");
    setInternshipOnly(false);
    setRemoteOnly(false);
  };

  return (
    <div>
      <h1>Job Market</h1>

      <p>Total jobs: {totalJobs}</p>

      <JobFilters
        searchInput={searchInput}
        internshipOnly={internshipOnly}
        remoteOnly={remoteOnly}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onInternshipChange={handleInternshipChange}
        onRemoteChange={handleRemoteChange}
        onClear={handleClear}
      />
      <DataTable
        columns={columns}
        data={jobs}
        getRowKey={(job: IJob) => job._id}
        emptyMessage="No jobs found"
      />
    </div>
  );
}

export default Jobs;
