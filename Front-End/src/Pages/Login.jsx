import { useState } from "react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../Store";
import Button from "../Components/Button";
import Panel from "../Components/Panel";

const Login = () => {
  const [authInfo, setAuthInfo] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [login, result] = useLoginMutation();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (authInfo.username.length === 0 || authInfo.password.length === 0) {
      setErrorMsg("Username and Password field must be filled*");
    } else {
      login({
        username: authInfo.username,
        password: authInfo.password,
      });
    }
  };
  return (
    <Panel className="justify-center text-center mt-10 mx-56">
      {result.isLoading && <h4>Loading...</h4>}
      {result.isError && <h4>{result.status}</h4>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={authInfo.username}
            onChange={(event) => {
              setAuthInfo({ ...authInfo, username: event.target.value });
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={authInfo.password}
            onChange={(event) => {
              setAuthInfo({ ...authInfo, password: event.target.value });
            }}
          />
        </div>
        <div>
          <p className="text-red-700">{errorMsg.length !== 0 && errorMsg}</p>
        </div>
        <Button secondary rounded type="submit">
          Log In
        </Button>
        {/* <button
          type="submit"
          className="bg-orange-50 hover:bg-orange-600 rounded p-2"
          onClick={handleSubmit}
        >
          Log in
        </button> */}

        <p className="mt-2">
          {`Don't have an account? `}
          <Link to="/signup">Sign Up</Link> now
        </p>
      </form>
    </Panel>
  );
};

export default Login;
