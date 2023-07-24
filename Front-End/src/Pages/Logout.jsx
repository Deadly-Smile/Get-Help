import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
import { useLogoutMutation } from "../Store";

const Logout = () => {
  const navigate = useNavigate();
  const [logout, result] = useLogoutMutation();

  useEffect(() => {
    logout("Please work properly");
  }, [logout]);

  useEffect(() => {
    if (result.isSuccess) {
      navigate("/");
    }
  }, [navigate, result.isSuccess]);

  let render = null;
  if (result.isLoading) {
    render = "Logging out..";
  }
  if (result.isSuccess) {
    render = "Logged out successfully";
  }
  if (result.isError) {
    render = "An unexpected error occured";
  }
  return (
    <div>
      <h1 className="flex justify-center items-center">{render}</h1>
    </div>
  );
};

export default Logout;
