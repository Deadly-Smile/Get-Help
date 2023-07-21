import PropTypes from "prop-types";

const HomePage = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <p className="flex justify-center items-center text-5xl">Loading...</p>
    );
  }
  if (isError) {
    return (
      <p className="flex justify-center items-center text-5xl">
        Error getting data
      </p>
    );
  }
  return <div>{data?.name}</div>;
};

HomePage.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default HomePage;
