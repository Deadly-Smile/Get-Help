import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";

const Comment = ({ content, author, created_at, wordLimit, authorID }) => {
  const fullContent = content;
  const maxLengthToShow = wordLimit ? wordLimit : 500;

  const [showFullContent, setShowFullContent] = useState(false);
  const contentToShow = showFullContent
    ? fullContent
    : fullContent.slice(0, maxLengthToShow);

  const toggleShowFullContent = () => {
    setShowFullContent(!showFullContent);
  };
  return (
    <div>
      <p className="text-gray-700">{contentToShow}</p>
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
      <div className="flex items-center mt-1">
        <span className="text-gray-800">
          By{" "}
          <Link
            to={`/get-user/${authorID}`}
            className="hover:text-green-800 hover:underline"
          >
            {author}
          </Link>
        </span>
        <span className="text-gray-500 text-sm mx-2">·</span>
        <span className="text-gray-500 text-sm">
          {moment(created_at).fromNow()}
        </span>
      </div>
    </div>
  );
};

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  wordLimit: PropTypes.number,
  authorID: PropTypes.number,
};
export default Comment;
