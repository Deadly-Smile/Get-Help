import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUpVerifyMutation } from "../Store";

const SignUpVerification = ({ message, id }) => {
  const navigate = useNavigate();
  const [verify, setVerify] = useState("");
  const [signUpVerify, result] = useSignUpVerifyMutation();

  useEffect(() => {
    if (result.isSuccess) {
      return navigate("/");
    }
  }, [result.isSuccess]);

  const handleVerificationSubmit = (event) => {
    event.preventDefault();
    signUpVerify({ id, code: verify });
  };
  return (
    <div className="container-sm" style={{ maxWidth: "500px" }}>
      <p className="text-success">{message}</p>
      {result.isLoading && <p className="text-info">Loading...</p>}
      <form className="row g-3">
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Verification Code"
            value={verify}
            onChange={(event) => {
              setVerify(event.target.value);
            }}
          />
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-primary mb-3"
            onClick={handleVerificationSubmit}
          >
            Submit Code
          </button>
        </div>
      </form>
      {result.isSuccess && <p className="text-success">E-mail verified</p>}
    </div>
  );
};

export default SignUpVerification;
