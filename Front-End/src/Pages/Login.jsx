import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../Store";
import Button from "../Components/Button";
import Panel from "../Components/Panel";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [authInfo, setAuthInfo] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [login, result] = useLoginMutation();
  const navigate = useNavigate();
  const failMessage = "Incorrect username or password*";
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
  // useEffect(() => {
  //   window.location.reload();
  // }, []);
  useEffect(() => {
    if (result.isSuccess && result.data) {
      setAuthInfo({ username: "", password: "" });
      return navigate("/");
    }
  }, [navigate, result.data, result.isSuccess]);

  useEffect(() => {
    if (result.error) {
      if (errorMsg !== failMessage) {
        setErrorMsg(failMessage);
      }
    }
  }, [errorMsg, result.error, result.isError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Panel className="bg-white p-8 shadow-md rounded-md max-w-sm">
        <h2 className="text-3xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Username"
              value={authInfo.username}
              onChange={(event) => {
                setAuthInfo({ ...authInfo, username: event.target.value });
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Password"
              value={authInfo.password}
              onChange={(event) => {
                setAuthInfo({ ...authInfo, password: event.target.value });
              }}
            />
          </div>
          <div className="mb-3">
            <p className="text-red-600 flex justify-end">
              {errorMsg.length !== 0 && errorMsg}
            </p>
          </div>
          <Button
            className="w-full flex items-center justify-center text-white px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
            secondary
            rounded
            type="submit"
          >
            Log In
          </Button>

          <p className="mt-2 flex justify-end text-gray-950">
            {`Don't have an account?`}{" "}
            <Link to="/signup">
              <strong className=" hover:text-gray-800 hover:underline">
                {" "}
                Sign Up now
              </strong>
            </Link>
          </p>
        </form>
      </Panel>
    </div>
  );
};

export default Login;
