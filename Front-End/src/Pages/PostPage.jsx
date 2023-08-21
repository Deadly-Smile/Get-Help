import PostView from "../Components/PostView";
import { useParams } from "react-router-dom";
import { useGetThePostQuery, useVotePostMutation } from "../Store";

const PostPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetThePostQuery({ id });
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p className="text-blue-600 font-semibold text-xl">Loading...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center">
        <p className="text-red-600 font-semibold text-xl">
          404 the post is not found
        </p>
      </div>
    );
  }
  return (
    <div>
      <PostView
        key={id}
        post={data?.post}
        wordLimit={1000}
        className="w-4/5"
        useVotePostMutation={useVotePostMutation}
      />
    </div>
  );
};

export default PostPage;
