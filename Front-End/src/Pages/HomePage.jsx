/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>
        <Link to="/about">About</Link>
      </h1>
      <h1>
        <Link to="*">Not Found</Link>
      </h1>
    </div>
  );
};

export default HomePage;
