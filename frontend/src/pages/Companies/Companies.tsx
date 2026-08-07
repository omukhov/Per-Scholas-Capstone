import { useEffect, useState } from "react";

import { getCompanies } from "../../api/api";
import { useLoading } from "../../context/LoadingContext";

import DataTable from "../../components/DataTable/DataTable";
import Pagination from "../../components/Pagination/Pagination";

import type { ICompany } from "../../types/pages";
import columns from "../../data/Companies";

import styles from "./Companies.module.css";

function Companies(): React.JSX.Element {
  const [companies, setCompanies] = useState<ICompany[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [error, setError] = useState<string | null>(null);

  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const loadCompanies = async (): Promise<void> => {
      try {
        startLoading();
        setError(null);

        const data = await getCompanies(currentPage, search);

        setCompanies(data.companies);
        setTotalPages(data.pagination.totalPages);
        setTotalCompanies(data.pagination.totalCompanies);
      } catch (error: unknown) {
        console.error("Failed to load companies:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load companies",
        );
      } finally {
        stopLoading();
      }
    };

    void loadCompanies();
  }, [currentPage, search]);

  const handleSearch = (): void => {
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const handleClear = (): void => {
    setCurrentPage(1);
    setSearchInput("");
    setSearch("");
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Companies</h1>

          <p>Companies with public ATS career pages</p>
        </div>

        <span className={styles.total}>
          {totalCompanies.toLocaleString("en-US")} companies
        </span>
      </div>

      <form
        className={styles.search}
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="search"
          value={searchInput}
          placeholder="Search by company, ATS or slug..."
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <button type="submit">Search</button>

        {(search || searchInput) && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <DataTable
        columns={columns}
        data={companies}
        getRowKey={(company) => company._id}
        emptyMessage="No companies found"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}

export default Companies;
