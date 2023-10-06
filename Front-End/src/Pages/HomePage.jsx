import ContactPanel from "../Components/ContactsPanel";
import PostList from "../Components/PostList";
import UserSearchPanel from "../Components/UserSearchPanel";
// import { VideoChat } from "../Components/VideoChat";
import { useGetPostsQuery, useVotePostMutation } from "../Store/APIs/PostsAPI";

const HomePage = () => {
  return (
    <div className="flex flex-col relative">
      <div className="flex-grow flex">
        {/* Centered Posts Panel */}
        <div className="flex justify-center items-center w-9/12 ml-20">
          <PostList query={useGetPostsQuery} mutation={useVotePostMutation} />
        </div>

        {/* Top-right User Search Panel */}
        <div className="fixed top-12 right-0 w-2/12 p-1">
          <UserSearchPanel />
          <ContactPanel />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
