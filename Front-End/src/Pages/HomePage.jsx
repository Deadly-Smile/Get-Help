import PostList from "../Components/PostList";
import LocalFeed from "../Components/LocalFeed";
import { useGetPostsQuery, useVotePostMutation } from "../Store/APIs/PostsAPI";

const HomePage = () => {
  return (
    <div>
      <div className="flex justify-center">
        <LocalFeed />
      </div>
      <PostList query={useGetPostsQuery} mutation={useVotePostMutation} />
    </div>
  );
};

export default HomePage;
