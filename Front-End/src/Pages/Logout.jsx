import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
import { useLogoutMutation } from "../Store";
import ToastMessage from "../Components/ToastMessage";
import LoadingContext from "../Context/LoadingContext";
import MsgListContext from "../Context/MsgListContext";

const Logout = () => {
  const navigate = useNavigate();
  const [logout, result] = useLogoutMutation();
  const [showToast, setShowToast] = useState(false);
  const isLoadingContext = useContext(LoadingContext);
  const { removeAll } = useContext(MsgListContext);

  useEffect(() => {
    if (result.isLoading) {
      isLoadingContext.setProgress(30);
    } else {
      isLoadingContext.setProgress(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isLoading]);

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };

  useEffect(() => {
    if (logout?.isSuccess || logout?.isError) {
      handleShowToast();
    }
  }, [logout?.isSuccess, logout?.isError]);

  useEffect(() => {
    logout("Please work properly");
  }, [logout]);

  useEffect(() => {
    if (result.isSuccess) {
      removeAll();
      navigate("/login");
    }
  }, [navigate, removeAll, result.isSuccess]);

  let render = null;
  if (result.isSuccess) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type="success" message={"Successfully Logged Out"} />
        )}
      </div>
    );
  }
  if (result.isError) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type="error" message={"An unexpected error occured"} />
        )}
      </div>
    );
  }
  return (
    <div>
      <h1 className="flex justify-center items-center">{render}</h1>
    </div>
  );
};

export default Logout;
