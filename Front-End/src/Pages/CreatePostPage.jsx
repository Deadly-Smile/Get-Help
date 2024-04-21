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
    setTimeout(() => setShowToast(false), 3000);
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
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center">
        <h1 className="text-center text-3xl font-semibold mb-8">Create Post</h1>
        <label className="form-control w-full max-w-xl">
          <div className="label">
            <span className="label-text text-lg">Title of the post</span>
          </div>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={handleTitleChange}
            className="input input-bordered w-full max-w-xl"
          />
        </label>
        <label className="form-control w-full max-w-xl mt-4">
          <div className="label">
            <span className="label-text text-lg">Post body</span>
          </div>
          <PostEditor onChange={handleContentChange} content={content} />
        </label>

        <div className="flex justify-end mt-4">
          <button onClick={handleCreatePostClick} className="btn btn-warning">
            Create Post
          </button>
        </div>
      </div>
      {render}
    </div>
  );
};

export default CreatePostPage;
