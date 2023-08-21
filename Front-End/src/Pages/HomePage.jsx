import PostList from "../Components/PostList";
import { useGetPostsQuery, useVotePostMutation } from "../Store/APIs/PostsAPI";

const HomePage = () => {
  return (
    <div>
      <PostList query={useGetPostsQuery} mutation={useVotePostMutation} />
    </div>
  );
};

export default HomePage;
