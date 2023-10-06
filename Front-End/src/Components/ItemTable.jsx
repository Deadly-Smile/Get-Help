/* eslint-disable react/prop-types */
import SortableTable from "../Components/SortableTable";
import { useContext, useEffect, useState } from "react";
import Button from "../Components/Button";
import LoadingContext from "../Context/LoadingContext";
import ToastMessage from "./ToastMessage";

const maxVisiblePages = 5;
const itemsPerPage = 10;
const ItemTable = ({ query, config, result, perPage }) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isLoadingContext = useContext(LoadingContext);
  const [showToast, setShowToast] = useState(false);
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };
  // const [itemsPerPage] = useState(10);
  if (!perPage) {
    perPage = itemsPerPage;
  }
  const { data, isLoading, isError, isSuccess } = query({
    currentPage,
    perPage,
  });

  useEffect(() => {
    if (isLoading) {
      isLoadingContext.setProgress(30);
    } else {
      isLoadingContext.setProgress(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const totalPages = data?.items?.last_page || 1;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const genarateKey = (item) => {
    return item?.id;
  };

  useEffect(() => {
    if (isError || result?.isError || isSuccess || result?.isSuccess) {
      handleShowToast();
    }
  }, [isError, isSuccess, result?.isError, result?.isSuccess]);

  let render = null;
  if (isError) {
    render = (
      <div>
        {showToast && <ToastMessage type="error" message="Error occured!!" />}
      </div>
    );
  }
  if (result.isError) {
    let msg = `Failed to delete id ${result?.error?.data?.id}, message: ${result?.error?.data?.message}`;
    render = (
      <div>{showToast && <ToastMessage type="error" message={msg} />}</div>
    );
  }
  if (result?.isSuccess) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type="success" message={"Successfully deleted"} />
        )}
      </div>
    );
  }
  useEffect(() => {
    if (isSuccess) {
      setItems(data?.items?.data);
    } else {
      setItems([]);
    }
  }, [data, isSuccess]);

  const getPageButtons = () => {
    const pageButtons = [];
    const firstVisiblePage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const lastVisiblePage = Math.min(
      totalPages,
      firstVisiblePage + maxVisiblePages - 1
    );

    for (let page = firstVisiblePage; page <= lastVisiblePage; page++) {
      pageButtons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === page
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {page}
        </button>
      );
    }

    return pageButtons;
  };

  const pagination = (
    <div className="flex justify-center mt-4">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        secondary
        className={`${
          currentPage === 1 ? "disabled" : ""
        } rounded hover:bg-gray-200 hover:text-gray-800 px-1 py-1`}
      >
        {"<<"}
      </Button>
      {currentPage > Math.floor(maxVisiblePages / 2) && (
        <>
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-800"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
          {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
            <span>...</span>
          )}
        </>
      )}

      {getPageButtons()}

      {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
        <>
          {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
            <span>...</span>
          )}
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-800"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        secondary
        className={`${
          currentPage === totalPages ? "disabled" : ""
        } rounded hover:bg-gray-200 hover:text-gray-800  px-1 py-1`}
      >
        {">>"}
      </Button>
    </div>
  );
  return (
    <div>
      <div className="flex justify-center">{render}</div>
      <div className="container mx-auto mt-8 my-2">
        <div className="flex justify-center">
          <SortableTable data={items} config={config} getKey={genarateKey} />
        </div>
        {isSuccess && !isLoading && !isError ? (
          <div className="flex justify-center">{pagination}</div>
        ) : null}
      </div>
    </div>
  );
};

export default ItemTable;
