import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../Store";
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
    <div className="hero">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6 max-w-[230px]">
              Unlock a lot more features that can help you find yourself the
              best treatment that you need
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered"
                  required
                  value={authInfo.username}
                  onChange={(event) => {
                    setAuthInfo({ ...authInfo, username: event.target.value });
                  }}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                  value={authInfo.password}
                  onChange={(event) => {
                    setAuthInfo({ ...authInfo, password: event.target.value });
                  }}
                />
                <label className="label">
                  <Link href="#" className="label-text-alt link link-hover">
                    Forgot password?
                  </Link>
                </label>
                <p className="text-error">
                  {errorMsg.length !== 0 && errorMsg}
                </p>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-warning">Login</button>
              </div>
              <p>
                <span className="mr-2">{`Don't have an account?`}</span>
                <Link className="link link-primary" to={"/signup"}>
                  Sign Up now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>

    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <Panel className="bg-white p-8 shadow-md rounded-md max-w-sm">
    //     <h2 className="text-3xl font-semibold mb-4 text-center">Login</h2>
    //     <form onSubmit={handleSubmit}>
    //       <div className="mb-4">
    //         <label className="block text-gray-700 font-medium">Username</label>
    //         <input
    //           type="text"
    //           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
    //           placeholder="Username"
    //           value={authInfo.username}
    //           onChange={(event) => {
    //             setAuthInfo({ ...authInfo, username: event.target.value });
    //           }}
    //         />
    //       </div>

    //       <div className="mb-4">
    //         <label className="block text-gray-700 font-medium">Password</label>
    //         <input
    //           type="password"
    //           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
    //           placeholder="Password"
    //           value={authInfo.password}
    //           onChange={(event) => {
    //             setAuthInfo({ ...authInfo, password: event.target.value });
    //           }}
    //         />
    //       </div>
    //       <div className="mb-3">
    //         <p className="text-red-600 flex justify-end">
    //           {errorMsg.length !== 0 && errorMsg}
    //         </p>
    //       </div>
    //       <Button
    //         className="w-full flex items-center justify-center text-white px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
    //         secondary
    //         rounded
    //         type="submit"
    //       >
    //         Log In
    //       </Button>

    //       <p className="mt-2 flex justify-end text-gray-950">
    //         {`Don't have an account?`}{" "}
    //         <Link to="/signup">
    //           <strong className=" hover:text-gray-800 hover:underline">
    //             {" "}
    //             Sign Up now
    //           </strong>
    //         </Link>
    //       </p>
    //     </form>
    //   </Panel>
    // </div>
  );
};

export default Login;
