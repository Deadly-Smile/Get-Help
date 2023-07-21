import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddUserMutation } from "../Store";
import Button from "../Components/Button";
import Panel from "../Components/Panel";
import SignUpVerification from "../Components/SignUpVerification";

const SignUp = () => {
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [addUser, result] = useAddUserMutation();
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
  let usernameFieldError = null;
  let nameFieldError = null;
  let emailFieldError = null;
  let passwordFieldError = null;
  let password_confirmationFieldError = null;
  let waitForMailMessage = null;
  if (result.status === "rejected") {
    if (result.error.data) {
      if (result.error.data.errors) {
        usernameFieldError = result.error.data.errors.username;
        nameFieldError = result.error.data.errors.name;
        emailFieldError = result.error.data.errors.email;
        passwordFieldError = result.error.data.errors.password;
        password_confirmationFieldError =
          result.error.data.errors.password_confirmation;
      }
    }

    // console.log(result.data.data.message);
  }
  let form = (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Panel className="bg-white p-8 shadow-md rounded-md max-w-lg">
        <h2 className="text-3xl font-semibold mb-4 text-center">Signup</h2>
        <form className="">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Username"
              onChange={onUsernameChange}
              value={newUser.username}
            />
            <p className="text-sm text-red-600">{usernameFieldError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Name"
              onChange={onNameChange}
              value={newUser.name}
            />
            <p className="text-sm text-red-600">{nameFieldError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Email address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              aria-describedby="emailHelp"
              placeholder="E-mail"
              onChange={onEmailChange}
              value={newUser.email}
            />
            <p className="text-sm text-red-600">{emailFieldError}</p>
            {!emailFieldError && (
              <p className="text-sm text-gray-500">
                We will never share your email with anyone else.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Password"
              onChange={onPasswordChange}
              value={newUser.password}
            />
            <p className="text-sm text-red-600">{passwordFieldError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Confirm Password"
              onChange={onConfirm_passwordChange}
              value={newUser.confirm_password}
            />
            <p className="text-sm text-red-600">
              {password_confirmationFieldError}
            </p>
          </div>
          <Button
            className="w-full flex items-center justify-center text-white px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
            secondary
            rounded
            type="submit"
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <p className="mt-2 flex justify-end text-gray-950">
            {`Already have an account? `}
            <Link to="/login">
              <strong className=" hover:text-gray-800 hover:underline">
                Log in now
              </strong>
            </Link>
          </p>
        </form>
      </Panel>
    </div>
  );
  if (result.isSuccess) {
    if (result.data.message) {
      waitForMailMessage = (
        <SignUpVerification
          message={result.data.message}
          id={result.data.data.id}
        />
      );
      form = null;
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* <div>
        <h3>
          <Link to={"/"}>Go Home</Link>
        </h3>
        <h1>Create User</h1>
        {result.isLoading && <h2>Loading...</h2>}
        {result.error && <h3 className="text-danger">{result.status}</h3>}
        
      </div> */}
      {form}
      <div className="mb-3">{waitForMailMessage}</div>
    </div>
  );
};

export default SignUp;
