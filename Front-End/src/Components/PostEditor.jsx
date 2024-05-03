import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import PropTypes from "prop-types";
const PostEditor = ({ onChange, content, ...rest }) => {
  const editor = (
    <ReactQuill
      theme="snow"
      value={content ? content : ""}
      onChange={onChange}
      modules={{
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "blockquote", "code-block"],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["clean"],
        ],
      }}
      placeholder="Start typing..."
    />
  );

  return (
    <div className="" {...rest}>
      {editor}
    </div>
  );
};

PostEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  content: PropTypes.string,
};

export default PostEditor;
