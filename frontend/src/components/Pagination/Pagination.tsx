import type { IPaginationProps } from "../../types/components";
import { Fragment } from "react";
import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationProps): React.JSX.Element | null => {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages: number[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const isNearCurrentPage = Math.abs(page - currentPage) <= 1;

    if (isFirstPage || isLastPage || isNearCurrentPage) {
      visiblePages.push(page);
    }
  }

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.button}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      <div className={styles.pages}>
        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const showDots = previousPage && page - previousPage > 1;

          return (
            <Fragment key={page}>
              {showDots && <span className={styles.dots}>...</span>}

              <button
                type="button"
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.active : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </Fragment>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.button}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
