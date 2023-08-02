import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const HomePage = ({ data, isLoading, isError, isSuccess }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const [imgURL, setImgURL] = useState(null);
  useEffect(() => {
    if (isSuccess && data) {
      setImgURL(`${backEndURL}${data.avatar}`);
    }
  }, [backEndURL, data, isSuccess]);
  if (isLoading) {
    return (
      <p className="flex justify-center items-center text-5xl">Loading...</p>
    );
  }
  if (isError) {
    return (
      <div className="m-0 min-h-screen">
        <p className="flex justify-center items-center text-5xl">
          Error getting data
        </p>
      </div>
    );
  }

  const renderBro = (
    <div>
      <h2>{data?.name}</h2>
      {imgURL && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={imgURL}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </div>
      )}
    </div>
  );

  return <div>{renderBro}</div>;
};

HomePage.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
};

export default HomePage;
