import Button from "../Components/Button";
import PostEditor from "../Components/PostEditor";
import { useEffect, useState } from "react";
import { useAddPostMutation } from "../Store/APIs/PostsAPI";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addPost, result] = useAddPostMutation();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleCreatePostClick = () => {
    addPost({ title, content });
  };

  useEffect(() => {
    if (result.isSuccess) {
      setTitle("");
      setContent("");
    }
  }, [result]);

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-4/5 p-6 h-4/5">
        <h1 className="md-0 text-center text-4xl font-semibold">Create Post</h1>
        <p className="text-blue-600">
          {result?.isLoading ? `Loading...` : null}
        </p>
        <p className="text-red-600">
          {result?.isError ? `Error occured` : null}
        </p>
        <p className="text-green-600">
          {result?.isSuccess ? `Successfully posted` : null}
        </p>
        {/* <PostEditor header={"Title :"} onChange={handleTitleChange} /> */}
        <div className="md-0 mx-4">
          <label htmlFor="title" className={"text-xl font-semibold py-2"}>
            Title :
          </label>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={handleTitleChange}
            className={
              "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            }
          />
        </div>
        <PostEditor
          header={"Content :"}
          onChange={handleContentChange}
          content={content}
        />
        <div className="flex justify-end mx-4">
          <Button
            secondary
            onClick={handleCreatePostClick}
            className="rounded text-white focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Create Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
