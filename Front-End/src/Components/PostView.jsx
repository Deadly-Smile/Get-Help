/* eslint-disable react/prop-types */
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CommentPanel from "./CommentPanel";
import { useAddCommentMutation } from "../Store";
import { Link } from "react-router-dom";
import { AiFillLike, AiFillDislike, AiFillMessage } from "react-icons/ai";
import ToastMessage from "./ToastMessage";
import MDEditor from "@uiw/react-md-editor";

const PostView = ({ post, wordLimit, useVotePostMutation }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const [votePost, postResult] = useVotePostMutation();
  const [addComment, cmtResult] = useAddCommentMutation();
  const fullContent = post?.content;
  const maxLengthToShow = wordLimit ? wordLimit : 1000;
  const [showCommentPanel, setShowCommentPanel] = useState(false);

  const [showToast, setShowToast] = useState(false);
  let contentToShow = fullContent.slice(0, maxLengthToShow);
  if (fullContent?.length > maxLengthToShow - 3)
    contentToShow = contentToShow + "...";

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
        <div className="">
          <div className="flex">
            <div className="avatar mr-4">
              <div className="w-12 h-12 rounded-full">
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
            <div className="py-2">
              <p className="font-semibold text-3xl text-teal-700">
                <Link to={`posts/${post.id}`}>{post?.title}</Link>
              </p>
              <Link
                to={`/home/get-user/${post?.users[0]?.id}`}
                className="link text-xs"
              >
                By {post?.author}
              </Link>
            </div>
          </div>
        </div>

        <div className="text-sm min-w-fit">
          Created {moment(post?.created_at).fromNow()}
        </div>
      </div>

      <div className="container pb-4">
        <MDEditor.Markdown
          className={`bg-base-100 text-gray-500 py-2 px-1 rounded`}
          source={contentToShow}
        />
      </div>

      {/* <div
        className="pb-4"
        dangerouslySetInnerHTML={{ __html: contentToShow }}
      />
      {fullContent.length > maxLengthToShow && (
        <div className="flex justify-end">
          <button
            className="text-blue-600 hover:underline"
            onClick={toggleShowFullContent}
          >
            {showFullContent ? "See Less" : "...See More"}
          </button>
        </div>
      )} */}
      <div className="flex bg-base-100 rounded p-2 j py-2 px-1 justify-between">
        <div className="flex space-x-2">
          <button
            className="hover:underline text-2xl"
            onClick={() => setShowCommentPanel(!showCommentPanel)}
          >
            <AiFillMessage />
          </button>
          <span className="text-base-50">({post?.comments?.length})</span>
        </div>
        <div className="flex justify-end space-x-2">
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
      </div>
      {showCommentPanel && (
        <div className="bg-base-50 rounded p-3 mt py-2 px-1 rounded-2">
          {comment}
          {addCommentPanel}
        </div>
      )}

      {showToast && renderMsg}
    </div>
  );
};

PostView.prototype = {
  post: PropTypes.object.isRequired,
  wordLimit: PropTypes.number,
};

export default PostView;
