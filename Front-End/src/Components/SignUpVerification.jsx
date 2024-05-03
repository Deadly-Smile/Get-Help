import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSignUpVerifyMutation } from "../Store";
import PropTypes from "prop-types";
import LoadingContext from "../Context/LoadingContext";
import ToastMessage from "./ToastMessage";

const SignUpVerification = ({ message, userId }) => {
  const navigate = useNavigate();
  const [verify, setVerify] = useState("");
  const [signUpVerify, result] = useSignUpVerifyMutation();
  const { id } = useParams();
  const isLoadingContext = useContext(LoadingContext);
  const [showToast, setShowToast] = useState(false);
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };

  useEffect(() => {
    isLoadingContext.isLoading = result.isLoading;
  }, [result.isLoading]);
  useEffect(() => {
    if (result?.isError || result?.isSuccess) {
      handleShowToast();
    }
  }, [result?.isError, result?.isSuccess]);

  useEffect(() => {
    if (result.isSuccess) {
      return navigate("/");
    }
  }, [navigate, result.isSuccess]);

  const handleVerificationSubmit = (event) => {
    event.preventDefault();
    if (!userId) {
      userId = id;
    }
    signUpVerify({ id: userId, code: verify });
  };

  let render = null;
  if (result.isSuccess) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type={"success"} message={"E-mail verified"} />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-8 shadow-lg rounded-md w-96">
        <p className="mb-3 text-lg">{message}</p>
        <form>
          <div className="mb-4">
            <input
              type="text"
              className="input input-bordered input-primary w-full max-w-xs"
              placeholder="Verification Code"
              value={verify}
              onChange={(event) => {
                setVerify(event.target.value);
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-warning"
              type="submit"
              onClick={handleVerificationSubmit}
            >
              Submit Code
            </button>
          </div>
        </form>
        {render}
      </div>
    </div>
  );
};

SignUpVerification.propTypes = {
  message: PropTypes.string.isRequired,
  userId: PropTypes.number,
};

export default SignUpVerification;
