import React from "react";

interface PaginateProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
}

const Paginate: React.FC<PaginateProps> = ({
  totalCount,
  currentPage,
  pageSize,
  setPage,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const renderPageNumbers = getPageNumbers().map((pageNumber) => (
    <li
      key={pageNumber}
      className={`mx-1 p-2 px-2 md:px-4 cursor-pointer ${
        pageNumber === currentPage
          ? "bg-primary text-white"
          : "bg-gray-200 text-gray-800"
      } rounded text-sm md:text-base h-fit`}
      onClick={() => setPage(pageNumber)}
    >
      {pageNumber}
    </li>
  ));

  return (
    <ul className="flex justify-center space-x-2 h-fit mb-4">
      <li
        className={`mx-1 p-2 cursor-pointer ${
          currentPage === 1 ? "pointer-events-none" : ""
        } ${
          currentPage === 1 ? "bg-gray-300" : "bg-primary text-white"
        } rounded-md text-sm md:text-base h-fit`}
        onClick={() => setPage(currentPage - 1)}
      >
        {"<<"}
      </li>
      {renderPageNumbers}
      <li
        className={`mx-1 p-2 cursor-pointer ${
          currentPage === totalPages ? "pointer-events-none" : ""
        } ${
          currentPage === totalPages ? "bg-gray-300" : "bg-primary text-white"
        } rounded-md text-sm md:text-base h-fit`}
        onClick={() => setPage(currentPage + 1)}
      >
        {">>"}
      </li>
    </ul>
  );
};

export default Paginate;
