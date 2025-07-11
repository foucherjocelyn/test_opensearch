interface PaginationProps {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  hasNextPage: boolean;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

function Pagination({ currentPage, onPageChange, hasNextPage, itemsPerPage, onItemsPerPageChange }: PaginationProps) {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-4 my-4">
      {/* Number of items per page */}
      <label className="text-sm">
        <span className="text-sm m-2">Items per page:</span>
        <select className="px-2 py-2 border rounded"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
      {/* Previous and Next Pages */}
      <button
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>
        Page {currentPage}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        disabled={hasNextPage === false}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;