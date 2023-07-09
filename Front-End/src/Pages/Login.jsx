// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <form className="container-sm" style={{ marginTop: "30px" }}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" placeholder="Username" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label">Remember Me</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Log in
        </button>
        <p style={{ marginTop: "8px" }}>
          {`Don't have an account? `}
          <Link to="/signup">Sign Up</Link> now
        </p>
      </form>
    </div>
  );
};

export default Login;
