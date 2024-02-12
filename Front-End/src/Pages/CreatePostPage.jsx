import Button from "../Components/Button";
import PostEditor from "../Components/PostEditor";
import { useContext, useEffect, useState } from "react";
import { useAddPostMutation } from "../Store/APIs/PostsAPI";
import LoadingContext from "../Context/LoadingContext";
import ToastMessage from "../Components/ToastMessage";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addPost, result] = useAddPostMutation();
  const isLoadingContext = useContext(LoadingContext);

  const [showToast, setShowToast] = useState(false);
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };

  useEffect(() => {
    if (result?.isLoading) {
      isLoadingContext.setProgress(30);
    } else {
      isLoadingContext.setProgress(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.isLoading]);

  useEffect(() => {
    if (result?.isError || result?.isSuccess) {
      handleShowToast();
    }
  }, [result?.isError, result?.isSuccess]);

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

  let render = null;
  if (result?.isError) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type={"error"} message={"Failed to create post"} />
        )}
      </div>
    );
  }
  if (result?.isSuccess) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type={"success"} message={result?.data?.message} />
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-4/5 p-6 h-4/5">
        <h1 className="md-0 text-center text-4xl font-semibold">Create Post</h1>

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
          {render}
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
