import { useEffect } from "react";
import { useLogoutQuery } from "../Store";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Logout = ({ logoutFrontPart }) => {
  const { refetch, isError, isLoading, isSuccess } = useLogoutQuery();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);
  useEffect(() => {
    if (isSuccess) {
      logoutFrontPart();
      return navigate("/");
    }
  }, [navigate, logoutFrontPart, isSuccess]);
  let render = null;
  if (isLoading) {
    render = "Logging out..";
  }
  if (isSuccess) {
    render = "Logged out successfully";
  }
  if (isError) {
    render = "An unexpected error occured";
  }
  return (
    <div>
      <h1 className="flex justify-center items-center">{render}</h1>
    </div>
  );
};

Logout.propTypes = {
  logoutFrontPart: PropTypes.func.isRequired,
};

export default Logout;
