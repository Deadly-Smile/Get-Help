import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSignUpVerifyMutation } from "../Store";
import PropTypes from "prop-types";
import Button from "./Button";

const SignUpVerification = ({ message, userId }) => {
  const navigate = useNavigate();
  const [verify, setVerify] = useState("");
  const [signUpVerify, result] = useSignUpVerifyMutation();
  const { id } = useParams();

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
    // console.log(object)
    signUpVerify({ id: userId, code: verify });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <p className="text-blue-800 mb-3">{message}</p>
        {result.isLoading && (
          <p className="text-sm text-green-600 flex justify-center">
            Loading...
          </p>
        )}
        <form>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Verification Code"
              value={verify}
              onChange={(event) => {
                setVerify(event.target.value);
              }}
            />
          </div>
          <div>
            <Button
              className="w-full flex items-center justify-center text-white px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
              secondary
              rounded
              type="submit"
              onClick={handleVerificationSubmit}
            >
              Submit Code
            </Button>
          </div>
        </form>
        {result.isSuccess && (
          <p className="text-sm text-green-600">E-mail verified</p>
        )}
      </div>
    </div>
  );
};

SignUpVerification.propTypes = {
  message: PropTypes.string.isRequired,
  userId: PropTypes.number,
};

export default SignUpVerification;
