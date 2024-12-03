import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";

const Comment = ({
  content,
  author,
  created_at,
  wordLimit,
  authorID,
  author_avatar,
}) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
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
    <div className="bg-base-100 p-2 rounded">
      <div className="flex justify-between">
        <div className="flex">
          <img
            src={
              author_avatar
                ? `${backEndURL}${author_avatar}`
                : "https://cdn.onlinewebfonts.com/svg/img_329115.png"
            }
            alt={`${author}'s Avatar`}
            className="max-w-[24px] max-h-6 rounded-full"
          />
          <Link to={`/home/get-user/${authorID}`}>
            <h1 className="font-semibold ml-2 text-blue-600 hover:text-green-800 hover:underline">
              {author}
            </h1>
          </Link>
        </div>
        <div className="text-sm ">{moment(created_at).fromNow()}</div>
      </div>
      <div className="ml-8">
        <p className="">{contentToShow}</p>
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
      </div>
    </div>
  );
};

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  author_avatar: PropTypes.string,
  wordLimit: PropTypes.number,
  authorID: PropTypes.number,
};
export default Comment;
