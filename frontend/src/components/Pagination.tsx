interface PaginationProps {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  hasNextPage: boolean;
}

function Pagination({ currentPage, onPageChange, hasNextPage }: PaginationProps) {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-4 my-4">
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