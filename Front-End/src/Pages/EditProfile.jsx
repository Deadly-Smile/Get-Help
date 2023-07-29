import { useState } from "react";
import Button from "../Components/Button";
import classNames from "classnames";
import { useEditUserMutation } from "../Store";

const EditUserForm = () => {
  const [editUser, result] = useEditUserMutation();
  const [formData, setFormData] = useState({
    mobile: "",
    nid_card_number: "",
    country: "",
    district: "",
    address: "",
    document: null,
    name: "",
    date_of_birth: "",
    avatar: null,
    old_password: "",
    new_password: "",
    confirm_password: "",
    is_a_doctor: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle avatar separately
    if (type === "file" && name === "avatar") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: files[0] || null, // Set to null if no file selected
      }));
    } else {
      setFormData((prevFormData) =>
        type === "checkbox"
          ? { ...prevFormData, [name]: checked }
          : { ...prevFormData, [name]: value }
      );
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    setFormData({ ...formData, is_a_doctor: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const formDataToSend = new FormData();

    // Handle the avatar separately
    if (formData.avatar instanceof File) {
      formDataToSend.append("avatar", formData.avatar);
    }

    // Append other fields to the formDataToSend
    for (const key in formData) {
      if (key === "name") {
        // Use 'name' as the key for both frontend and backend
        formDataToSend.append("name", formData[key]);
      } else if (key === "dateOfBirth") {
        // Format the date and use 'date_of_birth' for the backend
        const formattedDate = new Date(formData[key]).toLocaleDateString(
          "en-CA"
        );
        formDataToSend.append("date_of_birth", formattedDate);
      } else if (key !== "avatar") {
        // Append other fields except 'avatar', 'name', and 'dateOfBirth'
        formDataToSend.append(key, formData[key]);
      }
    }

    // Now call the editUser mutation with the formDataToSend object
    try {
      const result = await editUser(formDataToSend);
      console.log("is worked");
      console.log("Result:", result);
      // Handle success
    } catch (error) {
      // Handle error
      console.log("did not work");
      console.error("Error:", error);
    }
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    setFormData({ ...formData, is_a_doctor: false });
  };

  const labelClassnames = classNames(
    "text-sm font-bold mr-2 w-1/4 flex items-center justify-start"
  );
  const inputClassnames = classNames(
    "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
  );

  const subscriberform = (
    <>
      <section>
        <div className="flex mb-4">
          <label htmlFor="name" className={labelClassnames}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label htmlFor="date_of_birth" className={labelClassnames}>
            Date of Birth:
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label htmlFor="avatar" className={labelClassnames}>
            Change Avatar:
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleChange}
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label htmlFor="old_password" className={labelClassnames}>
            Old Password:
          </label>
          <input
            type="password"
            id="old_password"
            name="old_password"
            value={formData.old_password}
            placeholder="Old Password"
            onChange={handleChange}
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label htmlFor="new_password" className={labelClassnames}>
            New Password:
          </label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            value={formData.new_password}
            placeholder="New Password"
            onChange={handleChange}
            className={inputClassnames}
          />
        </div>
        <div className="flex mb-4">
          <label htmlFor="confirm_password" className={labelClassnames}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            placeholder="Confirm Password"
            onChange={handleChange}
            className={inputClassnames}
          />
        </div>
      </section>
      <section>
        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            onClick={handleApply}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Apply To Become A Doctor
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            secondary
            rounded
            className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
          >
            Save Changes
          </Button>
        </div>
      </section>
    </>
  );

  const additionalForm = (
    <section>
      <div className="flex mb-4">
        <label htmlFor="mobile" className={labelClassnames}>
          Mobile:
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          placeholder="Mobile Number"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="nid_card_number" className={labelClassnames}>
          NID Card Number:
        </label>
        <input
          type="text"
          id="nid_card_number"
          name="nid_card_number"
          value={formData.nid_card_number}
          placeholder="NID no."
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="country" className={labelClassnames}>
          Country:
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          placeholder="Your Country"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="district" className={labelClassnames}>
          District:
        </label>
        <input
          type="text"
          id="district"
          name="district"
          value={formData.district}
          placeholder="Your District"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="address" className={labelClassnames}>
          House No.:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          placeholder="Your house no. & Street name must be included"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="document" className={labelClassnames}>
          Add a Document:
        </label>
        <input
          type="file"
          id="document"
          name="document"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          onClick={handleGoBack}
          secondary
          rounded
          className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
        >
          Go Back
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          secondary
          rounded
          className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
        >
          Apply
        </Button>
      </div>
    </section>
  );

  return (
    <>
      <section>
        <form
          className="mx-auto my-4 p-6 max-w-4xl bg-white rounded shadow"
          encType="multipart/form-data"
        >
          <h2 className="font-bold text-5xl mb-4 flex justify-center">
            Edit User
          </h2>
          {formData.is_a_doctor ? additionalForm : subscriberform}
        </form>
      </section>
      <div>
        {result.isLoading && (
          <p className="flex justify-center text-blue-950">Loading...</p>
        )}
        {result.isSuccess && (
          <p className="flex justify-center text-blue-950">
            Edited successfully
          </p>
        )}
        {result.isError && (
          <p className="flex justify-center text-red-600">
            Something went wrong
          </p>
        )}
      </div>
    </>
  );
};

export default EditUserForm;
