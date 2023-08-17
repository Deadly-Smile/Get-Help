import { useEffect, useState } from "react";
import { useGetPostsQuery } from "../Store/APIs/PostsAPI";
import PostView from "../Components/PostView";

const HomePage = () => {
  const { data, isSuccess, isLoading, isError } = useGetPostsQuery();
  const [postList, setPostList] = useState(null);
  useEffect(() => {
    if (data && isSuccess) {
      console.log(data);
      setPostList(
        data.posts.map((post, index) => {
          return (
            <PostView
              key={index}
              post={post}
              wordLimit={1000}
              className="w-4/5"
            />
          );
        })
      );
    }
  }, [data, isSuccess]);

  let render = null;
  if (isError) {
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
    </div>
  );
};

export default HomePage;
