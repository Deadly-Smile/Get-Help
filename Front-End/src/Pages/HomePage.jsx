import { useEffect, useState } from "react";
import { useGetPostsQuery, useVotePostMutation } from "../Store/APIs/PostsAPI";
import PostView from "../Components/PostView";
import Button from "../Components/Button";

const maxVisiblePages = 5;
const itemsPerPage = 10;
const HomePage = () => {
  const [postList, setPostList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isSuccess, isLoading, isError } = useGetPostsQuery(
    currentPage,
    itemsPerPage
  );

  const totalPages = data?.items?.last_page || 1;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === page
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {page}
        </Button>
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

  useEffect(() => {
    if (data && isSuccess) {
      setPostList(
        data?.posts?.data?.map((post, id) => {
          return (
            <PostView
              key={id}
              post={post}
              wordLimit={1000}
              className="w-4/5"
              useVotePostMutation={useVotePostMutation}
            />
          );
        })
      );
    }
  }, [data, isSuccess]);

  let render = null;
  if (isError || data?.posts?.data?.length === 0) {
    render = (
      <div className="flex justify-center">
        <p className="text-red-600 font-semibold">No post found</p>
      </div>
    );
  }
  if (isLoading) {
    render = (
      <div className="flex justify-center">
        <p className="text-blue-600 font-semibold">Loding...</p>
      </div>
    );
  }

  return (
    <div>
      {render}
      <div>{postList}</div>
      <div className="flex justify-center"> {pagination} </div>
    </div>
  );
};

export default HomePage;
