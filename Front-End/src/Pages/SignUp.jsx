import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { useAddUserMutation } from "../Store";
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
    if (result.error.data.errors) {
      usernameFieldError = (
        <p className="text-danger">{result.error.data.errors.username}</p>
      );
      nameFieldError = (
        <p className="text-danger">{result.error.data.errors.name}</p>
      );
      emailFieldError = (
        <p className="text-danger">{result.error.data.errors.email}</p>
      );
      passwordFieldError = (
        <p className="text-danger">{result.error.data.errors.password}</p>
      );
      password_confirmationFieldError = (
        <p className="text-danger">
          {result.error.data.errors.password_confirmation}
        </p>
      );
    }
    // console.log(result.data.data.message);
  }
  let form = (
    <form className="container-sm" style={{ marginTop: "30px" }}>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          onChange={onUsernameChange}
          value={newUser.username}
        />
      </div>
      <div className="form-text">{usernameFieldError}</div>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          onChange={onNameChange}
          value={newUser.name}
        />
      </div>
      <div className="form-text">{nameFieldError}</div>
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          aria-describedby="emailHelp"
          placeholder="E-mail"
          onChange={onEmailChange}
          value={newUser.email}
        />
      </div>
      <div className="form-text">
        {emailFieldError}
        {!emailFieldError && (
          <p>We will never share your email with anyone else.</p>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={onPasswordChange}
          value={newUser.password}
        />
      </div>
      <div className="form-text">{passwordFieldError}</div>
      <div className="mb-3">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          onChange={onConfirm_passwordChange}
          value={newUser.confirm_password}
        />
      </div>
      <div className="form-text">{password_confirmationFieldError}</div>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
        Sign up
      </button>
      <p style={{ marginTop: "8px" }}>
        {`Already have an account? `}
        <Link to="/login">Log in</Link> now
      </p>
    </form>
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
    <div className="" style={{ margin: "10px 15% 10px 15%" }}>
      <div style={{ textAlign: "center" }}>
        <h3>
          <Link to={"/"}>Go Home</Link>
        </h3>
        <h1>Create User</h1>
        {result.isLoading && <h2>Loading...</h2>}
        {result.error && <h3 className="text-danger">{result.status}</h3>}
        {waitForMailMessage}
      </div>
      {form}
    </div>
  );
};

export default SignUp;
