import { useGetAllUsersQuery } from "../Store";
import SortableTable from "../Components/SortableTable";
import { useEffect, useState } from "react";
import Button from "../Components/Button";

const maxVisiblePages = 5;
const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const { data, isLoading, isError, isSuccess } = useGetAllUsersQuery({
    currentPage,
    usersPerPage,
  });

  const totalPages = data?.users?.last_page || 1; // Get total pages from metadata
  const config = [
    {
      title: "ID.",
      render: (user) => {
        return user?.id;
      },
      sortValue: (user) => user?.id,
    },
    {
      title: "Name",
      render: (user) => {
        return user?.name;
      },
    },
    {
      title: "email",
      render: (user) => {
        return user?.email;
      },
    },
    {
      title: "username",
      render: (user) => {
        return user?.username;
      },
      sortValue: (user) => user?.username,
    },
    {
      title: "avatar",
      render: (user) => {
        return user?.email;
      },
    },
    {
      title: "pending_subscriber",
      render: (user) => {
        return user?.pending_subscriber ? "true" : "false";
      },
    },
  ];
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const genarateKey = (user) => {
    return user?.id;
  };

  // console.log(totalPages);
  let render = null;
  if (isLoading) {
    render = <p className="text-blue-700 font-semibold">Loading...</p>;
  }
  if (isError) {
    render = <p className="text-red-800 font-semibold">Error occured!!</p>;
  }
  useEffect(() => {
    if (isSuccess) {
      setUsers(data?.users?.data);
    } else {
      setUsers([]);
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
      <div className="flex justify-center">
        {render}
        {usersPerPage}
      </div>
      <div className="container mx-auto mt-8">
        <SortableTable data={users} config={config} getKey={genarateKey} />
        {pagination}
      </div>
    </div>
  );
};

export default UserTable;
