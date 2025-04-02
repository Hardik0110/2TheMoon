import { PaginationProps } from "@/lib/types";

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

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i - 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-blue-900/30 hover:bg-purple-900/50'
          }`}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(<span key="ellipsis-start">...</span>);
      pageNumbers.unshift(
        <button
          key={1}
          onClick={() => onPageChange(0)}
          className="px-3 py-1 rounded-md bg-purple-900/30 hover:bg-purple-900/50"
        >
          1
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<span key="ellipsis-end">...</span>);
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages - 1)}
          className="px-3 py-1 rounded-md bg-purple-900/30 hover:bg-purple-900/50"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-blue-300">
          Showing {startRow} to {endRow} of {totalResults} results
        </div>
        
        
      </div>
      
      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center space-x-4">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-blue-900/30 rounded-lg border border-blue-500/30 disabled:opacity-50 hover:bg-blue-900/50"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {renderPageNumbers()}
          </div>
          
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-4 py-2 bg-blue-900/30 rounded-lg border border-blue-500/30 disabled:opacity-50 hover:bg-blue-900/50"
          >
            Next
          </button>
        </div>
      </div>

      <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
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

export default Pagination;