/* eslint-disable react/prop-types */
import SortableTable from "../Components/SortableTable";
import { useContext, useEffect, useState } from "react";
import LoadingContext from "../Context/LoadingContext";
import ToastMessage from "./ToastMessage";

// const maxVisiblePages = 5;
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

  const pagination = (
    <div className="flex justify-center">
      <div className="join">
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button className="join-item btn">Page {currentPage}</button>
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-center">{render}</div>
      <div className="container mx-auto mt-8 my-2">
        <div className="flex justify-center">
          <SortableTable data={items} config={config} getKey={genarateKey} />
        </div>
        {isSuccess && !isLoading && !isError && pagination}
      </div>
    </div>
  );
};

export default ItemTable;
