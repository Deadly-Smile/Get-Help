import PostList from "../Components/PostList";
import UserSearchPanel from "../Components/UserSearchPanel";
// import { VideoChat } from "../Components/VideoChat";
import { useGetPostsQuery, useVotePostMutation } from "../Store/APIs/PostsAPI";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex">
        {/* Centered Posts Panel */}
        <div className="flex justify-center items-center w-5/6 ml-16 mr-4">
          <PostList query={useGetPostsQuery} mutation={useVotePostMutation} />
        </div>

        {/* Top-right User Search Panel */}
        <div className="w-1/4 p-1">
          <UserSearchPanel />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
