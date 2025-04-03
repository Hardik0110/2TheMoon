import { memo } from 'react';
import type { PaginationProps } from "@/lib/types";

// Memoized page number button for better performance
const PageButton = memo(({ 
  page, 
  isActive, 
  onClick 
}: { 
  page: number, 
  isActive: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'bg-blue-900/30 hover:bg-purple-900/50'
    }`}
  >
    {page}
  </button>
));

PageButton.displayName = 'PageButton';

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalResults,
  onPageChange,
  onPageSizeChange,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
}: PaginationProps) => {
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalResults);

  const pageSizeOptions = [50, 100, 150];

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      pageNumbers.push(
        <PageButton
          key={1}
          page={1}
          isActive={currentPage === 1}
          onClick={() => onPageChange(0)}
        />
      );
      
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis-start" aria-hidden="true">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageButton
          key={i}
          page={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i - 1)}
        />
      );
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis-end" aria-hidden="true">...</span>);
      }
      
      pageNumbers.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          onClick={() => onPageChange(totalPages - 1)}
        />
      );
    }

    return pageNumbers;
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pb-4">
      <div className="text-sm text-blue-300">
        Showing {startRow} to {endRow} of {totalResults} results
      </div>
      
      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center space-x-4">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className={`px-4 py-2 text-white rounded-md ${
              canPreviousPage ? 'bg-blue-400' : 'bg-blue-400/50 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2 text-blue-400">
            {renderPageNumbers()}
          </div>
          
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className={`px-4 py-2 text-white rounded-md ${
              canNextPage ? 'bg-blue-400' : 'bg-blue-400/50 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        aria-label="Rows per page"
        className="bg-black border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-blue-300 focus:outline-none focus:border-blue-500"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size} rows
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(Pagination);