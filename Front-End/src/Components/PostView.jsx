/* eslint-disable react/prop-types */
import moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import classNames from "classnames";

const PostView = ({ post, wordLimit, className, ...rest }) => {
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
  return (
    <div className={finalClassNames} {...rest}>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-2">{post?.title}</h2>
        <div className="text-gray-600 text-sm mb-2">
          Created {moment(post?.created_at).fromNow()} by {post?.author}
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: contentToShow }} />
      {fullContent.length > maxLengthToShow && (
        <button
          className="text-blue-600 hover:underline"
          onClick={toggleShowFullContent}
        >
          {showFullContent ? "See Less" : "See More"}
        </button>
      )}
      <div className="flex items-center justify-end space-x-2 bg-gray-300 rounded p-2">
        <button
          className="text-blue-500 hover:underline"
          //   onClick={() => handleVote(post.id, "upvote")}
        >
          Upvote
        </button>
        <span className="text-gray-600">({post?.upvote_count})</span>
        <button
          className="text-red-500 hover:underline"
          //   onClick={() => handleVote(post.id, "downvote")}
        >
          Downvote
        </button>
        <span className="text-gray-600">({post?.downvote_count})</span>
      </div>
    </div>
  );
};

PostView.prototype = {
  post: PropTypes.object.isRequired,
  wordLimit: PropTypes.number,
};

export default PostView;
