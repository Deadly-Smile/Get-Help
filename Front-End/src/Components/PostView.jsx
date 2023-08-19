/* eslint-disable react/prop-types */
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import CommentPanel from "./CommentPanel";
import Button from "./Button";
import { useAddCommentMutation, useGetCommentsQuery } from "../Store";

const PostView = ({
  post,
  wordLimit,
  className,
  useVotePostMutation,
  ...rest
}) => {
  const { data, isLoading, isError } = useGetCommentsQuery({
    id: post?.id,
  });
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

  const comment = <CommentPanel comments={data?.comments} />;

  const [newComment, setNewComment] = useState("");
  const handleSubmitComment = () => {
    console.log(post.id);
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

      {isError && <p className="text-red-500">Error occurred</p>}
      {isLoading && <p className="text-blue-500">Loading...</p>}
    </div>
  );

  return (
    <div className={finalClassNames} {...rest}>
      <div className="flex justify-between">
        <h2 className="font-semibold text-3xl mb-2">{post?.title}</h2>
        <div className="text-gray-600 text-sm mb-2">
          Created {moment(post?.created_at).fromNow()} by {post?.author}
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: contentToShow }} />
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