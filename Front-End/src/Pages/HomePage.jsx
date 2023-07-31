import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Panel from "../Components/Panel";
import { Link } from "react-router-dom";
import { useTestMutation } from "../Store/APIs/UsersAPI";

const HomePage = ({ data, isLoading, isError }) => {
  const backEndURL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    picture: null,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [test, result] = useTestMutation();
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle avatar separately
    if (type === "file" && name === "picture") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        picture: files[0] || null, // Set to null if no file selected
      }));
    } else {
      setFormData((prevFormData) =>
        type === "checkbox"
          ? { ...prevFormData, [name]: checked }
          : { ...prevFormData, [name]: value }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("Clicked");
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("date_of_birth", formData.date_of_birth);
    formDataToSend.append("picture", formData.picture);
    test(formDataToSend);
  };

  useEffect(() => {
    if (result.isSuccess) {
      setImageUrl(`${backEndURL}${result.data.picture_url}`);
    }
  }, [result]);

  const formRender = (
    <Panel className="bg-white p-8 shadow-md rounded-md max-w-sm">
      <h2 className="text-3xl font-semibold mb-4 text-center">Login</h2>
      <div className="flex justify-center">
        {result.isLoading ? (
          <p className="md-0 text-fuchsia-900 font-medium">Loading...</p>
        ) : null}
        {result.isError ? (
          <p className="md-0 text-red-800 font-medium">Error occured</p>
        ) : null}
        {result.isSuccess ? (
          <p className="md-0 text-green-800 font-medium">
            Succesfully completed operation
          </p>
        ) : null}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Name"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="date_of_birth"
            className="block text-gray-700 font-medium"
          >
            Date of Birth:
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Select a picture
          </label>
          <input
            type="file"
            name="picture"
            id="picture"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={handleChange}
          />
        </div>
        <Button
          className="w-full flex items-center justify-center text-white px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          secondary
          rounded
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Panel>
  );
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
  return (
    <div className="flex justify-center items-center">
      {formRender}{" "}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

HomePage.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default HomePage;
