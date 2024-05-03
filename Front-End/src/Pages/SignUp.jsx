import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAddUserMutation } from "../Store";
import SignUpVerification from "../Components/SignUpVerification";
import LoadingContext from "../Context/LoadingContext";
import ToastMessage from "../Components/ToastMessage";

const SignUp = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [addUser, result] = useAddUserMutation();
  const isLoadingContext = useContext(LoadingContext);
  const [showToast, setShowToast] = useState(false);
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };

  useEffect(() => {
    isLoadingContext.isLoading = result.isLoading;
  }, [result.isLoading]);
  useEffect(() => {
    if (result?.isError || result?.isSuccess) {
      handleShowToast();
    }
  }, [result?.isError, result?.isSuccess]);

  const onUsernameChange = (event) => {
    setNewUser({ ...newUser, username: event.target.value });
  };
  const onNameChange = (event) => {
    setNewUser({ ...newUser, name: event.target.value });
  };
  const onEmailChange = (event) => {
    setNewUser({ ...newUser, email: event.target.value });
  };
  const onPasswordChange = (event) => {
    setNewUser({ ...newUser, password: event.target.value });
  };
  const onConfirm_passwordChange = (event) => {
    setNewUser({ ...newUser, confirm_password: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    addUser({
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      password_confirmation: newUser.confirm_password,
    });
  };

  let render = null;
  if (result.status === "rejected") {
    if (result?.error?.data?.errors) {
      let message;
      for (const key in result.error.data.errors) {
        // console.log(typeof result.error.data.errors[key][0]);
        // message.concat(" ", result.error.data.errors[key][0]);
        message = `${message}\n${result.error.data.errors[key][0]}`;
      }
      // console.log(message);
      if (message.length > 0) {
        render = (
          <div>
            {showToast && <ToastMessage type={"error"} message={message} />}
          </div>
        );
      }
    }
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

  let waitForMailMessage = null;
  let form = (
    <div className="hero min-h-screen bg-base-200">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              onChange={onUsernameChange}
              value={newUser.username}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Name"
              onChange={onNameChange}
              value={newUser.name}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              onChange={onEmailChange}
              value={newUser.email}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password"
              onChange={onPasswordChange}
              value={newUser.password}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Password confirmation"
              onChange={onConfirm_passwordChange}
              value={newUser.confirm_password}
            />
          </label>
          <button type="submit" className="btn btn-warning">
            Sign up
          </button>
          <p className="mt-2 flex justify-end">
            {`Already have an account? `}
            <Link to="/login">
              <strong className="link link-primary">Log in now</strong>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
  if (result.isSuccess) {
    if (result.data.message) {
      waitForMailMessage = (
        <SignUpVerification
          message={result?.data?.message}
          userId={result?.data?.data?.id}
        />
      );
      form = null;
    }
  }

  return (
    <div className="bg-base-100">
      <div className="flex items-center justify-center min-h-screen">
        {form}
        <div className="mb-3">{waitForMailMessage}</div>
      </div>
      {render}
    </div>
  );
};

export default SignUp;
