import PropTypes from "prop-types";
import { useState } from "react";
import Comment from "./Comment";

const CommentPanel = ({ comments }) => {
  const [visibleComments, setVisibleComments] = useState(2);
  const [showAllComments, setShowAllComments] = useState(false);

  if (!comments) {
    return <p className="text-red-500">No comments found</p>;
  }

  const showMoreComments = () => {
    setVisibleComments(visibleComments + 2);
  };

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  let renderViewMore = null;
  if (parseInt(comments.length) > visibleComments && comments.length > 0) {
    renderViewMore = (
      <button
        className="text-blue-600 hover:underline mt-2"
        onClick={toggleShowAllComments}
      >
        {showAllComments ? "Hide Comments" : "View All Comments"}
      </button>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <ul>
        {comments
          .slice(0, showAllComments ? comments.length : visibleComments)
          .map((comment) => (
            <li key={comment.id} className="mb-4 border-b pb-2">
              <Comment
                content={comment?.content}
                author={comment?.author}
                created_at={comment?.created_at}
                authorID={comment?.user_id}
                author_avatar={comment?.author_avatar}
                wordLimit={400}
              />
            </li>
          ))}
      </ul>
      {!showAllComments &&
      parseInt(comments.length) > visibleComments &&
      comments.length > 0 ? (
        <>
          <button
            className="text-blue-600 hover:underline"
            onClick={showMoreComments}
          >
            View More Comments
          </button>
          <br />
        </>
      ) : null}
      {renderViewMore}
    </div>
  );
};

CommentPanel.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.string,
      author: PropTypes.string,
      created_at: PropTypes.string,
    })
  ),
};

export default CommentPanel;
