/* eslint-disable react/prop-types */
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import CommentPanel from "./CommentPanel";
import Button from "./Button";
import { useAddCommentMutation } from "../Store";
import { Link } from "react-router-dom";

const PostView = ({
  post,
  wordLimit,
  className,
  useVotePostMutation,
  ...rest
}) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const [votePost, postResult] = useVotePostMutation();
  const [addComment, cmtResult] = useAddCommentMutation();
  const finalClassNames = classNames(
    "mx-auto p-4 bg-white shadow-md rounded-lg my-3",
    className
  );
  const fullContent = post?.content;
  const maxLengthToShow = wordLimit ? wordLimit : 1000;

  const [showFullContent, setShowFullContent] = useState(false);
  const contentToShow = showFullContent
    ? fullContent
    : fullContent.slice(0, maxLengthToShow);

  const toggleShowFullContent = () => {
    setShowFullContent(!showFullContent);
  };

  const handleVote = (id, operation) => {
    votePost({ id, operation });
  };

  const comment = <CommentPanel comments={post?.comments} />;

  const [newComment, setNewComment] = useState("");
  const handleSubmitComment = () => {
    addComment({ content: newComment, id: post.id });
  };

  useEffect(() => {
    if (cmtResult.isSuccess) {
      setNewComment("");
    }
  }, [cmtResult?.isSuccess]);

  const addCommentPanel = (
    <div className="mt-2">
      <textarea
        rows="1"
        placeholder="Add a comment..."
        value={newComment}
        className="w-full mr-2 px-3 py-2 border rounded"
        onChange={(e) => {
          return setNewComment(e.target.value);
        }}
      />
      <div className="flex justify-end mt-1">
        <Button
          className="rounded hover:bg-gray-50 hover:text-gray-800"
          secondary
          onClick={handleSubmitComment}
        >
          Add Comment
        </Button>
      </div>
    </div>
  );

  return (
    <div className={finalClassNames} {...rest}>
      <div className="flex justify-between">
        <div>
          <div className="flex">
            <img
              src={
                post?.author_avatar
                  ? `${backEndURL}${post?.author_avatar}`
                  : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
              }
              alt={`${post?.author}'s Avatar`}
              className="max-w-[40px] max-h-10 rounded-full"
            />
            <Link to={`/home/get-user/${post?.users[0]?.id}`}>
              <h1 className="font-semibold text-2xl ml-2 text-blue-600 hover:text-green-800 hover:underline">
                {post?.author}
              </h1>
            </Link>
          </div>
          <h2 className="font-semibold text-xl mt-2 ">{post?.title}</h2>
        </div>

        <div className="text-gray-600 text-sm min-w-fit">
          Created {moment(post?.created_at).fromNow()}
        </div>
      </div>
      <div className="" dangerouslySetInnerHTML={{ __html: contentToShow }} />
      {fullContent.length > maxLengthToShow && (
        <div className="flex justify-end">
          <button
            className="text-blue-600 hover:underline"
            onClick={toggleShowFullContent}
          >
            {showFullContent ? "See Less" : "See More"}
          </button>
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 bg-gray-300 rounded p-2">
        {postResult.isError ? (
          <p className="text-red-500">Error occured</p>
        ) : null}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => handleVote(post.id, "upvote")}
        >
          Upvote
        </button>
        <span className="text-gray-600">({post?.upvote_count})</span>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleVote(post.id, "downvote")}
        >
          Downvote
        </button>
        <span className="text-gray-600">({post?.downvote_count})</span>
      </div>
      <div className="bg-gray-100 rounded p-3 mt-2">
        {comment}
        {addCommentPanel}
      </div>
    </div>
  );
};

PostView.prototype = {
  post: PropTypes.object.isRequired,
  wordLimit: PropTypes.number,
};

export default PostView;
