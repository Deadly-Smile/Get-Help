/* eslint-disable react/prop-types */
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CommentPanel from "./CommentPanel";
import { useAddCommentMutation } from "../Store";
import { Link } from "react-router-dom";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import ToastMessage from "./ToastMessage";

const PostView = ({ post, wordLimit, useVotePostMutation }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const [votePost, postResult] = useVotePostMutation();
  const [addComment, cmtResult] = useAddCommentMutation();
  const fullContent = post?.content;
  const maxLengthToShow = wordLimit ? wordLimit : 1000;

  const [showFullContent, setShowFullContent] = useState(false);
  const [showToast, setShowToast] = useState(false);
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

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };
  useEffect(() => {
    if (
      postResult?.isError ||
      cmtResult?.isSuccess ||
      cmtResult?.isError ||
      postResult?.isSuccess
    ) {
      handleShowToast();
    }
  }, [
    postResult?.isError,
    postResult?.isSuccess,
    cmtResult?.isError,
    cmtResult?.isSuccess,
  ]);

  let renderMsg = null;
  if (postResult?.isSuccess) {
    renderMsg = showToast && (
      <ToastMessage type={"success"} message={"Successfully voted"} />
    );
  }
  if (cmtResult?.isSuccess) {
    renderMsg = showToast && (
      <ToastMessage type={"success"} message={"Successfully commented"} />
    );
  }
  if (postResult?.isError || cmtResult?.isError) {
    renderMsg = showToast && (
      <ToastMessage type={"error"} message={"Error occured"} />
    );
  }

  useEffect(() => {
    if (cmtResult.isSuccess) {
      setNewComment("");
    }
  }, [cmtResult?.isSuccess]);

  const addCommentPanel = (
    <div className="mt-2">
      {/* <textarea className="textarea textarea-primary" placeholder="Add a comment..."></textarea> */}
      <textarea
        rows="1"
        placeholder="Add a comment..."
        value={newComment}
        className="w-full textarea textarea-bordered"
        onChange={(e) => {
          return setNewComment(e.target.value);
        }}
      />
      <div className="flex justify-end mt-1">
        <button className="btn btn-active" onClick={handleSubmitComment}>
          Add Comment
        </button>
      </div>
    </div>
  );

  return (
    <div className="my-8">
      <div className="flex justify-between">
        <div>
          <div className="flex">
            <div className="avatar online mr-4">
              <div className="w-8 h-8 rounded-full">
                <img
                  src={
                    post?.author_avatar
                      ? `${backEndURL}${post?.author_avatar}`
                      : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
                  }
                  alt={`${post?.author}'s Avatar`}
                />
              </div>
            </div>
            <Link
              to={`/home/get-user/${post?.users[0]?.id}`}
              className="link text-xl font-semibold link-hover underline-none text-blue-700"
            >
              {post?.author}
            </Link>
          </div>
          <h2 className="font-semibold text-2xl mt-2 underline">
            <Link to={`posts/${post.id}`}>{post?.title}</Link>
          </h2>
        </div>

        <div className="text-sm min-w-fit">
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
            {showFullContent ? "See Less" : "...See More"}
          </button>
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 bg-base-100 rounded p-2">
        <button
          className="text-blue-500 hover:underline text-2xl"
          onClick={() => handleVote(post.id, "upvote")}
        >
          <AiFillLike />
        </button>
        <span className="text-base-50">({post?.upvote_count})</span>
        <button
          className="text-red-500 hover:underline text-2xl"
          onClick={() => handleVote(post.id, "downvote")}
        >
          {/* Downvote */}
          <AiFillDislike />
        </button>
        <span className="text-base-50">({post?.downvote_count})</span>
      </div>
      <div className="bg-base-100 rounded p-3 mt-2">
        {comment}
        {addCommentPanel}
      </div>
      {showToast && renderMsg}
    </div>
  );
};

PostView.prototype = {
  post: PropTypes.object.isRequired,
  wordLimit: PropTypes.number,
};

export default PostView;
