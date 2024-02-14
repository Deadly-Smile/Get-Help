import { useContext, useEffect, useState } from "react";
import PostView from "../Components/PostView";
import LoadingContext from "../Context/LoadingContext";
import errorImg from "../assets/400.png";

const itemsPerPage = 10;
// eslint-disable-next-line react/prop-types
const PostList = ({ query, mutation }) => {
  const [postList, setPostList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isSuccess, isLoading, isError } = query(
    currentPage,
    itemsPerPage
  );
  const isLoadingContext = useContext(LoadingContext);
  const totalPages = data?.posts?.last_page || 1;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  useEffect(() => {
    isLoadingContext.isLoading = isLoading;
  }, [isLoading, isLoadingContext]);

  useEffect(() => {
    if (data && isSuccess) {
      setPostList(
        data?.posts?.data?.map((post, id) => {
          return (
            <PostView
              key={id}
              post={post}
              wordLimit={1000}
              useVotePostMutation={mutation}
            />
          );
        })
      );
    }
  }, [data, isSuccess, mutation]);

  let render = null;
  if (!isSuccess || data?.posts?.data?.length === 0) {
    render = (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <img src={errorImg} className="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">Something went wrong</h1>
            <p className="py-6">
              Could not get required data, check you internet connection.
            </p>
            <button to={"/home"} className="btn btn-warning">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      {render}
      <div>{postList}</div>
      {isSuccess && !isLoading && !isError && pagination}
    </div>
  );
};

export default PostList;
