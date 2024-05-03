import {
  useApprovePostMutation,
  useDeletePendingPostMutation,
  useGetPendingPostsQuery,
} from "../Store";
import { Link } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import ItemTable from "../Components/ItemTable";

const backEndURL = import.meta.env.VITE_BACKEND_URL;
const PostTable = () => {
  const [deletePendingPost, deleteResult] = useDeletePendingPostMutation();
  const [approvePost] = useApprovePostMutation();

  const config = [
    {
      title: "ID.",
      render: (post) => {
        return (
          <Link
            to={`/home/posts/${post?.id}`}
            className="text-blue-500 hover:underline"
          >
            {post?.id}
          </Link>
        );
      },
      sortValue: (post) => post?.id,
    },
    {
      title: "Title",
      render: (post) => {
        const maxLength = 20;
        if (post?.title && post?.title?.length > maxLength) {
          return post.title.slice(0, maxLength) + "...";
        } else {
          return post?.title;
        }
      },
    },
    {
      title: "Name",
      render: (post) => {
        return (
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img
                  src={
                    post?.author
                      ? `${backEndURL}${post?.author}`
                      : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
                  }
                  alt={`${post?.author}'s Avatar`}
                />
              </div>
            </div>
            <div>
              <div className="font-bold">{post?.author}</div>
              <div className="text-sm opacity-50">
                <Link to={`/home/get-user/${post?.users[0]?.id}`}>
                  <span className=" hover:text-green-800 hover:underline">
                    {post?.author}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Approve/Disprove",
      render: (post) => {
        const id = post?.id;
        return post?.isPending ? (
          <button
            onClick={() => {
              approvePost({ id });
            }}
            className="btn btn-success"
          >
            Approve
          </button>
        ) : (
          <p>Approved</p>
        );
      },
    },
    {
      title: "Delete Post",
      render: (post) => {
        const id = post.id;
        return (
          <button
            className="p-3 mx-5 hover:bg-red-500 items-center rounded-md"
            onClick={() => {
              deletePendingPost({ id });
            }}
          >
            <GoTrash />
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <p className="text-center font-bold text-2xl pt-6">Post List</p>
      <ItemTable
        config={config}
        query={useGetPendingPostsQuery}
        result={deleteResult}
      />
    </div>
  );
};

export default PostTable;
