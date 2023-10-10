import {
  useApprovePostMutation,
  useDeletePendingPostMutation,
  useGetPendingPostsQuery,
} from "../Store";
import Button from "../Components/Button";
import { Link } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";

const PostTable = () => {
  const [deletePendingPost, deleteResult] = useDeletePendingPostMutation();
  const [approvePost] = useApprovePostMutation();

  const config = [
    {
      title: "ID.",
      render: (post) => {
        return post?.id;
      },
      sortValue: (post) => post?.id,
    },
    {
      title: "Title",
      render: (post) => {
        return post?.title;
      },
    },
    {
      title: "Avatar",
      render: (post) => {
        return (
          <img
            src={
              post?.author_avatar
                ? `${import.meta.env.VITE_BACKEND_URL}${post?.author_avatar}`
                : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
            }
            alt={`${post?.author}'s Avatar`}
            className="max-w-[30px] max-h-7 rounded"
          />
        );
      },
    },
    {
      title: "Approve/Disprove",
      render: (post) => {
        const id = post?.id;
        return post?.isPending ? (
          <Button
            onClick={() => {
              approvePost({ id });
            }}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Approve
          </Button>
        ) : (
          <p>Already approved</p>
        );
      },
    },
    {
      title: "Delete User",
      render: (post) => {
        const id = post.id;
        return (
          <Button
            className="px-4 mx-5"
            onClick={() => {
              deletePendingPost({ id });
            }}
          >
            <GoTrash />
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <p className="font-semibold text-center text-2xl">Post List</p>
      <ItemTable
        config={config}
        query={useGetPendingPostsQuery}
        result={deleteResult}
      />
    </div>
  );
};

export default PostTable;
